import type { AuthTokens } from './token.interface';
import type { AuthUserProfile } from './user.interface';

export interface AuthResponse extends AuthTokens {
  user: AuthUserProfile;
}
