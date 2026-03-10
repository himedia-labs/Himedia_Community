import ActionModal from '@/app/shared/components/modal/ActionModal';

import styles from '@/app/(routes)/(private)/admin/AdminPage.module.css';

import type { AdminRejectUserModalProps } from '@/app/shared/types/admin';

/**
 * 회원 거절 모달
 * @description 관리자 거절 사유를 입력받고 확인 액션을 제공합니다.
 */
export default function AdminRejectUserModal({
  rejectReason,
  isRejectingUser,
  onClose,
  onConfirm,
  onChange,
}: AdminRejectUserModalProps) {
  return (
    <ActionModal
      title="회원 가입 요청 거절"
      subtitle="거절 사유는 사용자에게 안내 메시지로 사용됩니다."
      body={
        <div className={styles.rejectModalBody}>
          <label className={styles.rejectModalLabel} htmlFor="admin-reject-reason">
            거절 사유
          </label>
          <textarea
            id="admin-reject-reason"
            className={styles.rejectModalTextarea}
            value={rejectReason}
            placeholder="거절 사유를 입력해주세요."
            maxLength={300}
            onChange={onChange}
          />
          <p className={styles.rejectModalHint}>최대 300자까지 입력할 수 있습니다.</p>
        </div>
      }
      cancelLabel="취소"
      confirmLabel="거절"
      confirmVariant="danger"
      cancelDisabled={isRejectingUser}
      confirmDisabled={isRejectingUser || !rejectReason.trim()}
      onClose={onClose}
      onConfirm={onConfirm}
    />
  );
}
