/**
 * 프로필 액션 핸들러 생성
 * @description 프로필 편집 상태에 따라 편집 시작 또는 저장을 실행한다
 */
export const createHandleProfileAction = (params: {
  isProfileActionPending: boolean;
  isProfileEditing: boolean;
  handleProfileEditStart: () => void;
  handleProfileSaveAll: () => Promise<void>;
}) => {
  return () => {
    if (params.isProfileActionPending) return;

    if (!params.isProfileEditing) {
      params.handleProfileEditStart();
      return;
    }

    void params.handleProfileSaveAll();
  };
};

/**
 * 프로필 전체 저장 핸들러 생성
 * @description 프로필과 아바타를 순차적으로 저장하고 편집 모드를 종료한다
 */
export const createHandleProfileSaveAll = (params: {
  isProfileActionPending: boolean;
  handleProfileSave: () => Promise<boolean>;
  handleAvatarSave: () => Promise<boolean>;
  handleProfileEditComplete: () => void;
}) => {
  return async () => {
    if (params.isProfileActionPending) return;

    const isProfileSaved = await params.handleProfileSave();
    if (!isProfileSaved) return;

    const isAvatarSaved = await params.handleAvatarSave();
    if (!isAvatarSaved) return;

    params.handleProfileEditComplete();
  };
};

/**
 * 프로필 전체 취소 핸들러 생성
 * @description 아바타와 프로필 변경사항을 모두 취소한다
 */
export const createHandleProfileCancelAll = (params: {
  isProfileActionPending: boolean;
  handleAvatarCancel: () => void;
  handleProfileCancel: () => void;
}) => {
  return () => {
    if (params.isProfileActionPending) return;

    params.handleAvatarCancel();
    params.handleProfileCancel();
  };
};
