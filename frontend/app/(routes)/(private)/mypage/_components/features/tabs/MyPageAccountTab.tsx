import { MyPageAccountSkeleton } from '@/app/(routes)/(private)/mypage/MyPage.skeleton';
import MyPageWithdrawModal from '@/app/(routes)/(private)/mypage/_components/modals/MyPageWithdrawModal';
import MyPageAccountSettingsSection from '@/app/(routes)/(private)/mypage/_components/features/sections/MyPageAccountSettingsSection';

import type { MyPageAccountTabProps } from '@/app/shared/types/mypage';

/**
 * 계정 설정 탭
 * @description 계정 설정 본문과 탈퇴 모달을 조합한다
 */
export default function MyPageAccountTab(props: MyPageAccountTabProps) {
  if (props.isUserInfoLoading) {
    return <MyPageAccountSkeleton />;
  }

  return (
    <>
      <MyPageAccountSettingsSection {...props} />
      {props.isWithdrawModalOpen ? <MyPageWithdrawModal {...props} /> : null}
    </>
  );
}
