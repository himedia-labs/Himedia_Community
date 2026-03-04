import type { Metadata } from 'next';

import { cookies } from 'next/headers';

import Footer from '@/app/shared/components/footer/Footer';
import Header from '@/app/shared/components/header/Header';

import QueryProvider from '@/app/provider/ReactQuery/QueryProvider';
import ToastProvider from '@/app/shared/components/toast/ToastProvider';
import AuthInitializer from '@/app/provider/AuthProvider/AuthInitializer';
import ChannelTalkLoader from '@/app/provider/ChannelTalk/ChannelTalkLoader';

import ScrollTopButton from '@/app/shared/components/scroll-top/ScrollTopButton';

import '@/app/globals.css';

export const metadata: Metadata = {
  title: {
    template: '%s',
    default: '하이미디어 커뮤니티',
  },
  icons: {
    icon: [
      { url: '/favicon/favicon.ico', sizes: '48x48' },
      { url: '/favicon/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
    ],
    apple: '/favicon/apple-touch-icon.png',
  },
  manifest: '/favicon/site.webmanifest',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  /**
   * header 초기 렌더
   * @description 로그인 후 새로고침 시 `로그인 전 아이콘`으로 보이는 현상을 막기 위함 입니다.
   */
  const cookieStore = await cookies();
  const initialIsLoggedIn = cookieStore.has('refreshToken');

  return (
    <html lang="ko">
      <body>
        <QueryProvider>
          <AuthInitializer />
          <ChannelTalkLoader />
          <ToastProvider>
            <Header initialIsLoggedIn={initialIsLoggedIn} />
            <div className="layout">{children}</div>
            <Footer />
            <ScrollTopButton />
          </ToastProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
