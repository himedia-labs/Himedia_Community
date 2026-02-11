export const EMAIL_VERIFICATION_PURPOSES = ['register', 'account-change', 'withdraw-restore'] as const;

export type EmailVerificationPurpose = (typeof EMAIL_VERIFICATION_PURPOSES)[number];
