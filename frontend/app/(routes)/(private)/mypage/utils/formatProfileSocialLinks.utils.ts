import { FaFacebookF, FaLinkedinIn, FaXTwitter } from 'react-icons/fa6';
import { FiGithub, FiGlobe, FiMail } from 'react-icons/fi';

import type { IconType } from 'react-icons';

export interface ProfileSocialLink {
  href: string;
  label: string;
  icon: IconType;
  external?: boolean;
}

/**
 * 프로필 소셜 링크 포맷
 * @description 소셜 링크 배열을 생성하고 href가 있는 항목만 필터링한다
 */
export const formatProfileSocialLinks = (params: {
  profileContactEmail: string;
  profileGithubUrl: string;
  profileLinkedinUrl: string;
  profileTwitterUrl: string;
  profileFacebookUrl: string;
  profileWebsiteUrl: string;
}): ProfileSocialLink[] => {
  return [
    {
      href: params.profileContactEmail ? `mailto:${params.profileContactEmail}` : '',
      label: '이메일',
      icon: FiMail,
    },
    { href: params.profileGithubUrl, label: '깃허브', icon: FiGithub, external: true },
    { href: params.profileLinkedinUrl, label: '링크드인', icon: FaLinkedinIn, external: true },
    { href: params.profileTwitterUrl, label: 'X', icon: FaXTwitter, external: true },
    { href: params.profileFacebookUrl, label: '페이스북', icon: FaFacebookF, external: true },
    { href: params.profileWebsiteUrl, label: '홈페이지', icon: FiGlobe, external: true },
  ].filter(item => Boolean(item.href));
};
