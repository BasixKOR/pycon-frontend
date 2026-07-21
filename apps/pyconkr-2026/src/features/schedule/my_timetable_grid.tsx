import NorthEastRoundedIcon from "@mui/icons-material/NorthEastRounded";
import { Box, Button, Stack, Typography } from "@mui/material";
import { DateTime } from "luxon";
import { FC, Fragment, useMemo } from "react";
import { Link as RouterLink, useSearchParams } from "react-router-dom";

import { useAppContext } from "@apps/pyconkr-2026/contexts/app_context";

const DAYS = ["2026-08-15", "2026-08-16"] as const;

export const TRACKS = [
  { key: "track1", label: "Track 1", location: "4층", rooms: "4142호, 4147호", roomOrder: 0, color: "#22b8cf" },
  { key: "track2", label: "Track 2", location: "6층", rooms: "6141호, 6144호", roomOrder: 10, color: "#82c91e" },
  { key: "track3", label: "Track 3", location: "원흥관", rooms: "E347, E350", roomOrder: 20, color: "#5c7cfa" },
  { key: "dongguk", label: "동국대 세션", location: "5143호", rooms: "", roomOrder: 30, color: "#20c997" },
] as const;

const AFTERNOON_START_HOUR = 13;
const AFTERNOON_START_MINUTE = 30;
const SLOT_MINUTES = 10;
const SLOT_MS = SLOT_MINUTES * 60_000;
const ROW_HEIGHT = 34;

type FixedProgram = {
  start: string;
  end: string;
  label?: string;
  speaker?: string;
  title?: string;
  height: number;
  tone: "plain" | "keynote" | "break" | "lunch";
};

const FIXED_MORNING: Record<(typeof DAYS)[number], FixedProgram[]> = {
  "2026-08-15": [
    { start: "09:00", end: "09:20", label: "시작", height: 44, tone: "plain" },
    { start: "09:20", end: "09:50", label: "오프닝", height: 48, tone: "plain" },
    { start: "09:50", end: "10:20", speaker: "Deb Nicholson", title: "Python의 미래를 함께 만들어갑시다!", height: 68, tone: "keynote" },
    { start: "10:20", end: "10:50", label: "쉬는 시간", height: 40, tone: "break" },
    { start: "10:50", end: "11:20", speaker: "변성윤", title: "나는 그냥 행복하고 싶었다", height: 68, tone: "keynote" },
    { start: "11:20", end: "13:30", label: "점심시간", height: 42, tone: "lunch" },
  ],
  "2026-08-16": [
    { start: "09:00", end: "09:20", label: "시작", height: 44, tone: "plain" },
    { start: "09:40", end: "09:50", label: "오프닝", height: 34, tone: "plain" },
    {
      start: "09:50",
      end: "10:20",
      speaker: "Cheuk",
      title: "Python makes us hap.py — 내가 속할 수 있는 커뮤니티를 찾는 기쁨",
      height: 68,
      tone: "keynote",
    },
    { start: "10:20", end: "10:50", label: "쉬는 시간", height: 40, tone: "break" },
    { start: "10:50", end: "11:20", speaker: "Hugo", title: "Python 릴리스 매니저가 되는 법", height: 68, tone: "keynote" },
    { start: "11:20", end: "13:30", label: "점심시간", height: 42, tone: "lunch" },
  ],
};

const FIXED_AFTERNOON = {
  "2026-08-15": [{ start: "17:20", end: "18:00", label: "라이트닝 토크 ⚡", tone: "lightning" }],
  "2026-08-16": [
    { start: "17:20", end: "18:00", label: "라이트닝 토크 ⚡", tone: "lightning" },
    { start: "18:00", end: "18:30", label: "클로징", tone: "closing" },
  ],
} as const;

export type TimetablePlacement = {
  key: string;
  trackKey: string;
  startMs: number;
  endMs: number;
  title: string;
  speakers?: string;
  href: string;
  trackSpan?: number;
};

