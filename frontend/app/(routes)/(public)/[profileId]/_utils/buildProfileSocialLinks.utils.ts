import { FiGithub, FiGlobe, FiMail } from 'react-icons/fi';
import { FaFacebookF, FaLinkedinIn, FaXTwitter } from 'react-icons/fa6';

import type { PublicProfile } from '@/app/shared/types/auth';
import type { ProfileSocialLink } from '@/app/shared/types/profilePage';

/**
 * 소셜 링크 목록 구성
 * @description 프로필 데이터에서 유효한 링크만 추려 렌더용 목록을 만듭니다.
 */
export const buildProfileSocialLinks = (profile?: PublicProfile | null): ProfileSocialLink[] => {
  const links = [
    {
      href: profile?.profileContactEmail ? `mailto:${profile.profileContactEmail}` : '',
      label: '이메일',
      icon: FiMail,
    },
    { href: profile?.profileGithubUrl, label: '깃허브', icon: FiGithub, external: true },
    { href: profile?.profileLinkedinUrl, label: '링크드인', icon: FaLinkedinIn, external: true },
    { href: profile?.profileTwitterUrl, label: 'X', icon: FaXTwitter, external: true },
    { href: profile?.profileFacebookUrl, label: '페이스북', icon: FaFacebookF, external: true },
    { href: profile?.profileWebsiteUrl, label: '홈페이지', icon: FiGlobe, external: true },
  ];

  return links.filter((item): item is ProfileSocialLink => Boolean(item.href));
};
