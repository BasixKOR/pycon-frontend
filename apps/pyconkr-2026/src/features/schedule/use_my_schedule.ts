import { BackendAPIClient } from "@frontend/common/apis/client";
import { useShopClient, useUserStatus } from "@frontend/shop/hooks";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { scheduleStorageKey } from "@apps/pyconkr-2026/consts/local_stroage";

export type PresentationBookmarkList = {
  presentation_ids: string[];
};

const readScheduleIds = (username: string | null): string[] => {
  try {
    const raw = localStorage.getItem(scheduleStorageKey(username));
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((value): value is string => typeof value === "string") : [];
  } catch {
    return [];
  }
};

const writeScheduleIds = (username: string | null, ids: string[]): void => {
  localStorage.setItem(scheduleStorageKey(username), JSON.stringify([...new Set(ids)]));
};

export const myScheduleQueryKey = (eventId?: string) => ["query", "presentation-bookmarks", eventId] as const;

const useUsername = (): string | null => {
  const { data } = useUserStatus(useShopClient());
  return data?.meta.is_authenticated ? data.data.user.username : null;
};

/**
 * localStorage를 API 캐시로 활용합니다:
 * - localStorage에 데이터가 있으면 → staleTime: Infinity (API 호출 없음)
 * - localStorage가 비어있으면 → staleTime: 0 (API 1회 호출 후 localStorage에 저장)
 * - POST/DELETE 성공 시에도 localStorage를 동기화하므로 다음 방문 때 API 호출이 불필요합니다.
 */
export const useMyScheduleQuery = (client: BackendAPIClient, eventId?: string, enabled = true) => {
  const username = useUsername();
  const cached = readScheduleIds(username);

  return useQuery({
    queryKey: myScheduleQueryKey(eventId),
    queryFn: async (): Promise<PresentationBookmarkList> => {
      const result = await client.get<PresentationBookmarkList>(`v1/events/${eventId}/presentation-bookmarks/`);
      writeScheduleIds(username, result.presentation_ids);
      return result;
    },
    enabled: Boolean(eventId) && enabled,
    initialData: cached.length > 0 ? { presentation_ids: cached } : undefined,
    staleTime: cached.length > 0 ? Infinity : 0,
    throwOnError: true,
  });
};

type ToggleScheduleVariables = {
  presentationId: string;
  action: "add" | "remove";
};

export const useToggleMyScheduleMutation = (client: BackendAPIClient, eventId: string) => {
  const username = useUsername();
  const queryClient = useQueryClient();
  const queryKey = myScheduleQueryKey(eventId);

  return useMutation({
    mutationKey: ["mutation", "presentation-bookmarks", eventId],
    meta: { invalidates: [] },
    onMutate: ({ presentationId, action }: ToggleScheduleVariables) => {
      const previous = queryClient.getQueryData<PresentationBookmarkList>(queryKey) ?? { presentation_ids: readScheduleIds(username) };
      const next: PresentationBookmarkList = {
        presentation_ids:
          action === "add"
            ? [...new Set([...previous.presentation_ids, presentationId])]
            : previous.presentation_ids.filter((id) => id !== presentationId),
      };
      queryClient.setQueryData<PresentationBookmarkList>(queryKey, next);
      return { previous };
    },
    mutationFn: async ({ presentationId, action }: ToggleScheduleVariables) => {
      if (action === "add") {
        await client.post<{ presentation_id: string }, { presentation_id: string }>(`v1/events/${eventId}/presentation-bookmarks/`, {
          presentation_id: presentationId,
        });
      } else {
        await client.delete<void>(`v1/events/${eventId}/presentation-bookmarks/${presentationId}/`);
      }
      const current = queryClient.getQueryData<PresentationBookmarkList>(queryKey) ?? { presentation_ids: [] };
      writeScheduleIds(username, current.presentation_ids);
    },
    onError: (_error, _variables, context) => {
      if (!context) return;
      queryClient.setQueryData<PresentationBookmarkList>(queryKey, context.previous);
      writeScheduleIds(username, context.previous.presentation_ids);
    },
  });
};
