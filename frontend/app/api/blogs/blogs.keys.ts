export const blogsKeys = {
  all: ['blogs'] as const,
  list: () => [...blogsKeys.all, 'list'] as const,
  sources: () => [...blogsKeys.all, 'sources'] as const,
};
