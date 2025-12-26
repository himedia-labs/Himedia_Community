#!/usr/bin/env bash

# PostgreSQL 데이터베이스 초기화 스크립트
# 사용법:
# 1) PostgreSQL 서버가 실행 중인지 확인합니다.
# 2) script/.env 또는 환경변수(DB_URL/DB_USERNAME/DB_PASSWORD)를 설정합니다.
# 3) ./script/reset-db.sh 실행 (실행 권한 필요: chmod +x script/reset-db.sh)

set -euo pipefail

# Colors for output
readonly RED='\033[0;31m'
readonly GREEN='\033[0;32m'
readonly BLUE='\033[0;34m'
readonly YELLOW='\033[1;33m'
readonly NC='\033[0m' # No Color

# Logging functions
log_info() {
    if [ -t 1 ]; then
        echo -e "${BLUE}[INFO]${NC} $1"
    else
        echo "[INFO] $1"
    fi
}

log_success() {
    if [ -t 1 ]; then
        echo -e "${GREEN}[SUCCESS]${NC} $1"
    else
        echo "[SUCCESS] $1"
    fi
}

log_warning() {
    if [ -t 1 ]; then
        echo -e "${YELLOW}[WARNING]${NC} $1"
    else
        echo "[WARNING] $1"
    fi
}

log_error() {
    if [ -t 1 ]; then
        echo -e "${RED}[ERROR]${NC} $1"
    else
        echo "[ERROR] $1"
    fi
}

# 스크립트 디렉토리 및 프로젝트 루트
readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]:-$0}")" && pwd)"
readonly PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

readonly DEFAULT_DB_NAME="himedia"
readonly DEFAULT_WAIT_TIMEOUT="60"
readonly DEFAULT_SCHEMA_FILE="$PROJECT_ROOT/database/schema.sql"
readonly DEFAULT_SEED_FILE="$PROJECT_ROOT/database/seed.sql"

