import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '새 글 작성',
};

export default function NewPostLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
