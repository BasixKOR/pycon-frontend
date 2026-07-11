import { formatBackendErrorMessage } from "@frontend/common/apis/client";
import {
  adminListAllQueryKey,
  useBackendAdminClient,
  useCreateMutation,
  useListAllQuery,
  useRemovePreparedMutation,
  useRetrieveQuery,
  useUpdatePreparedMutation,
} from "@frontend/common/hooks/useAdminAPI";
import { EventSchema, PresentationSchema, RoomSchema, RoomScheduleSchema } from "@frontend/common/schemas/backendAdminAPI";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import { addSnackbar } from "@apps/pyconkr-admin/utils/snackbar";

import { APP } from "../const";
import { RoomInput, ScheduleOp } from "../types";
import { applyOps, isTempId, schedulesEqual } from "../utils/schedule";

// 전역 MutationCache 의 자동 무효화/reset(→서스펜스 재진입→보드 전체 스피너)을 끈다.
// 이 화면은 제자리 편집이라, 성공 후 필요한 목록만 배경 invalidate(reset 없음)로 갱신한다.
const NO_AUTO_INVALIDATE = { meta: { invalidates: [] } };

export const useTimetableData = (eventId: string) => {
  const client = useBackendAdminClient();
  const { data: rooms } = useListAllQuery<RoomSchema>(client, APP, "room", { event: eventId });
  const { data: presentations } = useListAllQuery<PresentationSchema>(client, APP, "presentation", { event: eventId });
  const { data: schedules } = useListAllQuery<RoomScheduleSchema>(client, APP, "roomschedule", { event: eventId });
  const { data: event } = useRetrieveQuery<EventSchema>(client, APP, "event", eventId);
  return { rooms, presentations, schedules, event };
};

export const useScheduleDraft = (eventId: string, serverSchedules: RoomScheduleSchema[]) => {
  const client = useBackendAdminClient();
  const queryClient = useQueryClient();
  const schedulesKey = adminListAllQueryKey(APP, "roomschedule", { event: eventId });
  const createSchedule = useCreateMutation<RoomScheduleSchema>(client, APP, "roomschedule", NO_AUTO_INVALIDATE);
  const removeSchedule = useRemovePreparedMutation(client, APP, "roomschedule", NO_AUTO_INVALIDATE);

  const [working, setWorking] = useState<RoomScheduleSchema[]>(serverSchedules);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);

  // 로컬 편집이 없을 때는 서버 데이터(재조회 포함)를 그대로 반영 — 저장 후 temp id→서버 id 재동기화도 이걸로 처리.
  useEffect(() => {
    if (!dirty) setWorking(serverSchedules);
  }, [serverSchedules, dirty]);

  const applyLocal = (ops: ScheduleOp[]) => {
    if (saving || ops.length === 0) return;
    setWorking((w) => applyOps(w, ops));
    setDirty(true);
  };
  const discard = () => {
    setWorking(serverSchedules);
    setDirty(false);
  };
  // 방 삭제 시 그 방의 (미저장 포함) 스케줄을 working 에서 제거.
  const dropRoomSchedules = (roomId: string) => setWorking((w) => w.filter((s) => s.room !== roomId));

  const save = async () => {
    if (saving) return;
    setSaving(true);
    const serverById = new Map(serverSchedules.map((s) => [s.id, s]));
    const workingIds = new Set(working.map((s) => s.id));
    const removed = serverSchedules.filter((s) => !workingIds.has(s.id));
    const created = working.filter((s) => isTempId(s.id));
    const changed = working.filter((s) => !isTempId(s.id) && serverById.has(s.id) && !schedulesEqual(serverById.get(s.id)!, s));

    const toDeleteIds = [...removed, ...changed].map((s) => s.id);
    const toCreate = [...created, ...changed];
    try {
      await Promise.all(toDeleteIds.map((id) => removeSchedule.mutateAsync(id)));
      await Promise.all(toCreate.map((s) => createSchedule.mutateAsync(s)));
      // 배경 재조회로 서버 상태 반영(working 은 위 sync 이펙트가 !dirty 시 재시드).
      await queryClient.invalidateQueries({ queryKey: schedulesKey });
      setDirty(false);
      addSnackbar("시간표를 저장했습니다.", "success");
    } catch (error) {
      // delete 후 create 실패 시 서버가 부분 상태일 수 있어, 재조회로 실제 서버 상태를 되찾는다.
      queryClient.invalidateQueries({ queryKey: schedulesKey });
      addSnackbar(formatBackendErrorMessage(error, "시간표 저장 중 문제가 발생했습니다. 페이지를 새로고침해 상태를 확인해주세요."), "error");
    } finally {
      setSaving(false);
    }
  };

  return { working, dirty, saving, applyLocal, discard, save, dropRoomSchedules };
};

