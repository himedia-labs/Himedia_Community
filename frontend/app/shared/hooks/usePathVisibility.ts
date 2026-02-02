import { usePathname } from 'next/navigation';

import type { PathVisibilityConfig } from '@/app/shared/types/path';

/**
 * 경로 기반 컴포넌트 표시 여부 훅
 * @description 특정 경로에서 컴포넌트 숨김 처리
 */
export const usePathVisibility = (config: PathVisibilityConfig): boolean => {
  const pathname = usePathname();

  const shouldHide =
    config.hidePaths.includes(pathname) || config.hidePrefixes.some(prefix => pathname?.startsWith(prefix));

  return !shouldHide;
};
