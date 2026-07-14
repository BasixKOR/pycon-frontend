import { BackendAPIClient } from "@frontend/common/apis/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export type PresentationBookmarkList = {
  presentation_ids: string[];
};

export const myScheduleQueryKey = (eventId?: string) => ["query", "presentation-bookmarks", eventId] as const;

export const useMyScheduleQuery = (client: BackendAPIClient, eventId?: string, enabled = true) =>
  useQuery({
    queryKey: myScheduleQueryKey(eventId),
    queryFn: () => client.get<PresentationBookmarkList>(`v1/events/${eventId}/presentation-bookmarks/`),
    enabled: Boolean(eventId) && enabled,
    refetchOnMount: "always",
    throwOnError: true,
  });

type ToggleScheduleVariables = {
  presentationId: string;
  action: "add" | "remove";
};

export const useToggleMyScheduleMutation = (client: BackendAPIClient, eventId: string) => {
  const queryClient = useQueryClient();
  const queryKey = myScheduleQueryKey(eventId);

  return useMutation({
    mutationKey: ["mutation", "presentation-bookmarks", eventId],
    meta: { invalidates: [] },
    mutationFn: async ({ presentationId, action }: ToggleScheduleVariables) => {
      if (action === "add") {
        await client.post<{ presentation_id: string }, { presentation: string }>(`v1/events/${eventId}/presentation-bookmarks/`, {
          presentation: presentationId,
        });
        return;
      }
      await client.delete<void>(`v1/events/${eventId}/presentation-bookmarks/${presentationId}/`);
    },
    onMutate: ({ presentationId, action }) => {
      queryClient.setQueryData<PresentationBookmarkList>(queryKey, (current = { presentation_ids: [] }) => ({
        presentation_ids:
          action === "add"
            ? [...new Set([...current.presentation_ids, presentationId])]
            : current.presentation_ids.filter((id) => id !== presentationId),
      }));
    },
    onError: (_error, { presentationId, action }) => {
      queryClient.setQueryData<PresentationBookmarkList>(queryKey, (current = { presentation_ids: [] }) => ({
        presentation_ids:
          action === "add"
            ? current.presentation_ids.filter((id) => id !== presentationId)
            : [...new Set([...current.presentation_ids, presentationId])],
      }));
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey }),
  });
};
