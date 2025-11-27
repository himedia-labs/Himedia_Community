import * as bcrypt from 'bcryptjs';

/**
 * 비밀번호 해시 함수 타입
 */
type HashFunction = (s: string, salt: number) => Promise<string>;

/**
 * 비밀번호 비교 함수 타입
 */
type CompareFunction = (s: string, hash: string) => Promise<boolean>;

// bcryptjs 함수 타입 캐스팅
const { hash, compare } = bcrypt as {
  hash: HashFunction;
  compare: CompareFunction;
};

/**
 * 비밀번호 해싱
 * @description 평문 비밀번호를 bcrypt로 해시화
 */
export const hashPassword = hash;

/**
 * 비밀번호 검증
 * @description 평문 비밀번호와 해시를 비교
 */
export const comparePassword = compare;
