import { DateTime } from "luxon";
import { useCallback, useEffect, useRef, useState } from "react";

import { SessionSchema } from "@frontend/common/schemas/backendAPI";

// 세로형 SessionTimeTable / 가로형 SessionTimeTableTransposed 가 공유하는 데이터 헬퍼·훅.

export const TIME_COL_WIDTH = "4.5rem"; // 좌측 시간 열(고정) 너비

export type TimeTableData = {
  [date: string]: {
    [time: string]: {
      [room: string]:
        | {
            rowSpan: number;
            session: SessionSchema;
          }
        | undefined;
    };
  };
};

/**
 * 가로 스크롤 컨테이너의 오버플로 여부와 현재 위치를 추적한다.
 * 표가 화면 폭보다 넓을 때 좌/우로 더 스크롤할 수 있는지를 알려준다.
 */
export const useHorizontalOverflow = () => {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [{ left, right }, setEdges] = useState({ left: false, right: false });

  const update = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const canScrollLeft = el.scrollLeft > 1;
    const canScrollRight = Math.ceil(el.scrollLeft + el.clientWidth) < el.scrollWidth - 1;
    setEdges((prev) => (prev.left === canScrollLeft && prev.right === canScrollRight ? prev : { left: canScrollLeft, right: canScrollRight }));
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    update();
    el.addEventListener("scroll", update, { passive: true });
    // 뷰포트 폭(컨테이너)과 표 폭(자식) 변화 모두 감지해야 오버플로 상태가 최신으로 유지된다.
    const observer = new ResizeObserver(update);
    observer.observe(el);
    if (el.firstElementChild) observer.observe(el.firstElementChild);
    return () => {
      el.removeEventListener("scroll", update);
      observer.disconnect();
    };
  }, [update]);

  return { scrollRef, canScrollLeft: left, canScrollRight: right };
};

const getPaddedTime = (time: DateTime) => `${time.hour}:${time.minute.toString().padStart(2, "0")}`;

export const getRooms = (data: SessionSchema[]) => {
  return Array.from(new Set<string>(data.reduce((acc, s) => [...acc, ...s.room_schedules.map((r) => r.room_name)], [] as string[])));
};

export const getRoomOrders = (data: SessionSchema[]): { [room: string]: number } => {
  return data.reduce(
    (acc, s) => {
      s.room_schedules.forEach((r) => (acc[r.room_name] = r.room_order));
      return acc;
    },
    {} as { [room: string]: number }
  );
};

const getConfStartEndTimePerDay: (data: SessionSchema[]) => {
  [date: string]: { start: DateTime; end: DateTime };
} = (data) => {
  const startTimes = data.reduce((acc, s) => [...acc, ...s.room_schedules.map((r) => DateTime.fromISO(r.start_at))], [] as DateTime[]);
  const endTimes = data.reduce((acc, s) => [...acc, ...s.room_schedules.map((r) => DateTime.fromISO(r.end_at))], [] as DateTime[]);
  const allTimes = [...startTimes, ...endTimes];

  const timesPerDay = allTimes.reduce(
    (acc, time) => {
      const dateStr = time.toISODate();
      if (!dateStr) throw new Error("Invalid date string");

      if (!acc[dateStr]) acc[dateStr] = [];
      acc[dateStr].push(time);
      return acc;
    },
    {} as { [date: string]: DateTime[] }
  );
  return Object.entries(timesPerDay).reduce(
    (acc, [date, times]) => {
      const start = times.reduce((min, t) => (t < min ? t : min), times[0]);
      const end = times.reduce((max, t) => (t > max ? t : max), times[0]);
      acc[date] = { start, end };
      return acc;
    },
    {} as { [date: string]: { start: DateTime; end: DateTime } }
  );
};

const getEveryTenMinutesArr = (start: DateTime, end: DateTime) => {
  let time = start;
  const arr = [];

  while (time <= end) {
    arr.push(time);
    time = time.plus({ minutes: 10 });
  }
  return arr;
};

export const getTimeTableData: (data: SessionSchema[]) => TimeTableData = (data) => {
  // Initialize timeTableData structure
  const timeTableData: TimeTableData = Object.entries(getConfStartEndTimePerDay(data)).reduce(
    (acc, [date, { start, end }]) => ({
      ...acc,
      [date]: getEveryTenMinutesArr(start, end).reduce((acc, time) => ({ ...acc, [getPaddedTime(time)]: {} }), {}),
    }),
    {}
  );

  // Fill timeTableData with session data
  data.forEach((session) => {
    session.room_schedules.forEach((schedule) => {
      const start = DateTime.fromISO(schedule.start_at);
      const end = DateTime.fromISO(schedule.end_at);

      if (!start.isValid || !end.isValid) {
        console.warn(`Invalid start or end time for session ${session.id} in room ${schedule.room_name}`);
        return;
      }

      const durationMin = (end.toMillis() - start.toMillis()) / 1000 / 60;
      timeTableData[start.toISODate()][getPaddedTime(start)][schedule.room_name] = { rowSpan: durationMin / 10, session };
    });
  });

  return timeTableData;
};
