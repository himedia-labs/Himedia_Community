import type { Metadata } from 'next';

import type { MyPageLayoutProps } from '@/app/shared/types/mypage';

export const metadata: Metadata = {
  title: '마이페이지',
};

/**
 * 마이페이지 레이아웃
 * @description 마이페이지 하위 라우트의 메타데이터와 슬롯만 제공합니다.
 */
export default function MypageLayout({ children }: MyPageLayoutProps) {
  return <>{children}</>;
}
