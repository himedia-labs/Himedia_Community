/**
 * 프로필 라우트 파라미터 정규화
 * @description @핸들 경로를 디코딩하고 접두사 여부/핸들을 반환합니다.
 */
export const resolveProfileRoute = (profileId: string | string[] | undefined) => {
  const rawProfileId = Array.isArray(profileId) ? profileId[0] : (profileId ?? '');
  const decodedProfileId = decodeURIComponent(rawProfileId);
  const hasAtPrefix = decodedProfileId.startsWith('@');
  const normalizedProfileId = decodedProfileId.replace(/^@/, '');

  return {
    hasAtPrefix,
    decodedProfileId,
    normalizedProfileId,
  };
};
