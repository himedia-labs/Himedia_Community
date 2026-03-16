import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '기술 블로그',
};

export default function BlogsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
