/**
 * 블로그 글 목록 응답 항목
 * @description GET /blogs 응답에서 사용되는 단일 항목 형태
 */
export interface BlogEntryView {
  id: string;
  title: string;
  source: string;
  domain: string;
  url: string;
  views: number;
  publishedAt: string;
}

/**
 * 블로그 글 목록 페이지네이션 응답
 * @description 커서 기반 페이지네이션 응답 형태
 */
export interface BlogEntriesResponse {
  items: BlogEntryView[];
  nextCursor: string | null;
}

/**
 * 블로그 피드 소스 응답 항목
 * @description GET /blogs/sources 응답에서 사용되는 단일 항목 형태
 */
export interface BlogFeedSourceView {
  name: string;
  domain: string;
}
