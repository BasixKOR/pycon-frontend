import { RoomSchema } from "@frontend/common/schemas/backendAdminAPI";
import { isoDateOf } from "@frontend/common/utils";
import { FC, ReactNode, useEffect, useMemo, useState } from "react";

import { useAppContext } from "@apps/pyconkr-admin/contexts/app_context";

import { RoomInput } from "../types";
import { useRoomMutations, useScheduleDraft, useTimetableData } from "./timetable_hooks";
import { TimetableContext, TimetableContextValue } from "./use_timetable";
import { computeDays } from "../utils/days";

export const TimetableProvider: FC<{ eventId: string; children: ReactNode }> = ({ eventId, children }) => {
  const { rooms, presentations, schedules, event } = useTimetableData(eventId);
  const { working, dirty, saving, applyLocal, discard, save, dropRoomSchedules } = useScheduleDraft(eventId, schedules);
  const { createRoom, updateRoom, removeRoom, commitRoomOrder } = useRoomMutations(eventId, rooms, schedules);
  const [draggingPresentationId, setDraggingPresentationId] = useState<string | null>(null);
  const [roomDialogRoom, setRoomDialogRoom] = useState<RoomSchema | null | undefined>(undefined);
  const { setUnsavedChanges } = useAppContext();

  useEffect(() => {
    setUnsavedChanges(dirty);
    return () => setUnsavedChanges(false);
  }, [dirty, setUnsavedChanges]);

  useEffect(() => {
    if (!draggingPresentationId) return;
    const clear = () => setDraggingPresentationId(null);
    window.addEventListener("drop", clear);
    window.addEventListener("dragend", clear);
    return () => {
      window.removeEventListener("drop", clear);
      window.removeEventListener("dragend", clear);
    };
  }, [draggingPresentationId]);

  const orderedRooms = useMemo(() => [...rooms].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)), [rooms]);

  // working(로컬 드래프트)에서 파생하되, 이벤트 소속 방으로 재확인해 타 이벤트 스케줄이 새지 않도록 한다.
  const eventSchedules = useMemo(() => {
    const roomIds = new Set(rooms.map((r) => r.id));
    return working.filter((s) => roomIds.has(s.room));
  }, [working, rooms]);

  const days = useMemo(() => computeDays(event, eventSchedules), [event, eventSchedules]);
  const [selectedDate, setSelectedDate] = useState<string>(days[0]);
  useEffect(() => {
    if (!days.includes(selectedDate)) setSelectedDate(days[0]);
  }, [days, selectedDate]);

  const presentationsById = useMemo(() => new Map(presentations.map((p) => [p.id, p])), [presentations]);
  const placedPresentationIds = useMemo(() => new Set(eventSchedules.map((s) => s.presentation)), [eventSchedules]);
  const daySchedules = useMemo(() => eventSchedules.filter((s) => isoDateOf(s.start_at) === selectedDate), [eventSchedules, selectedDate]);

  const submitRoom = (values: RoomInput) => {
    if (roomDialogRoom) updateRoom(roomDialogRoom, values);
    else createRoom(values);
    setRoomDialogRoom(undefined);
  };
  const deleteRoom = () => {
    if (roomDialogRoom) {
      removeRoom(roomDialogRoom);
      dropRoomSchedules(roomDialogRoom.id);
    }
    setRoomDialogRoom(undefined);
  };
  const dialogRoomScheduleCount = roomDialogRoom ? eventSchedules.filter((s) => s.room === roomDialogRoom.id).length : 0;

  const value: TimetableContextValue = {
    eventId,
    orderedRooms,
    presentationsById,
    days,
    selectedDate,
    setSelectedDate,
    daySchedules,
    placedPresentationIds,
    dirty,
    saving,
    applyLocal,
    discard,
    save,
    commitRoomOrder,
    draggingPresentationId,
    setDraggingPresentationId,
    roomDialogRoom,
    setRoomDialogRoom,
    submitRoom,
    deleteRoom,
    dialogRoomScheduleCount,
  };

  return <TimetableContext.Provider value={value}>{children}</TimetableContext.Provider>;
};
