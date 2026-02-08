import type { EmailVerification } from '@/auth/entities/emailVerification.entity';

export interface EmailVerificationValidation {
  verification: EmailVerification;
}
