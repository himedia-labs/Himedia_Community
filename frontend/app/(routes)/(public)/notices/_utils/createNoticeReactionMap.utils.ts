import type { NoticeReactionMap, NoticeUpdateRelease } from '@/app/shared/types/notices';

/**
 * 공지 반응 맵 생성
 * @description 릴리즈 배열을 로컬 반응 상태 맵으로 변환합니다.
 */
export function createNoticeReactionMap(releases: NoticeUpdateRelease[]) {
  return releases.reduce<NoticeReactionMap>((accumulator, release) => {
    accumulator[release.id] = release.reactions.map(reaction => ({ ...reaction }));
    return accumulator;
  }, {});
}
