import styles from '@/app/(routes)/(public)/posts/[postId]/PostDetail.module.css';

/**
 * 멘션 역할 렌더링
 * @description 멘션 사용자 역할 라벨을 표시
 */
export function PostDetailMentionRole({ name, mentionRoleMap }: { name: string; mentionRoleMap: Map<string, string> }) {
  const role = mentionRoleMap.get(name);
  return role ? <span className={styles.commentMentionRole}>{role}</span> : null;
}
