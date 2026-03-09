import type { RefObject } from 'react';

// 무한 스크롤 파라미터
export interface InfiniteScrollObserverParams {
  enabled?: boolean;
  hasNextPage?: boolean;
  isFetchingNextPage: boolean;
  targetRef: RefObject<HTMLDivElement | null>;
  fetchNextPage: () => Promise<unknown>;
  rootMargin?: string;
}
