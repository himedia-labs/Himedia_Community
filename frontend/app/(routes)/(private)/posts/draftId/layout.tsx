import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '임시저장',
};

export default function DraftLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