const SessionCard: FC<{ placement: TimetablePlacement; color: string }> = ({ placement, color }) => {
  const compact = placement.endMs - placement.startMs <= 20 * 60_000;
  return (
    <Box
      component={RouterLink}
      to={placement.href}
      sx={{
        display: "flex",
        height: "100%",
        minWidth: 0,
        flexDirection: "column",
        overflow: "hidden",
        border: `1px solid ${color}`,
        borderRadius: "0.4rem",
        background: `color-mix(in srgb, ${color} 24%, #1e1230)`,
        color: "text.primary",
        p: compact ? { xs: 0.3, sm: 0.45 } : { xs: 0.55, sm: 0.8 },
        transition: "filter 0.15s ease",
        "&:hover": { filter: "brightness(1.18)" },
      }}
    >
      <Typography
        sx={{
          color: "text.secondary",
          fontSize: compact ? { xs: "0.48rem", sm: "0.56rem" } : { xs: "0.55rem", sm: "0.66rem" },
          lineHeight: 1,
          whiteSpace: "nowrap",
        }}
      >
        {DateTime.fromMillis(placement.startMs).toFormat("HH:mm")}–{DateTime.fromMillis(placement.endMs).toFormat("HH:mm")}
      </Typography>
      <Typography
        title={placement.title}
        sx={{
          display: compact ? "block" : "-webkit-box",
          overflow: "hidden",
          WebkitBoxOrient: compact ? undefined : "vertical",
          WebkitLineClamp: compact ? undefined : 2,
          fontSize: compact ? { xs: "0.56rem", sm: "0.64rem" } : { xs: "0.64rem", sm: "0.78rem" },
          fontWeight: 700,
          lineHeight: compact ? 1 : 1.25,
          textOverflow: "ellipsis",
          whiteSpace: compact ? "nowrap" : undefined,
          my: compact ? 0.45 : 0.5,
        }}
        children={placement.title}
      />
      {placement.speakers && (
        <Typography
          title={placement.speakers}
          sx={{
            mt: "auto",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            fontSize: compact ? { xs: "0.5rem", sm: "0.58rem" } : { xs: "0.56rem", sm: "0.66rem" },
            lineHeight: 1,
          }}
          children={placement.speakers}
        />
      )}
    </Box>
  );
};

