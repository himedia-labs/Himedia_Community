import type { UserRole } from '../entities/user.entity';

export interface AuthUserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone: string;
  course: string | null;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse extends AuthTokens {
  user: AuthUserProfile;
}

// bcrypt 타입 정의
export type HashFunction = (
  data: string | Buffer,
  saltOrRounds: string | number,
) => Promise<string>;

export type CompareFunction = (
  data: string | Buffer,
  encrypted: string,
) => Promise<boolean>;
