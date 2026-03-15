export const noticesKeys = {
  all: ['notices'] as const,
  list: () => [...noticesKeys.all, 'list'] as const,
};
