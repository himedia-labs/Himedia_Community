import type { User } from '../entities/user.entity';
import type { PasswordReset } from '../entities/passwordReset.entity';

export interface PasswordResetValidation {
  user: User;
  resetRecord: PasswordReset;
}
