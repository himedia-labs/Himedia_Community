import type { QueryClient, QueryKey } from '@tanstack/react-query';

/**
 * 캐시 키 재조회 실행
 * @description 여러 queryKey를 일괄 invalidate 한다
 */
export const invalidateQueryTargets = async (
  queryClient: QueryClient,
  targets: Array<{ queryKey: QueryKey; exact?: boolean }>,
) => {
  await Promise.all(
    targets.map(target =>
      queryClient.invalidateQueries({
        queryKey: target.queryKey,
        exact: target.exact,
      }),
    ),
  );
};

/**
 * 캐시 데이터 갱신
 * @description 단일 queryKey 캐시를 updater로 갱신한다
 */
export const applyQueryDataUpdate = <TData>(
  queryClient: QueryClient,
  queryKey: QueryKey,
  updater: (oldData: TData | undefined) => TData | undefined,
) => {
  queryClient.setQueryData<TData | undefined>(queryKey, updater);
};
