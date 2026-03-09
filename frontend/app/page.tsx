import Banner from './(routes)/(public)/main/components/banner/banner';
import PostListSection from './(routes)/(public)/main/components/postList/postList';

import type { HomePageProps } from '@/app/shared/types/home';

/**
 * 홈 페이지
 * @description 메인 배너와 포스트 리스트를 표시
 */
export default async function Home({ searchParams }: HomePageProps) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const isSearchMode = Object.prototype.hasOwnProperty.call(resolvedSearchParams, 'search');

  return (
    <>
      {!isSearchMode ? <Banner /> : null}
      <PostListSection />
    </>
  );
}
