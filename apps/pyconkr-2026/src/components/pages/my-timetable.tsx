import { useBackendClient, useSessionsQuery } from "@frontend/common/hooks/useAPI";
import { getSessionDetailUrl } from "@frontend/common/utils";
import { useShopClient, useUserStatus } from "@frontend/shop/hooks";
import { Button, CircularProgress, Stack, Typography } from "@mui/material";
import { FC, useEffect, useMemo } from "react";
import { Link as RouterLink } from "react-router-dom";

import { PageLayout } from "@apps/pyconkr-2026/components/layout/PageLayout";
import { EVENT_NAME } from "@apps/pyconkr-2026/consts";
import { useAppContext } from "@apps/pyconkr-2026/contexts/app_context";
import { MyTimetableGrid, TimetablePlacement, TRACKS } from "@apps/pyconkr-2026/features/schedule/my_timetable_grid";
import { useMyScheduleQuery } from "@apps/pyconkr-2026/features/schedule/use_my_schedule";

export const MyTimetablePage: FC = () => {
  const { language, setAppContext } = useAppContext();
  const isKo = language === "ko";
  const backendClient = useBackendClient();
  const { data: user } = useUserStatus(useShopClient());
  const isAuthenticated = user?.meta.is_authenticated === true;
  const { data: sessions } = useSessionsQuery(backendClient, { event: EVENT_NAME, types: "세션" });
  const eventId = sessions[0]?.presentation_type.event.id;
  const { data: bookmarks, isLoading } = useMyScheduleQuery(backendClient, eventId, isAuthenticated);
  const placements = useMemo(() => {
    const selectedIds = new Set(bookmarks?.presentation_ids ?? []);
    return sessions.flatMap((session) =>
      selectedIds.has(session.id)
        ? (session.room_schedules.length === TRACKS.length ? session.room_schedules.slice(0, 1) : session.room_schedules).flatMap(
            (schedule): TimetablePlacement[] => {
              const track = TRACKS.find(({ roomOrder }) => roomOrder === schedule.room_order);
              const startMs = Date.parse(schedule.start_at);
              const endMs = Date.parse(schedule.end_at);
              if (!track || !Number.isFinite(startMs) || !Number.isFinite(endMs) || startMs >= endMs) return [];
              return [
                {
                  key: `${session.id}:${schedule.id}`,
                  trackKey: track.key,
                  startMs,
                  endMs,
                  title: session.title,
                  speakers: session.speakers.map(({ nickname }) => nickname).join(", ") || undefined,
                  href: getSessionDetailUrl(session),
                  trackSpan: session.room_schedules.length === TRACKS.length ? TRACKS.length : undefined,
                },
              ];
            }
          )
        : []
    );
  }, [bookmarks, sessions]);

  useEffect(() => {
    setAppContext((prev) => ({
      ...prev,
      title: isKo ? "내 시간표" : "My Schedule",
      shouldShowTitleBanner: true,
      shouldShowSponsorBanner: false,
    }));
  }, [isKo, setAppContext]);

  if (!isAuthenticated) {
    return (
      <PageLayout>
        <Stack alignItems="center" spacing={2} sx={{ py: 6, textAlign: "center" }}>
          <Typography variant="h5" fontWeight={800} children={isKo ? "로그인이 필요해요" : "Sign in required"} />
          <Typography
            color="text.secondary"
            children={isKo ? "나의 세션 시간표를 보려면 로그인해 주세요." : "Sign in to view your session schedule."}
          />
          <Button component={RouterLink} to="/account/sign-in" variant="contained" children={isKo ? "로그인하기" : "Sign in"} />
        </Stack>
      </PageLayout>
    );
  }

  return <PageLayout>{isLoading ? <CircularProgress /> : <MyTimetableGrid placements={placements} />}</PageLayout>;
};