export const MyTimetableGrid: FC<{ placements: TimetablePlacement[] }> = ({ placements }) => {
  const { language } = useAppContext();
  const isKo = language === "ko";
  const [searchParams, setSearchParams] = useSearchParams();

  const placementsByDay = useMemo(() => {
    const grouped = new Map<string, TimetablePlacement[]>();
    placements.forEach((placement) => {
      const day = DateTime.fromMillis(placement.startMs).toISODate() ?? "";
      grouped.set(day, [...(grouped.get(day) ?? []), placement]);
    });
    return grouped;
  }, [placements]);

  const requestedDay = searchParams.get("day");
  const firstSavedDay = DAYS.find((day) => placementsByDay.has(day));
  const activeDay = DAYS.includes(requestedDay as (typeof DAYS)[number]) ? (requestedDay as (typeof DAYS)[number]) : (firstSavedDay ?? DAYS[0]);
  const dayPlacements = placementsByDay.get(activeDay) ?? [];
  const morningPrograms = FIXED_MORNING[activeDay];
  const afternoonPrograms = FIXED_AFTERNOON[activeDay];
  const dayStartMs = DateTime.fromISO(activeDay)
    .set({ hour: AFTERNOON_START_HOUR, minute: AFTERNOON_START_MINUTE, second: 0, millisecond: 0 })
    .toMillis();
  const dayEndMs = DateTime.fromISO(`${activeDay}T${afternoonPrograms.at(-1)?.end}:00`).toMillis();
  const timeSlots = Array.from({ length: (dayEndMs - dayStartMs) / SLOT_MS }, (_, index) => dayStartMs + index * SLOT_MS);

  const selectDay = (day: string) =>
    setSearchParams(
      (previous) => {
        const next = new URLSearchParams(previous);
        next.set("day", day);
        return next;
      },
      { replace: true }
    );

  return (
    <Stack spacing={1.5} sx={{ width: "100%", minWidth: 0 }}>
      <Button
        component={RouterLink}
        to="/session"
        variant="text"
        color="inherit"
        endIcon={<NorthEastRoundedIcon />}
        sx={{ alignSelf: "flex-end", fontWeight: 700, whiteSpace: "nowrap" }}
        children={isKo ? "발표 추가" : "Add session"}
      />

      <Box sx={{ width: "100%", minWidth: 0, overflow: "hidden", border: "1px solid", borderColor: "divider", borderRadius: "0.75rem" }}>
        <Stack direction="row" spacing={0} sx={{ borderBottom: "1px solid", borderColor: "divider" }}>
          {DAYS.map((day, index) => (
            <Button
              key={day}
              variant="text"
              onClick={() => selectDay(day)}
              sx={{
                flex: 1,
                minWidth: 0,
                height: { xs: 52, sm: 58 },
                p: 0,
                borderRadius: 0,
                borderRight: index === 0 ? "1px solid" : 0,
                borderColor: "divider",
                backgroundColor: day === activeDay ? "primary.main" : "transparent",
                color: day === activeDay ? "primary.contrastText" : "primary.main",
                fontSize: { xs: "0.82rem", sm: "1rem" },
                fontWeight: 800,
                lineHeight: 1,
                whiteSpace: "nowrap",
                "&:hover": { backgroundColor: day === activeDay ? "primary.main" : "action.hover" },
              }}
              children={`Day ${index + 1} · ${DateTime.fromISO(day).toFormat("M.d")}`}
            />
          ))}
        </Stack>
        <Box
          sx={{
            display: "grid",
            width: "100%",
            gridTemplateColumns: "clamp(48px, 9vw, 76px) repeat(4, minmax(0, 1fr))",
            gridTemplateRows: `minmax(86px, auto) ${morningPrograms.map(({ height }) => `${height}px`).join(" ")} repeat(${timeSlots.length}, ${ROW_HEIGHT}px)`,
          }}
        >
          <Box sx={{ borderRight: "1px solid", borderColor: "divider" }} />
          {TRACKS.map((track) => (
            <Stack
              key={track.key}
              alignItems="center"
              justifyContent="center"
              sx={{ minWidth: 0, px: { xs: 0.25, sm: 1 }, py: 1, borderRight: "1px solid", borderColor: "divider", textAlign: "center" }}
            >
              <Typography sx={{ fontSize: { xs: "0.65rem", sm: "0.85rem" }, fontWeight: 800, lineHeight: 1.2 }} children={track.label} />
              <Typography sx={{ mt: 0.35, color: "text.secondary", fontSize: { xs: "0.55rem", sm: "0.68rem" }, lineHeight: 1.25 }}>
                {track.location}
                {track.rooms && (
                  <>
                    <br />
                    {track.rooms}
                  </>
                )}
              </Typography>
            </Stack>
          ))}

          {morningPrograms.map((program, index) => (
            <Fragment key={`${program.start}-${program.end}`}>
              <Stack
                justifyContent="center"
                sx={{
                  gridColumn: 1,
                  gridRow: index + 2,
                  minWidth: 0,
                  px: { xs: 0.35, sm: 1 },
                  borderTop: "1px solid",
                  borderRight: "1px solid",
                  borderColor: "divider",
                  backgroundColor: "background.default",
                }}
              >
                <Typography sx={{ fontSize: { xs: "0.58rem", sm: "0.74rem" }, fontWeight: 800, lineHeight: 1.15 }} children={program.start} />
                <Typography
                  sx={{ mt: 0.35, color: "text.secondary", fontSize: { xs: "0.52rem", sm: "0.64rem" }, lineHeight: 1.15 }}
                  children={program.end}
                />
              </Stack>
              <Stack
                alignItems="center"
                justifyContent="center"
                sx={{
                  gridColumn: "2 / -1",
                  gridRow: index + 2,
                  minWidth: 0,
                  px: 1,
                  borderTop: "1px solid",
                  borderRight: "1px solid",
                  borderColor: program.tone === "keynote" ? "rgba(245, 199, 61, 0.35)" : "divider",
                  backgroundColor:
                    program.tone === "keynote"
                      ? "rgba(245, 199, 61, 0.1)"
                      : program.tone === "lunch"
                        ? "rgba(255, 255, 255, 0.025)"
                        : "rgba(255, 255, 255, 0.012)",
                  color: program.tone === "lunch" || program.tone === "break" ? "text.secondary" : "text.primary",
                  textAlign: "center",
                }}
              >
                {program.label ? (
                  <Typography sx={{ fontSize: { xs: "0.64rem", sm: "0.78rem" }, fontWeight: program.tone === "plain" ? 700 : 500 }}>
                    {program.label}
                  </Typography>
                ) : (
                  <>
                    <Typography
                      sx={{ color: "text.secondary", fontSize: { xs: "0.54rem", sm: "0.64rem" }, lineHeight: 1.15 }}
                      children={program.speaker}
                    />
                    <Typography
                      title={program.title}
                      sx={{
                        maxWidth: "100%",
                        mt: 0.35,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        fontSize: { xs: "0.62rem", sm: "0.78rem" },
                        fontWeight: 700,
                      }}
                      children={program.title}
                    />
                  </>
                )}
              </Stack>
            </Fragment>
          ))}

          {timeSlots.map((time, index) => (
            <Stack
              key={time}
              justifyContent="center"
              sx={{
                gridColumn: 1,
                gridRow: index + morningPrograms.length + 2,
                minWidth: 0,
                px: { xs: 0.35, sm: 1 },
                borderTop: "1px solid",
                borderRight: "1px solid",
                borderColor: "divider",
              }}
            >
              <Typography sx={{ color: "text.secondary", fontSize: { xs: "0.55rem", sm: "0.68rem" }, fontWeight: 700, lineHeight: 1 }}>
                {DateTime.fromMillis(time).toFormat("H:mm")}
              </Typography>
            </Stack>
          ))}

          {TRACKS.map((track, trackIndex) => (
            <Box
              key={`${track.key}-timeline`}
              sx={{
                gridColumn: trackIndex + 2,
                gridRow: `${morningPrograms.length + 2} / ${morningPrograms.length + timeSlots.length + 2}`,
                minWidth: 0,
                borderTop: "1px solid",
                borderRight: "1px solid",
                borderColor: "divider",
                backgroundColor: "rgba(255, 255, 255, 0.018)",
                backgroundImage: `repeating-linear-gradient(to bottom, transparent 0, transparent ${ROW_HEIGHT - 1}px, rgba(255, 255, 255, 0.08) ${ROW_HEIGHT - 1}px, rgba(255, 255, 255, 0.08) ${ROW_HEIGHT}px)`,
              }}
            />
          ))}

          {afternoonPrograms.map((program) => {
            const startSlot = Math.round((DateTime.fromISO(`${activeDay}T${program.start}:00`).toMillis() - dayStartMs) / SLOT_MS);
            const endSlot = Math.round((DateTime.fromISO(`${activeDay}T${program.end}:00`).toMillis() - dayStartMs) / SLOT_MS);
            return (
              <Stack
                key={`${program.start}-${program.end}`}
                alignItems="center"
                justifyContent="center"
                sx={{
                  gridColumn: "2 / -1",
                  gridRow: `${startSlot + morningPrograms.length + 2} / ${endSlot + morningPrograms.length + 2}`,
                  minWidth: 0,
                  borderTop: "1px solid",
                  borderRight: "1px solid",
                  borderColor: program.tone === "lightning" ? "rgba(245, 199, 61, 0.4)" : "divider",
                  backgroundColor: program.tone === "lightning" ? "#3A321F" : "#282237",
                  textAlign: "center",
                  zIndex: 1,
                }}
              >
                <Typography sx={{ color: "rgba(255, 255, 255, 0.72)", fontSize: { xs: "0.52rem", sm: "0.62rem" } }}>
                  {program.start}–{program.end}
                </Typography>
                <Typography sx={{ mt: 0.25, fontSize: { xs: "0.66rem", sm: "0.8rem" }, fontWeight: 700 }} children={program.label} />
              </Stack>
            );
          })}

          {dayPlacements.map((placement) => {
            const trackIndex = TRACKS.findIndex(({ key }) => key === placement.trackKey);
            if (trackIndex < 0 || placement.endMs <= dayStartMs || placement.startMs >= dayEndMs) return null;
            const startSlot = Math.max(0, Math.round((placement.startMs - dayStartMs) / SLOT_MS));
            const endSlot = Math.min(timeSlots.length, Math.round((placement.endMs - dayStartMs) / SLOT_MS));
            return (
              <Box
                key={placement.key}
                sx={{
                  gridColumn: `${trackIndex + 2} / span ${placement.trackSpan ?? 1}`,
                  gridRow: `${startSlot + morningPrograms.length + 2} / ${Math.max(startSlot + 1, endSlot) + morningPrograms.length + 2}`,
                  minWidth: 0,
                  p: { xs: "3px", sm: "5px" },
                  zIndex: 1,
                }}
              >
                <SessionCard placement={placement} color={TRACKS[trackIndex].color} />
              </Box>
            );
          })}
        </Box>
      </Box>

      {dayPlacements.length === 0 && (
        <Typography color="text.secondary" sx={{ textAlign: "center", fontSize: "0.82rem" }}>
          {isKo ? "이 날 담은 발표가 없어요." : "No sessions saved for this day."}
        </Typography>
      )}
    </Stack>
  );
};
