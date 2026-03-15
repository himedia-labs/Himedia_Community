export const noticesKeys = {
  all: ['notices'] as const,
  list: () => [...noticesKeys.all, 'list'] as const,
  detail: (noticeId: string) => [...noticesKeys.all, 'detail', noticeId] as const,
};
