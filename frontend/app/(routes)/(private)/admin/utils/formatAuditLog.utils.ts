/**
 * 감사 로그 액션 라벨
 * @description 감사 로그 action 코드를 한글 라벨로 변환
 */
export const formatAuditActionLabel = (action: string) => {
  if (action === 'USER_APPROVED') return '가입 요청';
  if (action === 'USER_APPROVAL_REJECTED') return '가입 요청';
  if (action === 'USER_REJECTED_REMOVED') return '거절 계정';
  if (action === 'POST_FORCED_TO_DRAFT') return '게시글 처분';
  if (action === 'USER_ROLE_UPDATED') return '회원 역할 변경';
  if (action === 'REPORT_STATUS_UPDATED') return '신고 상태 변경';
  return action;
};

/**
 * 감사 로그 대상 라벨
 * @description 감사 로그 target 정보를 한글 설명으로 변환
 */
export const formatAuditTargetLabel = (
  targetType: string,
  targetId: string,
  targetName?: string | null,
  targetEmail?: string | null,
) => {
  if (targetType === 'user') {
    if (targetName && targetEmail) return `${targetName} (${targetEmail} / ${targetId})`;
    if (targetEmail) return `${targetEmail} (${targetId})`;
    if (targetName) return `${targetName} (${targetId})`;
    return `회원 (${targetId})`;
  }
  if (targetType === 'admin_report') return `신고 ID: ${targetId}`;
  if (targetType === 'admin_page') return '관리자 페이지';
  return `${targetType} / ${targetId}`;
};

/**
 * 감사 로그 결과 라벨
 * @description payload의 result/reasonCode 값을 사용자 표시용 텍스트로 변환
 */
export const formatAuditResultLabel = (payload: Record<string, unknown> | null) => {
  const result = payload?.result;
  const reasonCode = payload?.reasonCode;
  if (result === 'SUCCESS') return '성공';
  if (result === 'FAILURE' && typeof reasonCode === 'string') return `실패 (${reasonCode})`;
  if (result === 'FAILURE') return '실패';
  return '보류';
};

/**
 * 감사 로그 결과 톤
 * @description payload 결과값을 배지 색상 톤으로 변환
 */
export const getAuditResultTone = (payload: Record<string, unknown> | null) => {
  const result = payload?.result;
  if (result === 'SUCCESS') return 'success';
  if (result === 'FAILURE') return 'error';
  return 'warning';
};

/**
 * 감사 로그 변경 전 라벨
 * @description payload의 before 스냅샷을 사용자 표시용 문자열로 변환
 */
export const formatAuditBeforeLabel = (action: string, payload: Record<string, unknown> | null) => {
  if (action === 'USER_REJECTED_REMOVED') return '거절 계정';
  if (action === 'USER_APPROVAL_REJECTED' || action === 'USER_APPROVED') {
    return formatApprovalOnlySnapshot(payload, 'before');
  }
  const beforeSnapshot = readSnapshot(payload, 'before');
  if (beforeSnapshot) return formatSnapshot(beforeSnapshot);
  return formatLegacyBeforeSnapshot(payload);
};

/**
 * 감사 로그 변경 후 라벨
 * @description payload의 after 스냅샷을 사용자 표시용 문자열로 변환
 */
export const formatAuditAfterLabel = (action: string, payload: Record<string, unknown> | null) => {
  if (action === 'USER_REJECTED_REMOVED') return '재가입 허용';
  if (action === 'USER_APPROVAL_REJECTED' || action === 'USER_APPROVED') {
    return formatApprovalOnlySnapshot(payload, 'after');
  }
  const afterSnapshot = readSnapshot(payload, 'after');
  if (afterSnapshot) return formatSnapshot(afterSnapshot);
  return formatLegacyAfterSnapshot(payload);
};

/**
 * 승인 상태 전용 스냅샷
 * @description 회원 승인/거절 로그에서 승인 상태만 간단히 표시
 */
const formatApprovalOnlySnapshot = (payload: Record<string, unknown> | null, key: 'before' | 'after') => {
  const snapshot = readSnapshot(payload, key);
  const approved = snapshot?.approved;
  if (typeof approved !== 'boolean') return '미승인';
  return approved ? '승인' : '미승인';
};

