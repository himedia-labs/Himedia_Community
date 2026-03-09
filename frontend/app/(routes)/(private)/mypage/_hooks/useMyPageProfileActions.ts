import {
  createHandleProfileAction,
  createHandleProfileCancelAll,
  createHandleProfileSaveAll,
  createProfileInputChangeHandler,
} from '@/app/(routes)/(private)/mypage/_handlers';
import { formatProfileSocialLinks } from '@/app/shared/utils/post';

import type { UseMyPageProfileActionsParams } from '@/app/shared/types/mypage';

/**
 * 마이페이지 프로필 액션 훅
 * @description 프로필 저장/취소 액션과 소셜 입력 핸들러를 조합한다
 */
export const useMyPageProfileActions = (params: UseMyPageProfileActionsParams) => {
  // 파생 상태
  const isProfileActionPending = params.isProfileSaving || params.isProfileUpdating;
  const profileSocialLinks = formatProfileSocialLinks({
    profileContactEmail: params.profileContactEmail,
    profileGithubUrl: params.profileGithubUrl,
    profileLinkedinUrl: params.profileLinkedinUrl,
    profileTwitterUrl: params.profileTwitterUrl,
    profileFacebookUrl: params.profileFacebookUrl,
    profileWebsiteUrl: params.profileWebsiteUrl,
  });

  // 입력 핸들러
  const handleProfileContactEmailChange = createProfileInputChangeHandler(params.setProfileContactEmail);
  const handleProfileGithubUrlChange = createProfileInputChangeHandler(params.setProfileGithubUrl);
  const handleProfileLinkedinUrlChange = createProfileInputChangeHandler(params.setProfileLinkedinUrl);
  const handleProfileTwitterUrlChange = createProfileInputChangeHandler(params.setProfileTwitterUrl);
  const handleProfileFacebookUrlChange = createProfileInputChangeHandler(params.setProfileFacebookUrl);
  const handleProfileWebsiteUrlChange = createProfileInputChangeHandler(params.setProfileWebsiteUrl);

  // 액션 핸들러
  const handleProfileSaveAll = createHandleProfileSaveAll({
    isProfileActionPending,
    handleProfileSave: params.handleProfileSave,
    handleAvatarSave: params.handleAvatarSave,
    handleProfileEditComplete: params.handleProfileEditComplete,
  });
  const handleProfileAction = createHandleProfileAction({
    isProfileActionPending,
    isProfileEditing: params.isProfileEditing,
    handleProfileEditStart: params.handleProfileEditStart,
    handleProfileSaveAll,
  });
  const handleProfileCancelAll = createHandleProfileCancelAll({
    isProfileActionPending,
    handleAvatarCancel: params.handleAvatarCancel,
    handleProfileCancel: params.handleProfileCancel,
  });

  return {
    isProfileActionPending,
    profileSocialLinks,
    handlers: {
      handleProfileAction,
      handleProfileCancelAll,
      handleProfileContactEmailChange,
      handleProfileGithubUrlChange,
      handleProfileLinkedinUrlChange,
      handleProfileTwitterUrlChange,
      handleProfileFacebookUrlChange,
      handleProfileWebsiteUrlChange,
    },
  };
};
