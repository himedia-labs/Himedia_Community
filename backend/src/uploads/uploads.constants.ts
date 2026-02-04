// 설정 업로드
export const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
export const IMAGE_LIMITS = { fileSize: MAX_IMAGE_SIZE };
export const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);

// 설정 확장자
export const MIME_EXTENSION_MAP: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
};

// 메시지 업로드
export const IMAGE_REQUIRED_MESSAGE = '이미지 파일을 선택해주세요.';
export const IMAGE_ONLY_MESSAGE = '이미지 파일만 업로드할 수 있습니다.';
