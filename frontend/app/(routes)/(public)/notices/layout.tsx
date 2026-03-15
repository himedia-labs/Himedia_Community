import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '공지사항',
};

export default function NoticesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
