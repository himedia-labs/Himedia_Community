/**
 * @description 관리자 왼쪽 사이드바 카테고리 기준으로 섹션을 나눕니다.
 * management: 회원/권한/승인 상태 관리
 * monitoring: 접근/감사 로그 모니터링
 */

export {
  AdminAdminsSection,
  AdminPendingUsersSection,
  AdminRejectedUsersSection,
  AdminUsersSection,
} from '@/app/(routes)/(private)/admin/_components/features/management';

export {
  AdminAccessLogsSection,
  AdminAuditLogsSection,
} from '@/app/(routes)/(private)/admin/_components/features/monitoring';
