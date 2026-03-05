import DocsPageTemplate from '@/app/(routes)/(public)/docs/_components/DocsPageTemplate';
import { TERMS_OF_SERVICE } from '@/app/shared/constants/docs/policies.constants';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '이용약관',
};

/**
 * 이용약관 페이지
 * @description 서비스 이용약관 문서를 표시한다
 */
export default function TermsOfServicePage() {
  return <DocsPageTemplate document={TERMS_OF_SERVICE} />;
}