# 오직 script/.env만 로드합니다. 이미 설정된 환경변수는 덮어쓰지 않습니다.
maybe_source_env() {
  [ "${NO_DOTENV:-}" = "1" ] && return 0
  local candidates=(
    "$SCRIPT_DIR/.env"
  )
  for f in "${candidates[@]}"; do
    if [ -f "$f" ]; then
      log_info "환경변수 파일 로드: $f"
      # shellcheck disable=SC2046,SC2163
      while IFS='=' read -r k v; do
        # skip comments/empty
        if [[ -z "$k" || "$k" =~ ^\s*# ]]; then continue; fi
        # strip export and whitespace
        k="${k#export }"; k="${k// /}"
        export "$k"="${v}"
      done < <(grep -E '^[A-Za-z_][A-Za-z0-9_]*\s*=.*' "$f" | sed -e 's/\r$//')
    fi
  done
}

# DB_URL 파싱 (jdbc:postgresql://host:port/name?...)
parse_db_url() {
  local url="$1"
  [ -z "$url" ] && return 0
  # jdbc 프리픽스 제거
  local rest="${url#jdbc:postgresql://}"
  # 쿼리스트링 제거
  rest="${rest%%\?*}"
  # host:port/db
  local hostport="${rest%%/*}"
  local dbname="${rest#*/}"
  if [ -z "$dbname" ] || [ "$dbname" = "$rest" ]; then
    log_warning "DB_URL에서 데이터베이스 이름을 찾지 못했습니다: $url"
  fi
  local host="$hostport" port=""
  if [[ "$hostport" == *:* ]]; then
    host="${hostport%%:*}"
    port="${hostport#*:}"
  fi
  # 환경변수가 비어 있을 때만 채움
  [ -z "${DB_HOST:-}" ] && [ -n "$host" ] && export DB_HOST="$host"
  [ -z "${DB_PORT:-}" ] && [ -n "$port" ] && export DB_PORT="$port"
  [ -z "${DB_NAME:-}" ] && [ -n "$dbname" ] && export DB_NAME="$dbname"
}

# --- config bootstrap ---
init_config() {
  # .env 로드 및 DB_URL 해석 (환경변수 우선)
  maybe_source_env
  parse_db_url "${DB_URL:-}"

  for var in DB_HOST DB_PORT DB_NAME DB_USER DB_PASSWORD; do
    if [ -z "${!var:-}" ]; then
      log_error "$var 환경변수가 설정되어 있지 않습니다."
      exit 1
    fi
  done

  # 환경변수로 오버라이드 가능
  DB_HOST="${DB_HOST}"
  DB_PORT="${DB_PORT}"
  DB_USER="${DB_USERNAME:-${DB_USER}}"
  DB_NAME="${DB_NAME}"
  SCHEMA_FILE="${SCHEMA_FILE:-$DEFAULT_SCHEMA_FILE}"
  SEED_FILE="${SEED_FILE:-$DEFAULT_SEED_FILE}"
  WAIT_TIMEOUT="${WAIT_TIMEOUT:-$DEFAULT_WAIT_TIMEOUT}"

  # 상대 경로 스키마 파일은 프로젝트 루트를 기준으로 시도합니다.
  if [[ "$SCHEMA_FILE" != /* ]]; then
    local project_candidate="$PROJECT_ROOT/$SCHEMA_FILE"
    if [ -f "$project_candidate" ]; then
      SCHEMA_FILE="$project_candidate"
    fi
  fi

  if [[ "$SEED_FILE" != /* ]]; then
    local seed_candidate="$PROJECT_ROOT/$SEED_FILE"
    if [ -f "$seed_candidate" ]; then
      SEED_FILE="$seed_candidate"
    fi
  fi
}

# PostgreSQL CLI가 PATH에 있는지 확인합니다. 필요한 경우 대표 설치 경로를 자동 추가합니다.
add_psql_path_if_needed() {
  local dir="$1"
  [ -d "$dir" ] || return 1
  [ -x "$dir/psql" ] || return 1
  case ":$PATH:" in
    *":$dir:"*) : ;;
    *) PATH="$dir:$PATH" ;;
  esac
  return 0
}

ensure_psql_tools() {
  if [ -n "${PSQL_BIN_DIR:-}" ]; then
    add_psql_path_if_needed "$PSQL_BIN_DIR" || true
  fi

  if ! command -v psql >/dev/null 2>&1; then
    local candidates=(
      /opt/homebrew/bin
      /usr/local/bin
      /opt/homebrew/opt/libpq/bin
      /usr/local/opt/libpq/bin
      /opt/homebrew/opt/postgresql/bin
      /usr/local/opt/postgresql/bin
      /Applications/Postgres.app/Contents/Versions/latest/bin
    )
    for dir in "${candidates[@]}" \
      /Library/PostgreSQL/*/bin \
      /opt/homebrew/opt/postgresql@*/bin \
      /usr/local/opt/postgresql@*/bin \
      /opt/homebrew/Cellar/postgresql@*/[0-9]*/bin \
      /usr/local/Cellar/postgresql@*/[0-9]*/bin \
      /usr/lib/postgresql/*/bin \
      /usr/pgsql-*/bin \
      /usr/local/pgsql/bin; do
      add_psql_path_if_needed "$dir" || true
      if command -v psql >/dev/null 2>&1; then
        break
      fi
    done

    if ! command -v psql >/dev/null 2>&1 && command -v brew >/dev/null 2>&1; then
      local brew_candidates=()
      for formula in libpq postgresql postgresql@17 postgresql@16 postgresql@15; do
        local prefix="$(brew --prefix "$formula" 2>/dev/null || true)"
        if [ -n "$prefix" ]; then
          brew_candidates+=("$prefix/bin")
        fi
      done
      for dir in "${brew_candidates[@]}"; do
        add_psql_path_if_needed "$dir" || true
        if command -v psql >/dev/null 2>&1; then
          break
        fi
      done
    fi
  fi

  for cmd in psql pg_isready dropdb createdb; do
    if ! command -v "$cmd" >/dev/null 2>&1; then
      log_error "필요한 명령어 '$cmd' 를 찾을 수 없습니다. PATH를 확인하거나 PSQL_BIN_DIR 환경변수로 경로를 지정하세요."
      exit 1
    fi
  done
}

# prepare psql and common options when needed
prepare_psql() {
  ensure_psql_tools

  if [ -n "${DB_PASSWORD:-}" ]; then
    export PGPASSWORD="$DB_PASSWORD"
  fi

  PSQL_OPTS=( -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" )

  if [ "${DEBUG:-${DB_DEBUG:-0}}" = "1" ]; then
    log_info "DEBUG 모드 활성화: PATH=$PATH"
    log_info "which psql: $(command -v psql)"
    if command -v pg_isready >/dev/null 2>&1; then
      log_info "which pg_isready: $(command -v pg_isready)"
    fi
  fi
}

# prepare_psql()가 먼저 호출되어야 PSQL_OPTS가 채워집니다.
psql_db() {
  local database="$1"
  shift
  psql -X "${PSQL_OPTS[@]}" -d "$database" "$@"
}

# debug print of resolved config
print_config() {
  log_info "DB_URL=${DB_URL:-<unset>}"
  log_info "DB_HOST=$DB_HOST DB_PORT=$DB_PORT DB_NAME=$DB_NAME DB_USER=$DB_USER"
  if [ -n "${PGPASSWORD:-${DB_PASSWORD:-}}" ]; then
    log_info "PGPASSWORD=**** (set)"
  else
    log_info "PGPASSWORD=<unset>"
  fi
  log_info "SCHEMA_FILE=$SCHEMA_FILE SEED_FILE=$SEED_FILE WAIT_TIMEOUT=$WAIT_TIMEOUT"
}

 

wait_for_ready() {
  log_info "PostgreSQL 서버 연결 확인 중 (host=$DB_HOST port=$DB_PORT user=$DB_USER)..."
  local start_ts now_ts elapsed
  start_ts=$(date +%s)
  while true; do
    if pg_isready "${PSQL_OPTS[@]}" -d template1 >/dev/null 2>&1; then
      break
    fi
    now_ts=$(date +%s)
    elapsed=$(( now_ts - start_ts ))
    if [ "$elapsed" -ge "$WAIT_TIMEOUT" ]; then
      if [ "$DB_HOST" = "localhost" ]; then
        log_warning "localhost 연결 실패. 127.0.0.1로 다시 시도합니다."
        DB_HOST="127.0.0.1"
        PSQL_OPTS=( -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" )
        start_ts=$(date +%s)
        continue
      fi
      log_error "DB 연결에 실패했습니다. host=$DB_HOST port=$DB_PORT user=$DB_USER (대기 ${WAIT_TIMEOUT}s 초과)"
      log_warning "Docker 사용 시 컨테이너/포트 포워딩(예: 5432:5432) 확인"
      log_warning "로컬 설치 시 서비스 실행/pg_hba.conf 확인"
      exit 1
    fi
    log_warning "DB 연결 대기 중... (${elapsed}s)"
    sleep 1
  done
  log_success "PostgreSQL 서버 연결 완료."
}

# --- helpers: DB 존재/세션 종료/강제 삭제 ---
db_exists() {
  psql_db postgres -v ON_ERROR_STOP=0 -At -c "SELECT 1 FROM pg_database WHERE datname='${DB_NAME}'" | grep -q 1
}

terminate_db_sessions() {
  # 새 연결 방지 후 기존 세션 종료 (존재할 때만)
  if db_exists; then
    log_info "DB 연결 차단(CONNECTION LIMIT 0) 및 CONNECT 권한 회수 시도..."
    psql_db postgres -v ON_ERROR_STOP=0 -c "ALTER DATABASE \"${DB_NAME}\" CONNECTION LIMIT 0;" >/dev/null 2>&1 || true
    psql_db postgres -v ON_ERROR_STOP=0 -c "REVOKE CONNECT ON DATABASE \"${DB_NAME}\" FROM PUBLIC;" >/dev/null 2>&1 || true
    # 대상 유저가 있으면 해당 유저의 CONNECT도 회수 (실패해도 무시)
    if [ -n "${DB_USER:-}" ]; then
      psql_db postgres -v ON_ERROR_STOP=0 -c "REVOKE CONNECT ON DATABASE \"${DB_NAME}\" FROM \"${DB_USER}\";" >/dev/null 2>&1 || true
    fi
    log_info "활성 세션을 종료합니다..."
    psql_db postgres -v ON_ERROR_STOP=0 -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname='${DB_NAME}' AND pid <> pg_backend_pid();" >/dev/null 2>&1 || true
  fi
}

wait_until_no_sessions() {
  local start_ts=$(date +%s)
  while true; do
    local cnt
    cnt=$(psql_db postgres -v ON_ERROR_STOP=0 -At -c "SELECT count(*) FROM pg_stat_activity WHERE datname='${DB_NAME}' AND pid <> pg_backend_pid();" 2>/dev/null | tr -d '[:space:]') || cnt=""
    if [ -z "$cnt" ]; then cnt=0; fi
    if [ "$cnt" = "0" ]; then break; fi
    local now_ts=$(date +%s)
    local elapsed=$(( now_ts - start_ts ))
    if [ "$elapsed" -ge "$WAIT_TIMEOUT" ]; then
      log_warning "세션 종료 대기 시간 초과(${WAIT_TIMEOUT}s). 남은 세션 수: $cnt"
      break
    fi
    log_warning "남은 세션 수: $cnt (대기 ${elapsed}s)"
    sleep 1
  done
}

# apply schema only
apply_schema_only() {
  if [ ! -f "$SCHEMA_FILE" ]; then
    log_error "스키마 파일 '$SCHEMA_FILE'을 찾을 수 없습니다."
    exit 1
  fi
  log_info "스키마 파일 '$SCHEMA_FILE' 적용 중..."
  psql_db "$DB_NAME" -v ON_ERROR_STOP=1 -f "$SCHEMA_FILE" > /dev/null
  log_success "스키마 적용 완료."
}

apply_seed() {
  if [ ! -f "$SEED_FILE" ]; then
    log_warning "시드 파일 '$SEED_FILE'을 찾을 수 없습니다. 시드 적용을 건너뜁니다."
    return 0
  fi
  log_info "시드 파일 '$SEED_FILE' 적용 중..."
  psql_db "$DB_NAME" -v ON_ERROR_STOP=1 -f "$SEED_FILE" > /dev/null
  log_success "시드 적용 완료."
}

main() {
  init_config
  prepare_psql
  [ "${DEBUG:-${DB_DEBUG:-0}}" = "1" ] && print_config
  wait_for_ready

  log_info "데이터베이스 '$DB_NAME'를 초기화합니다..."
  log_info "(1/5) 기존 '$DB_NAME' 데이터베이스의 모든 연결을 종료합니다."
  terminate_db_sessions
  wait_until_no_sessions

  log_info "(2/5) 기존 '$DB_NAME' 데이터베이스를 삭제합니다."
  if ! dropdb --if-exists "${PSQL_OPTS[@]}" "$DB_NAME"; then
    log_error "데이터베이스 삭제 실패: 활성 세션이 남아있을 수 있습니다. 다른 애플리케이션 연결을 종료한 뒤 다시 시도하세요."
    exit 1
  fi

  log_info "(3/5) 새 '$DB_NAME' 데이터베이스를 생성합니다."
  createdb "${PSQL_OPTS[@]}" "$DB_NAME"
  log_info "(4/5) 스키마를 적용합니다."

  apply_schema_only
  log_info "(5/5) 시드를 적용합니다."
  apply_seed

  echo ""
  log_success "모든 작업이 성공적으로 완료되었습니다!"
  echo ""
}

main "$@"
