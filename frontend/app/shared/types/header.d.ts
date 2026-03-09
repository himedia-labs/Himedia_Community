import { IconType } from 'react-icons';

// 헤더 메뉴
export type NavItem = {
  label: string;
  href?: string;
  Icon?: IconType;
  isAuthDependent?: boolean;
};

// 헤더 프롭스
export interface HeaderProps {
  initialIsLoggedIn: boolean;
}
