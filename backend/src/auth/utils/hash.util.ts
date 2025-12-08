import { createHmac, randomBytes } from 'crypto';

/**
 * HMAC-SHA256 해싱
 * @description Refresh Token Secret처럼 고엔트로피 랜덤값에 사용
 * @param value 해싱할 값
 * @param salt Salt 값
 * @returns SHA256 해시 (64자 hex)
 */
export const hashWithSHA256 = (value: string, salt: string): string => {
  return createHmac('sha256', salt).update(value).digest('hex');
};

/**
 * SHA256 해시 생성 (salt 포함)
 * @description Salt를 함께 생성하여 반환
 * @param value 해싱할 값
 * @returns 해시와 salt
 */
export const createHashWithSalt = (value: string): { hash: string; salt: string } => {
  const salt = randomBytes(16).toString('hex'); // 32자 hex
  const hash = hashWithSHA256(value, salt);
  return { hash, salt };
};

/**
 * SHA256 해시 검증
 * @description 값과 salt로 해시를 재계산하여 비교
 * @param value 검증할 값
 * @param hash 저장된 해시
 * @param salt 저장된 salt
 * @returns 일치 여부
 */
export const verifySHA256Hash = (value: string, hash: string, salt: string): boolean => {
  const computedHash = hashWithSHA256(value, salt);
  return computedHash === hash;
};
