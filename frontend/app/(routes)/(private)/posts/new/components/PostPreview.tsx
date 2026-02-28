import { RiTwitterXFill } from 'react-icons/ri';
import { FaFacebookSquare, FaGithub, FaLinkedin, FaUser } from 'react-icons/fa';
import { FiEye, FiHeart, FiMail, FiMessageCircle, FiTag } from 'react-icons/fi';

import markdownStyles from '@/app/shared/components/markdown-editor/markdown.module.css';
import styles from '../PostCreate.module.css';

import type { PostPreviewProps } from '@/app/shared/types/post';

/**
 * 게시물 미리보기
 * @description 입력한 내용을 기반으로 미리보기 화면을 표시
 */
export default function PostPreview({
  title,
  categoryName,
  authorName,
  dateLabel,
  authorStats,
  previewStats,
  content,
  tags,
}: PostPreviewProps) {
  return (
    <article className={styles.postPreview}>
      <div className={styles.previewHeadingBlock}>
        <div className={styles.previewTitleRow}>
          <h2 className={styles.previewTitle}>
            {title || '제목이 여기에 표시됩니다'}
            {categoryName ? <span className={styles.previewCategoryInline}>({categoryName})</span> : null}
          </h2>
        </div>
        <div className={styles.previewMeta}>
          <span className={styles.previewMetaGroup}>
            <span className={styles.previewMetaItem}>{authorName}</span>
            <span className={styles.previewMetaSeparator} aria-hidden="true">
              |
            </span>
            <span className={styles.previewMetaItem}>{dateLabel}</span>
          </span>
          <span className={styles.previewMetaGroup}>
            <span className={styles.previewMetaItem}>
              <FiEye aria-hidden="true" /> {previewStats.views.toLocaleString()}
            </span>
            <span className={styles.previewMetaSeparator} aria-hidden="true">
              |
            </span>
            <span className={styles.previewMetaItem}>
              <FiHeart aria-hidden="true" /> {previewStats.likeCount.toLocaleString()}
            </span>
            <span className={styles.previewMetaSeparator} aria-hidden="true">
              |
            </span>
            <span className={styles.previewMetaItem}>
              <FiMessageCircle aria-hidden="true" /> {previewStats.commentCount.toLocaleString()}
            </span>
          </span>
        </div>
      </div>
      <div className={`${styles.previewContent} ${markdownStyles.markdown}`}>{content}</div>
      {tags.length > 0 ? (
        <div className={styles.previewTags}>
          <span className={styles.previewTagIcon} aria-hidden="true">
            <FiTag />
          </span>
          {tags.map(tag => (
            <span key={tag} className={styles.previewTag}>
              #{tag}
            </span>
          ))}
        </div>
      ) : null}
      <section className={styles.previewAuthorProfileCard} aria-label="작성자 프로필 미리보기">
        <div className={styles.previewAuthorProfileMain}>
          <div className={styles.previewAuthorProfileAvatar} aria-hidden="true">
            <FaUser />
          </div>
          <div className={styles.previewAuthorProfileInfo}>
            <div className={styles.previewAuthorProfileNameRow}>
              <span className={styles.previewAuthorProfileName}>{authorName}</span>
              <span className={styles.previewAuthorProfileRole}>작성자</span>
            </div>
            <p className={styles.previewAuthorProfileBio}>작성자 소개글이 여기에 표시됩니다.</p>
            <span className={styles.previewAuthorProfileMeta}>
              글 {authorStats.postCount.toLocaleString()} · 팔로워 {authorStats.followerCount.toLocaleString()} · 팔로잉{' '}
              {authorStats.followingCount.toLocaleString()}
            </span>
          </div>
        </div>
        <div className={styles.previewAuthorProfileSocialDivider} aria-hidden="true" />
        <div className={styles.previewAuthorProfileSocialRow} aria-label="소셜 링크 미리보기">
          <span className={styles.previewAuthorProfileSocialLink} role="img" aria-label="이메일">
            <FiMail aria-hidden="true" />
          </span>
          <span className={styles.previewAuthorProfileSocialLink} role="img" aria-label="깃허브">
            <FaGithub aria-hidden="true" />
          </span>
          <span className={styles.previewAuthorProfileSocialLink} role="img" aria-label="트위터">
            <RiTwitterXFill aria-hidden="true" />
          </span>
          <span className={styles.previewAuthorProfileSocialLink} role="img" aria-label="페이스북">
            <FaFacebookSquare aria-hidden="true" />
          </span>
          <span className={styles.previewAuthorProfileSocialLink} role="img" aria-label="링크드인">
            <FaLinkedin aria-hidden="true" />
          </span>
        </div>
      </section>
    </article>
  );
}
