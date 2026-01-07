export const tagsKeys = {
  all: ['tags'] as const,
  suggest: (query: string, limit?: number) => [...tagsKeys.all, 'suggest', query, limit ?? 'all'] as const,
};
