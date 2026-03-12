import type { Metadata } from 'next';

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

/**
 * 비공개 라우트 레이아웃
 * @description private 라우트 전체에 공통 robots 정책을 적용합니다.
 */
export default function PrivateLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
