import type {
  ChangeEvent,
  CompositionEvent,
  Dispatch,
  FocusEvent,
  KeyboardEvent,
  MouseEvent,
  ReactNode,
  RefObject,
  SetStateAction,
} from 'react';
import type { IconType } from 'react-icons';
import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

// 화면 상태
export type ViewMode = 'list' | 'card';
export type SortFilter = 'latest' | 'top' | 'following';

// 공통 응답
type PostMutationResponse = {
  id: string;
};

// 공통 옵션
type PostQueryOptions = {
  enabled?: boolean;
};

// 레거시 모델
export type Post = {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  authorId: string;
  category: string;
  tags: string[];
  date: string;
  timeAgo: string;
  views: number;
  shareCount: number;
  likeCount: number;
  commentCount: number;
  authorName: string;
  authorProfileImageUrl?: string | null;
};

export type TopPost = {
  id: string;
  title: string;
};

export interface Category {
  id: string;
  name: string;
}

export type CategoryListResponse = Category[];

export interface TagSuggestion {
  id: string;
  name: string;
  postCount: number;
}

export type TagSuggestionResponse = TagSuggestion[];

// 게시글 상태
export type PostStatus = 'DRAFT' | 'PUBLISHED';
export type PostSortOption = 'createdAt' | 'publishedAt' | 'viewCount' | 'likeCount';
export type SortOrder = 'ASC' | 'DESC';
export type PostFeedOption = 'following';

// 목록 쿼리
export interface PostListQuery {
  page?: number;
  limit?: number;
  categoryId?: string;
  authorId?: string;
  status?: PostStatus;
  sort?: PostSortOption;
  order?: SortOrder;
  feed?: PostFeedOption;
}

export interface PostCategoryRef {
  id: string;
  name: string;
}

export type UserRole = 'TRAINEE' | 'GRADUATE' | 'MENTOR' | 'INSTRUCTOR' | 'ADMIN';

export interface PostAuthorRef {
  id: string;
  name: string;
  role: UserRole;
  profileImageUrl?: string | null;
  profileHandle?: string | null;
  profileBio?: string | null;
  profileContactEmail?: string | null;
  profileGithubUrl?: string | null;
  profileLinkedinUrl?: string | null;
  profileTwitterUrl?: string | null;
  profileFacebookUrl?: string | null;
  profileWebsiteUrl?: string | null;
  postCount?: number;
  followerCount?: number;
  followingCount?: number;
  isFollowing?: boolean;
}

export interface PostDetailAuthorSocialLink {
  external: boolean;
  href: string;
  icon: IconType;
  label: string;
}

// 목록 모델
export interface PostListItem {
  id: string;
  title: string;
  content?: string;
  thumbnailUrl?: string | null;
  status: PostStatus;
  viewCount: number;
  likeCount: number;
  shareCount: number;
  commentCount: number;
  createdAt: string;
  updatedAt?: string;
  publishedAt: string | null;
  category: PostCategoryRef | null;
  tags?: PostTagRef[];
  author: PostAuthorRef | null;
}

