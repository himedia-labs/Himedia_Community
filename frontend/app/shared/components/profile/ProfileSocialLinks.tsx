import type { ProfileSocialLinksProps } from '@/app/shared/types/profilePage';

/**
 * 프로필 소셜 링크
 * @description 아이콘 기반 프로필 소셜 링크 목록을 렌더링합니다.
 */
export default function ProfileSocialLinks({ links, containerClassName, linkClassName }: ProfileSocialLinksProps) {
  if (!links.length) {
    return null;
  }

  return (
    <div className={containerClassName} aria-label="소셜 링크">
      {links.map(({ href, label, icon: Icon, external }) => (
        <a
          key={label}
          className={linkClassName}
          href={href}
          aria-label={label}
          target={external ? '_blank' : undefined}
          rel={external ? 'noreferrer' : undefined}
        >
          <Icon aria-hidden="true" />
        </a>
      ))}
    </div>
  );
}