/**
 * 스냅샷 읽기
 * @description payload에서 before/after 객체를 안전하게 추출
 */
const readSnapshot = (payload: Record<string, unknown> | null, key: string) => {
  if (!payload) return null;
  const value = payload[key];
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
};

/**
 * 스냅샷 문자열 변환
 * @description 객체 스냅샷을 사용자 친화적인 key/value 문자열로 변환
 */
const formatSnapshot = (snapshot: Record<string, unknown> | null) => {
  if (!snapshot) return '없음';
  const entries = Object.entries(snapshot);
  if (!entries.length) return '없음';

  const filteredEntries = entries.filter(([key]) => key !== 'handledAt');
  if (!filteredEntries.length) return '없음';

  return filteredEntries
    .map(([key, value]) => {
      const label = formatSnapshotKey(key);
      const formattedValue = formatSnapshotValue(key, value);
      if (!label) return formattedValue;
      return `${label}: ${formattedValue}`;
    })
    .join(' / ');
};

/**
 * 스냅샷 키 라벨
 * @description 스냅샷 key를 한글 라벨로 변환
 */
const formatSnapshotKey = (key: string) => {
  if (key === 'approved') return '승인상태';
  if (key === 'role') return '역할';
  if (key === 'status') return '';
  if (key === 'requestedRole') return '신청역할';
  if (key === 'deleted') return '삭제여부';
  if (key === 'email') return '이메일';
  if (key === 'phone') return '전화번호';
  if (key === 'id') return '회원번호';
  if (key === 'handledAt') return '처리시각';
  return key;
};

/**
 * 스냅샷 값 라벨
 * @description 스냅샷 value를 key별 사용자 표시 텍스트로 변환
 */
const formatSnapshotValue = (key: string, value: unknown) => {
  if (key === 'approved' && typeof value === 'boolean') return value ? '승인' : '미승인';
  if (key === 'role' && typeof value === 'string') return formatUserRoleLabel(value);
  if (key === 'requestedRole' && typeof value === 'string') return formatUserRoleLabel(value);
  if (key === 'deleted' && typeof value === 'boolean') return value ? '삭제' : '유지';
  if (key === 'status' && typeof value === 'string') return formatReportStatusLabel(value);
  if (value === null) return '없음';
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') return String(value);
  return JSON.stringify(value);
};

/**
 * 신고 상태 라벨
 * @description 신고 상태 코드를 한글 라벨로 변환
 */
const formatReportStatusLabel = (status: string) => {
  if (status === 'OPEN') return '대기';
  if (status === 'IN_PROGRESS') return '진행중';
  if (status === 'RESOLVED') return '해결';
  if (status === 'REJECTED') return '반려';
  if (status === 'PUBLISHED') return '게시중';
  if (status === 'DRAFT') return '임시저장';
  return status;
};

/**
 * 회원 역할 라벨
 * @description 회원 역할 코드를 한글 라벨로 변환
 */
const formatUserRoleLabel = (role: string) => {
  if (role === 'TRAINEE') return '훈련생';
  if (role === 'GRADUATE') return '수료생';
  if (role === 'MENTOR') return '멘토';
  if (role === 'INSTRUCTOR') return '강사';
  if (role === 'ADMIN') return '관리자';
  return role;
};

/**
 * 레거시 변경 전 스냅샷
 * @description before 필드가 없는 구형 payload를 변경 전 문자열로 변환
 */
const formatLegacyBeforeSnapshot = (payload: Record<string, unknown> | null) => {
  if (!payload) return '없음';
  if (typeof payload.approved === 'boolean') return '미승인';
  if (typeof payload.status === 'string') return '없음';
  return '없음';
};

/**
 * 레거시 변경 후 스냅샷
 * @description after 필드가 없는 구형 payload를 변경 후 문자열로 변환
 */
const formatLegacyAfterSnapshot = (payload: Record<string, unknown> | null) => {
  if (!payload) return '없음';
  if (typeof payload.approved === 'boolean') return payload.approved ? '승인' : '미승인';
  if (typeof payload.status === 'string') return formatReportStatusLabel(payload.status);
  return '없음';
};
