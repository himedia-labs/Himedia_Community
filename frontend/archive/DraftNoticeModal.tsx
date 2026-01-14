'use client';

import { useRouter } from 'next/navigation';

import type { DraftNoticeModalProps } from '@/app/shared/types/post';

import styles from './DraftNoticeModal.module.css';

export default function DraftNoticeModal({ onClose }: DraftNoticeModalProps) {
  const router = useRouter();

  const handleYes = () => {
    router.push('/posts/drafts');
    onClose();
  };

  const handleNo = () => {
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={handleNo}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <h2 className={styles.title}>임시 저장 불러오기</h2>
        <p className={styles.message}>작성 중인 글이 있어요. 계속할까요?</p>
        <div className={styles.buttons}>
          <button type="button" className={styles.buttonPrimary} onClick={handleYes}>
            네
          </button>
          <button type="button" className={styles.buttonSecondary} onClick={handleNo}>
            아니요
          </button>
        </div>
      </div>
    </div>
  );
}
