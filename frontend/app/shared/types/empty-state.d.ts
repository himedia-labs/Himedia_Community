import type { ReactNode } from 'react';

// 빈 상태
export type EmptyStateSize = 'default' | 'compact';
export type EmptyStateAlign = 'center' | 'left';

export type EmptyStateProps = {
  title: ReactNode;
  description: ReactNode;
  className?: string;
  size?: EmptyStateSize;
  align?: EmptyStateAlign;
};