const runAndInvalidate = async (run: () => Promise<unknown>, invalidate: () => void, errorMessage: string) => {
  try {
    await run();
  } catch (error) {
    addSnackbar(formatBackendErrorMessage(error, errorMessage), "error");
  } finally {
    invalidate();
  }
};

export const useRoomMutations = (eventId: string, rooms: RoomSchema[], schedules: RoomScheduleSchema[]) => {
  const client = useBackendAdminClient();
  const queryClient = useQueryClient();
  const roomsKey = adminListAllQueryKey(APP, "room", { event: eventId });
  const schedulesKey = adminListAllQueryKey(APP, "roomschedule", { event: eventId });
  const invalidateRooms = () => queryClient.invalidateQueries({ queryKey: roomsKey });

  const createRoomMutation = useCreateMutation<RoomSchema>(client, APP, "room", NO_AUTO_INVALIDATE);
  const updateRoomMutation = useUpdatePreparedMutation<RoomSchema>(client, APP, "room", NO_AUTO_INVALIDATE);
  const removeRoomMutation = useRemovePreparedMutation(client, APP, "room", NO_AUTO_INVALIDATE);
  const removeScheduleMutation = useRemovePreparedMutation(client, APP, "roomschedule", NO_AUTO_INVALIDATE);

  const createRoom = ({ name_ko, name_en }: RoomInput) => {
    const order = rooms.length > 0 ? Math.max(...rooms.map((r) => r.order ?? 0)) + 10 : 0;
    return runAndInvalidate(
      () => createRoomMutation.mutateAsync({ event: eventId, name_ko, name_en, order } as Omit<RoomSchema, "id">),
      invalidateRooms,
      "장소 추가 중 문제가 발생했습니다."
    );
  };

  const updateRoom = (room: RoomSchema, { name_ko, name_en }: RoomInput) =>
    runAndInvalidate(() => updateRoomMutation.mutateAsync({ ...room, name_ko, name_en }), invalidateRooms, "장소 수정 중 문제가 발생했습니다.");

  const removeRoom = (room: RoomSchema) => {
    const scheduleIds = schedules.filter((s) => s.room === room.id && !isTempId(s.id)).map((s) => s.id);
    return runAndInvalidate(
      async () => {
        // 방을 참조(PROTECT)하므로 스케줄부터 삭제.
        await Promise.all(scheduleIds.map((id) => removeScheduleMutation.mutateAsync(id)));
        await removeRoomMutation.mutateAsync(room.id);
      },
      () => {
        queryClient.invalidateQueries({ queryKey: roomsKey });
        queryClient.invalidateQueries({ queryKey: schedulesKey });
      },
      "장소 삭제 중 문제가 발생했습니다."
    );
  };

  const commitRoomOrder = async (orderedRoomIds: string[]) => {
    const byId = new Map(rooms.map((r) => [r.id, r]));
    const reordered = orderedRoomIds.flatMap((id, index) => {
      const room = byId.get(id);
      return room ? [{ ...room, order: index * 10 }] : [];
    });
    const changed = reordered.filter((r) => byId.get(r.id)?.order !== r.order);
    if (changed.length === 0) return;
    await runAndInvalidate(
      () => Promise.all(changed.map((room) => updateRoomMutation.mutateAsync(room))),
      invalidateRooms,
      "장소 순서 저장 중 문제가 발생했습니다."
    );
  };

  return { createRoom, updateRoom, removeRoom, commitRoomOrder };
};
