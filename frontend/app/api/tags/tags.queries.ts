import { useQuery } from '@tanstack/react-query';

import { tagsApi } from './tags.api';
import { tagsKeys } from './tags.keys';
import type { TagSuggestionResponse } from '@/app/shared/types/post';

export const useTagSuggestionsQuery = (query: string, limit?: number) => {
  return useQuery<TagSuggestionResponse, Error>({
    queryKey: tagsKeys.suggest(query, limit),
    queryFn: () => tagsApi.getTagSuggestions(query, limit),
    enabled: query.length > 0,
  });
};
