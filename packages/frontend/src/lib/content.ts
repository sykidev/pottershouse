import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api';

/**
 * Read a CMS content section, shallow-merged over a fallback so public pages
 * always render even before the section has been seeded.
 */
export function useContent<T extends object>(section: string, fallback: T): T {
  const { data } = useQuery({
    queryKey: ['content', section],
    queryFn: () => apiRequest<{ data: Partial<T> }>(`/content/${section}`),
  });
  return { ...fallback, ...(data?.data ?? {}) };
}

/** Save a content section (PUT /api/content/:section). */
export function useSaveContent(section: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: unknown) =>
      apiRequest(`/content/${section}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content', section] });
    },
  });
}
