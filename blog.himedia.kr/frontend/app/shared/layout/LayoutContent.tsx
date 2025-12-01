'use client';

import { usePathname } from 'next/navigation';
import Header from '../components/header/Header';
import Footer from '../components/footer/Footer';
import ToastProvider from '../components/toast/toast';
import ScrollTopButton from '../components/scroll-top/ScrollTopButton';

export default function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Header를 숨길 경로들
  const hideHeaderPaths = ['/login', '/register', '/find-password'];
  const hideHeader = hideHeaderPaths.includes(pathname);

  // Footer를 숨길 경로들
  const hideFooterPaths = ['/login', '/register', '/find-password'];
  const hideFooter = hideFooterPaths.includes(pathname);

  return (
    <ToastProvider>
      {!hideHeader && <Header />}
      <div className="layout">{children}</div>
      {!hideFooter && <Footer />}
      {!hideFooter && <ScrollTopButton />}
    </ToastProvider>
  );
}
