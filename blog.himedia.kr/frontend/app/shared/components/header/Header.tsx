'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import { CiLogin } from 'react-icons/ci';
import { useQueryClient } from '@tanstack/react-query';
import { CiBellOff, CiBellOn, CiMenuBurger, CiSearch, CiUser } from 'react-icons/ci';

import { authKeys } from '@/app/api/auth/auth.keys';
import { useCurrentUser } from '@/app/api/auth/auth.queries';
import { useToast } from '@/app/shared/components/toast/toast';
import { useLogoutMutation } from '@/app/api/auth/auth.mutations';
import { useAuthStore } from '@/app/shared/store/authStore';

import styles from './Header.module.css';

import { HeaderProps, NavItem } from './Header.types';
import { HeaderConfig } from './Header.config';

const NAV_ITEMS: NavItem[] = [
  { label: '알림', Icon: CiBellOn },
  { label: '검색', Icon: CiSearch },
  { label: '로그인/프로필', isAuthDependent: true },
];

export default function Header({ initialIsLoggedIn }: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: currentUser } = useCurrentUser();
  const queryClient = useQueryClient();
  const logoutMutation = useLogoutMutation();
  const [isBellOn, setIsBellOn] = useState(true);
  const clearAuth = useAuthStore(state => state.clearAuth);
  const { showToast } = useToast();

  // 특정 경로에서는 Header 숨김
  if (HeaderConfig.hidePaths.includes(pathname)) {
    return null;
  }

  // React Query 데이터가 없으면 서버에서 받은 초기값 사용
  // 이렇게 하면 서버 렌더링과 클라이언트 hydration 시 같은 값을 사용 → 깜빡임 없음
  const isLoggedIn = currentUser !== undefined ? !!currentUser : initialIsLoggedIn;
  const toggleBell = () => setIsBellOn(prev => !prev);
  const isActive = (href?: string) => {
    if (!href) return false;
    if (href === '/') return pathname === '/';
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const handleLogout = async () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        // Zustand: accessToken 제거
        clearAuth();
        // React Query: user 캐시 제거
        queryClient.setQueryData(authKeys.currentUser, null);
        queryClient.invalidateQueries({ queryKey: authKeys.currentUser });
        showToast({ message: '로그아웃되었습니다.', type: 'success' });
        router.push('/');
      },
      onError: () => {
        showToast({ message: '로그아웃에 실패했습니다.', type: 'error' });
      },
    });
  };

  return (
    <header className={styles.container}>
      <div className={styles.wrap}>
        <Link href="/" className={styles.logo}>
          <span className={styles.logoMark}>
            <Image src="/icon/logo.png" alt="하이미디어아카데미 로고" fill priority sizes="90px" draggable={false} />
          </span>
          <span className={styles.logoText}>
            하이미디어커뮤니티
            <span className={styles.logoSub}>HIMEDIA COMMUNITY</span>
          </span>
        </Link>

        <nav className={styles.nav} aria-label="주요 메뉴">
          <ul>
            {NAV_ITEMS.map(item => {
              if (item.isAuthDependent) {
                const Icon = isLoggedIn ? CiLogin : CiUser;
                const label = isLoggedIn ? '로그아웃' : '로그인';

                return (
                  <li key={item.label}>
                    {isLoggedIn ? (
                      <button
                        type="button"
                        className={`${styles.navLink} ${styles.navButton}`}
                        aria-label={label}
                        title={label}
                        onClick={handleLogout}
                      >
                        <Icon aria-hidden="true" focusable="false" />
                      </button>
                    ) : (
                      <Link
                        href="/login"
                        className={pathname === '/login' ? `${styles.navLink} ${styles.navActive}` : styles.navLink}
                        aria-label={label}
                        title={label}
                        aria-current={pathname === '/login' ? 'page' : undefined}
                      >
                        <Icon aria-hidden="true" focusable="false" />
                      </Link>
                    )}
                  </li>
                );
              }

              const isLink = Boolean(item.href);
              const active = isLink ? isActive(item.href) : false;
              const linkClassName = active ? `${styles.navLink} ${styles.navActive}` : styles.navLink;
              const isBellItem = item.label === '알림';
              const IconComponent = isBellItem ? (isBellOn ? CiBellOn : CiBellOff) : item.Icon!;

              return (
                <li key={item.label}>
                  {isLink ? (
                    <Link
                      href={item.href as string}
                      className={linkClassName}
                      aria-label={item.label}
                      title={item.label}
                      aria-current={active ? 'page' : undefined}
                    >
                      <IconComponent aria-hidden="true" focusable="false" />
                    </Link>
                  ) : (
                    <button
                      type="button"
                      className={`${styles.navLink} ${styles.navButton}`}
                      aria-label={item.label}
                      title={item.label}
                      onClick={isBellItem ? toggleBell : undefined}
                    >
                      <IconComponent aria-hidden="true" focusable="false" />
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        <button className={styles.menuButton} aria-label="메뉴 열기">
          <CiMenuBurger />
        </button>
      </div>
    </header>
  );
}
