import { FaFacebookF, FaLinkedinIn, FaXTwitter } from 'react-icons/fa6';
import { FiGithub, FiGlobe, FiMail } from 'react-icons/fi';

import { formatPostPreview } from '@/app/shared/utils/post';

import type { PostAuthorRef } from '@/app/shared/types/post';
import type { PostDetailAuthorSocialLink } from '@/app/shared/types/post';

/**
 * 프로필 링크 경로 생성
 * @description 작성자 핸들 값으로 프로필 경로를 생성
 */
export const getAuthorProfilePath = (profileHandle?: string | null) => {
  if (!profileHandle) return '';
  return `/@${profileHandle.replace(/^@/, '')}`;
};

/**
 * 프로필 소개 요약
 * @description 작성자 소개 문자열을 정리하고 미리보기 형태로 반환
 */
export const getAuthorProfileBioPreview = (profileBio?: string | null) => {
  return formatPostPreview(profileBio?.trim() ?? '');
};

/**
 * 소셜 링크 목록 생성
 * @description 작성자 프로필 데이터로 노출 가능한 소셜 링크를 구성
 */
export const buildAuthorSocialLinks = (author?: PostAuthorRef | null): PostDetailAuthorSocialLink[] => {
  const socialLinks: PostDetailAuthorSocialLink[] = [
    {
      href: author?.profileContactEmail?.trim() ? `mailto:${author.profileContactEmail.trim()}` : '',
      icon: FiMail,
      label: '이메일',
      external: false,
    },
    {
      href: author?.profileGithubUrl?.trim() ?? '',
      icon: FiGithub,
      label: '깃허브',
      external: true,
    },
    {
      href: author?.profileLinkedinUrl?.trim() ?? '',
      icon: FaLinkedinIn,
      label: '링크드인',
      external: true,
    },
    {
      href: author?.profileTwitterUrl?.trim() ?? '',
      icon: FaXTwitter,
      label: 'X',
      external: true,
    },
    {
      href: author?.profileFacebookUrl?.trim() ?? '',
      icon: FaFacebookF,
      label: '페이스북',
      external: true,
    },
    {
      href: author?.profileWebsiteUrl?.trim() ?? '',
      icon: FiGlobe,
      label: '홈페이지',
      external: true,
    },
  ];

  return socialLinks.filter(item => Boolean(item.href));
};