export interface PostListResponse {
  items: PostListItem[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// 상세 모델
export interface PostTagRef {
  id: string;
  name: string;
}

export interface PostDetailResponse {
  id: string;
  title: string;
  content: string;
  thumbnailUrl: string | null;
  status: PostStatus;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  liked: boolean;
  shareCount: number;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
  category: PostCategoryRef | null;
  author: PostAuthorRef | null;
  tags: PostTagRef[];
}

export interface PostShareResponse {
  shareCount: number;
}

export interface PostViewResponse {
  viewCount: number;
}

export interface PostRecentViewResponse {
  postId: string;
}

export interface PostLikeResponse {
  likeCount: number;
  liked: boolean;
}

// 에디터 상태
export type MutableRef<T> = {
  current: T;
};

export type TagCommit = (value: string) => boolean;

export type SelectionRange = {
  start: number;
  end: number;
};

export type InlinePattern = {
  type: 'code' | 'image' | 'link' | 'autolink' | 'bold' | 'strike' | 'underline' | 'italic';
  regex: RegExp;
};

export type MarkdownImageUploadParams = {
  content: string;
  contentRef: RefObject<HTMLTextAreaElement | null>;
  setContentValue: Dispatch<SetStateAction<string>>;
  setContentAndSelection: (nextValue: string, selectionStart: number, selectionEnd?: number) => void;
};

export type MarkdownEditorParams = {
  content: string;
  setContentValue: Dispatch<SetStateAction<string>>;
};

export type SplitViewOptions = {
  defaultValue?: number;
  min?: number;
  max?: number;
};

export type PostPayloadInput = {
  title: string;
  content: string;
  categoryId: string | null;
  tags: string[];
};

export type PostPayloadStatus = 'DRAFT' | 'PUBLISHED';

export type DraftNoticeParams = {
  draftId: string | null;
  hasDrafts: boolean;
};

// 게시글 요청
export interface CreatePostRequest {
  title: string;
  content: string;
  categoryId?: string | null;
  status?: PostStatus;
  tags?: string[];
}

// 게시글 응답
export type CreatePostResponse = PostMutationResponse;

export interface UpdatePostRequest {
  id: string;
  title?: string;
  content?: string;
  categoryId?: string | null;
  status?: PostStatus;
  tags?: string[];
}

export type UpdatePostResponse = PostMutationResponse;

export type DeletePostResponse = PostMutationResponse;

// 상세 페이지
export type PostDetailActionsParams = {
  data?: PostDetailResponse | null;
  postId: string;
};

export type PostDetailRefreshParams = {
  accessToken: string | null;
  isInitialized: boolean;
  refetchComments: () => Promise<unknown>;
  refetchPost: () => Promise<unknown>;
};

export interface UsePostDetailAuthorFollowParams {
  accessToken: string | null;
  isMyPost: boolean;
  postAuthorId: string | null;
  author: PostAuthorRef | null | undefined;
}

export interface UsePostDetailPostMenuParams {
  postId: string;
}

export type FormatPostPreviewOptions = {
  emptyText?: string;
};

export type PostTocItem = {
  id: string;
  level: 1 | 2 | 3;
  text: string;
};

// 드래프트 데이터
export type DraftData = {
  title: string;
  categoryId: string;
  content: string;
  tags: string[];
};

export type DraftSaveOptions = {
  silent?: boolean;
};

export type DraftSaverParams = {
  draftId: string | null;
  formData: DraftData;
  isAuthenticated: boolean;
};

export type PostEditInitializerParams = {
  postDetail?: PostDetailResponse | null;
  applyPartial: (data: Partial<DraftData>) => void;
  setTags: (tags: DraftData['tags']) => void;
};

export type PostEditSaverParams = {
  postId: string;
  formData: DraftData;
};

// 작성 폼 상태
export type AutoSaveParams = {
  formData: DraftData;
  isAuthenticated: boolean;
  saveDraft: (options?: { silent?: boolean }) => Promise<void>;
};

export type PostDetailsFormCategory = {
  categoryId: string;
  categories: Array<{ id: string; name: string }> | undefined;
  isLoading: boolean;
  onCategoryChange: (nextCategoryId: string) => void;
};

export type PostDetailsFormThumbnail = {
  thumbnailUrl: string;
  thumbnailInputRef: RefObject<HTMLInputElement | null>;
  isThumbnailUploading: boolean;
  onThumbnailChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onThumbnailFileClick: () => void;
  onThumbnailFileSelect: (event: ChangeEvent<HTMLInputElement>) => void;
};

export type PostDetailsFormTag = {
  tagInput: string;
  tags: string[];
  tagLengthError: boolean;
  hasTagSuggestions: boolean;
  tagSuggestions: TagSuggestion[];
  onTagChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onTagKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
  onTagBlur: (event: FocusEvent<HTMLInputElement>) => void;
  onTagCompositionStart: () => void;
  onTagCompositionEnd: (event: CompositionEvent<HTMLInputElement>) => void;
  onRemoveTag: (tag: string) => void;
  onTagSuggestionMouseDown: (tagName: string) => (event: MouseEvent<HTMLButtonElement>) => void;
};

export type PostDetailsFormProps = {
  category: PostDetailsFormCategory;
  tag: PostDetailsFormTag;
};

// 메인 목록 액션
export type PostListCreatePostParams = {
  router: AppRouterInstance;
};

export type PostListSortFilterParams = {
  accessToken: string | null;
  router: AppRouterInstance;
  setSortFilter: (value: SortFilter) => void;
};

export type PostListSearchInputKeyDownParams = {
  getSearchInputValue: () => string;
  setSearchKeyword: (value: string) => void;
};

export type PostListToggleViewModeParams = {
  viewMode: ViewMode;
  setViewMode: (value: ViewMode) => void;
};

export type PostListSelectSortFilterParams = {
  handleSortFilter: (nextFilter: SortFilter) => void;
  nextFilter: SortFilter;
};

export type PostListSelectCategoryParams = {
  category: string;
  setSelectedCategory: (value: string) => void;
};

export type PostListToggleCategoryOrderParams = {
  categoryOrder: 'latest' | 'popular';
  setCategoryOrder: (value: 'latest' | 'popular') => void;
};

export type PostListInfiniteScrollParams = {
  hasNextPage?: boolean;
  isFetchingNextPage: boolean;
  sentinelRef: RefObject<HTMLDivElement | null>;
  fetchNextPage: () => Promise<unknown>;
};

// 메인 목록 UI
export type CardPostSkeletonItemProps = {
  index: number;
  skeletonKeyPrefix: string;
  cardTagSkeletonWidths: number[];
};

export type ToolbarItem =
  | { type: 'separator' }
  | { type: 'heading'; level: 1 | 2 | 3; icon: IconType; label: string }
  | {
      type: 'action';
      action: 'bold' | 'italic' | 'underline' | 'strike' | 'quote' | 'code' | 'link' | 'image' | 'bullet' | 'numbered';
      icon: IconType;
      label: string;
    };

export type EditorToolbarProps = {
  onHeading: (level: 1 | 2 | 3) => void;
  onBold: () => void;
  onItalic: () => void;
  onUnderline: () => void;
  onStrike: () => void;
  onQuote: () => void;
  onCode: () => void;
  onLink: () => void;
  onImage: () => void;
  onBullet: () => void;
  onNumbered: () => void;
};

export type PostPreviewProps = {
  title: string;
  categoryName: string;
  authorName: string;
  dateLabel: string;
  authorStats: {
    postCount: number;
    followerCount: number;
    followingCount: number;
  };
  previewStats: {
    views: number;
    likeCount: number;
    commentCount: number;
  };
  content: ReactNode;
  tags: string[];
};

// 목록 옵션
export type PostsQueryOptions = PostQueryOptions;

// 목록 유틸
export type ListPostTagListProps = {
  tags: string[];
  postId: number | string;
};

export type VisibleTagsResult = {
  hiddenCount: number;
  visibleTags: string[];
};

export type PostListActionHandlers = {
  openPostMenuId?: string | null;
  isPostDeleting?: boolean;
  onPostDelete?: (postId: string) => void;
  onPostEdit?: (postId: string) => void;
  onPostMenuToggle?: (postId: string) => void;
};

export interface PostSummaryMenuHandlerParams {
  stopLinkNavigation: (event: MouseEvent<HTMLElement>) => void;
  onPostMenuToggle?: (postId: string) => void;
}

export interface PostSummaryEditHandlerParams {
  stopLinkNavigation: (event: MouseEvent<HTMLElement>) => void;
  onPostEdit?: (postId: string) => void;
}

export interface PostSummaryDeleteHandlerParams {
  stopLinkNavigation: (event: MouseEvent<HTMLElement>) => void;
  onPostDelete?: (postId: string) => void;
}

export interface PostSummaryListProps {
  posts: PostListItem[];
  emptyText: string;
  currentUserId?: string | null;
  emptyClassName?: string;
  actionHandlers?: PostListActionHandlers;
}
