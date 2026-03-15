import type { NoticesListResponse } from '@/app/shared/types/notices';

/**
 * 공지 페이지 데이터 조회
 * @description 백엔드 공지 목록을 조회하고 실패 시 빈 배열로 대체합니다.
 */
export async function fetchNoticesPageData(): Promise<NoticesListResponse> {
  const baseUrl = process.env.NEXT_PUBLIC_HM_API_BASE_URL;

  if (!baseUrl) {
    return {
      announcements: [],
      updates: [],
    };
  }

  try {
    const res = await fetch(`${baseUrl}/notices`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch notices: ${res.status}`);
    }

    const data = (await res.json()) as NoticesListResponse;

    return {
      announcements: data.announcements ?? [],
      updates: data.updates ?? [],
    };
  } catch {
    return {
      announcements: [],
      updates: [],
    };
  }
}
