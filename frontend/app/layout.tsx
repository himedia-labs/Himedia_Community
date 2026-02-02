import { cookies } from 'next/headers';
import Header from './shared/components/header/Header';
import Footer from './shared/components/footer/Footer';
import ToastProvider from './shared/components/toast/toast';
import QueryProvider from './provider/ReactQuery/QueryProvider';
import ScrollTopButton from './shared/components/scroll-top/ScrollTopButton';

import './globals.css';
import './reset.css';
import AuthInitializer from './provider/AuthProvider/AuthInitializer';

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
