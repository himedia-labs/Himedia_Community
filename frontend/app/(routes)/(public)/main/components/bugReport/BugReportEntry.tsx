'use client';

import { FiFlag } from 'react-icons/fi';

import ActionModal from '@/app/shared/components/modal/ActionModal';

import BugReportForm from '@/app/(routes)/(public)/main/components/bugReport/BugReportForm';
import { useBugReportForm } from '@/app/(routes)/(public)/main/components/bugReport/useBugReportForm';

import styles from '@/app/(routes)/(public)/main/components/bugReport/BugReportEntry.module.css';

/**
 * 버그 제보 진입 컴포넌트
 * @description 버그 제보 버튼과 모달을 렌더링한다
 */
export default function BugReportEntry() {
  const {
    noticeTitle,
    noticeContent,
    isNoticeModalOpen,
    isNoticeSubmitting,
    isNoticeImageUploading,
    noticeImageInputRef,
    noticeAttachments,
    noticeTitleMaxLength,
    noticeContentMaxLength,
    noticeAttachmentMaxCount,
    handleOpenNoticeModal,
    handleCloseNoticeModal,
    handleSubmitNotice,
    handleNoticeTitleKeyDown,
    handleNoticeTitleChange,
    handleNoticeContentKeyDown,
    handleNoticeContentChange,
    handleClickNoticeImageUpload,
    handleChangeNoticeImage,
    handleRemoveNoticeAttachment,
  } = useBugReportForm();

  return (
    <>
      <button
        type="button"
        className={styles.bugReportButton}
        aria-label="버그 신고"
        title="버그 신고"
        onClick={handleOpenNoticeModal}
      >
        <FiFlag />
      </button>

      {isNoticeModalOpen ? (
        <ActionModal
          title="버그 제보"
          subtitle="재현 방법을 함께 남겨주시면 확인이 빨라집니다."
          leftAction={
            <div className={styles.noticeModalLeftAction}>
              <button
                type="button"
                className={styles.noticeModalUploadButton}
                onClick={handleClickNoticeImageUpload}
                disabled={isNoticeImageUploading || noticeAttachments.length >= noticeAttachmentMaxCount}
              >
                {isNoticeImageUploading ? '업로드 중...' : '이미지 첨부'}
              </button>
              <input
                ref={noticeImageInputRef}
                type="file"
                accept=".jpg,.jpeg,.png,.webp,.gif,image/jpeg,image/png,image/webp,image/gif"
                multiple
                className={styles.noticeModalImageInput}
                onChange={event => handleChangeNoticeImage(event.target.files)}
              />
            </div>
          }
          body={
            <BugReportForm
              noticeTitle={noticeTitle}
              noticeContent={noticeContent}
              noticeAttachments={noticeAttachments}
              noticeTitleMaxLength={noticeTitleMaxLength}
              noticeContentMaxLength={noticeContentMaxLength}
              onTitleKeyDown={handleNoticeTitleKeyDown}
              onTitleChange={handleNoticeTitleChange}
              onContentKeyDown={handleNoticeContentKeyDown}
              onContentChange={handleNoticeContentChange}
              onRemoveAttachment={handleRemoveNoticeAttachment}
            />
          }
          confirmLabel="등록"
          cancelLabel="닫기"
          confirmDisabled={!noticeTitle.trim() || !noticeContent.trim() || isNoticeSubmitting || isNoticeImageUploading}
          cancelDisabled={isNoticeSubmitting || isNoticeImageUploading}
          onClose={isNoticeSubmitting || isNoticeImageUploading ? () => undefined : handleCloseNoticeModal}
          onConfirm={handleSubmitNotice}
        />
      ) : null}
    </>
  );
}
