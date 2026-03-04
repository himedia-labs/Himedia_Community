export { formatDate } from '@/app/shared/utils/date.utils';

export { formatRole } from '@/app/(routes)/(public)/posts/[postId]/utils/role.utils';
export { copyToClipboard } from '@/app/(routes)/(public)/posts/[postId]/utils/clipboard.utils';
export { resizeReplyInput } from '@/app/(routes)/(public)/posts/[postId]/utils/replyInput.utils';
export { getCaretIndex, setCaretIndex } from '@/app/(routes)/(public)/posts/[postId]/utils/caret.utils';
export { ensureMentionSpacing } from '@/app/(routes)/(public)/posts/[postId]/utils/mentionSpacing.utils';
export { getMentionQuery, getMentionStartIndex } from '@/app/(routes)/(public)/posts/[postId]/utils/mentionQuery.utils';
export { getAuthorProfilePath } from '@/app/(routes)/(public)/posts/[postId]/utils/postDetailAuthor.utils';
export { getAuthorProfileBioPreview } from '@/app/(routes)/(public)/posts/[postId]/utils/postDetailAuthor.utils';
export { buildAuthorSocialLinks } from '@/app/(routes)/(public)/posts/[postId]/utils/postDetailAuthor.utils';
export {
  renderMentionHtml,
  splitCommentMentions,
} from '@/app/(routes)/(public)/posts/[postId]/utils/mentionRender.utils';
export {
  filterMentionCandidates,
  getMentionHighlightSegments,
} from '@/app/(routes)/(public)/posts/[postId]/utils/mentionFilter.utils';
