import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '비밀번호 찾기',
  robots: {
    index: false,
    follow: false,
  },
};

export default function FindPasswordLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
