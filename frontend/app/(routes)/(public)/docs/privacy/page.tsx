import DocsPageTemplate from '@/app/(routes)/(public)/docs/_components/DocsPageTemplate';
import { PRIVACY_POLICY } from '@/app/shared/constants/docs/policies.constants';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '개인정보처리방침',
};

/**
 * 개인정보처리방침 페이지
 * @description 개인정보 수집 및 이용 정책 문서를 표시한다
 */
export default function PrivacyPolicyPage() {
  return <DocsPageTemplate document={PRIVACY_POLICY} />;
}
