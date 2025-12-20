/**
 * 전화번호 정규화/포맷 유틸
 */
export const normalizePhoneNumber = (value: string): string => value.replace(/[^0-9]/g, '');

export const formatPhoneNumber = (value: string): string => {
  const digits = normalizePhoneNumber(value);
  if (digits.length === 11) {
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
  }
  if (digits.length === 10) {
    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  return digits;
};
