import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";
import { Button, Chip, CircularProgress, Stack, styled, Table, TableBody, TableCell, TableHead, Typography } from "@mui/material";
import { ErrorBoundary, Suspense } from "@suspensive/react";
import { DateTime } from "luxon";
import { FC, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { isArray, isEmpty, isString } from "remeda";

import { CenteredPage } from "@frontend/common/components/centered_page";
import { ErrorFallback } from "@frontend/common/components/error_handler";
import { BackendAPI, Common } from "@frontend/common/hooks";
import { SessionSchema } from "@frontend/common/schemas/backendAPI";
import { getSessionDetailUrl } from "@frontend/common/utils";

import { getRoomOrders, getRooms, getTimeTableData, TimeTableData, useHorizontalOverflow } from "./session_timetable_data";
import {
  BreakTime,
  HorizontalScrollNotice,
  ScrollHintEdge,
  SessionBox,
  SessionDateItemContainer,
  SessionDateSubTitle,
  SessionDateTitle,
  SessionTableContainer,
  SessionTableRow,
  SessionTableScroll,
  SessionTableScrollWrapper,
  SessionTitle,
} from "./session_timetable_shared";
import { StyledDivider } from "./styled_divider";

/* ------------------------------------------------------------------ *
 * 축 반전(가로형) 타임테이블
 * SessionTimeTable 과 동일한 데이터를 쓰되 시간·장소 축을 뒤바꾼다.
 * 세로축(행) = 장소(room), 가로축(열) = 시간.
 * ------------------------------------------------------------------ */

const ROOM_COL_WIDTH = "8rem"; // 좌측 장소(room) 라벨 열(고정) 너비
const SLOT_WIDTH = 3.5; // 10분 한 칸의 기본 너비(rem). slotWidth prop 으로 재정의 가능.
const BREAK_COL_WIDTH = 3; // 접힌 휴식 열의 최소 너비(rem)

// 접힌 휴식 열의 너비(rem). 휴식이 길수록 넓혀 "휴식 (90분)" 같은 라벨이 여러 줄로 깨지지 않게 하되,
// 원래 길이(slotWidth * slotCount)의 1/3 로 압축하고 최소 너비를 보장한다. (세로형의 휴식 높이 압축과 동일한 발상)
const breakColWidth = (slotCount: number, slotWidth: number) => Math.max(BREAK_COL_WIDTH, (slotWidth * slotCount) / 3);
const ROW_HEIGHT = 6; // 장소 한 줄의 기본 높이(rem). rowHeight prop 으로 재정의 가능.
const HEADER_HEIGHT = "2rem"; // 시간(열) 헤더 행의 높이. 좌우 스크롤 화살표를 이 행 중앙에 맞춘다.
// 좌우 스크롤 화살표를 시간 헤더 행 중앙에 오도록 상단 여백을 계산한다(fontSize="small" 아이콘 = 1.25rem).
const SCROLL_HINT_TOP = `calc((${HEADER_HEIGHT} - 1.25rem) / 2)`;

type SessionCell = { rowSpan: number; session: SessionSchema };

type TransposedColumn = { kind: "time"; time: string } | { kind: "break"; time: string; slotCount: number };

type TransposedPlacement = {
  rowStart: number; // 장소(행) 시작 인덱스
  rowSpan: number;
  colStart: number; // 열 시작 인덱스
  colSpan: number;
  session?: SessionSchema; // 세션 셀
  breakDuration?: number; // 휴식 셀(분)
};

/**
 * 특정 날짜의 timeTableData 를 "장소=행 / 시간=열" 격자 모델로 변환한다.
 * - 세션이 없는 앞뒤 구간은 잘라내고, 중간의 빈 구간은 휴식 열 하나로 접는다.
 * - 한 시각에 세션이 한 종류뿐이면(키노트 등) 모든 장소 행을 가로지르는 셀로 만든다.
 *   (세로형 SessionTimeTable 의 colSpan={roomCount} 동작과 동일한 규칙)
 */
const buildTransposedModel = (selectedTableData: TimeTableData[string], sortedRoomList: string[]) => {
  const roomCount = sortedRoomList.length;
  const roomIndex: { [room: string]: number } = Object.fromEntries(sortedRoomList.map((room, i) => [room, i]));
  const allTimes = Object.keys(selectedTableData);

  // 각 10분 슬롯이 (시작이든 진행중이든) 세션에 점유되는지 표시한다.
  const active = new Array<boolean>(allTimes.length).fill(false);
  allTimes.forEach((time, i) => {
    Object.values(selectedTableData[time]).forEach((datum) => {
      if (!datum) return;
      for (let k = i; k < Math.min(allTimes.length, i + datum.rowSpan); k++) active[k] = true;
    });
  });

  const firstActive = active.indexOf(true);
  const lastActive = active.lastIndexOf(true);
  if (firstActive === -1) return { columns: [] as TransposedColumn[], placements: [] as TransposedPlacement[], roomCount };

  // 앞뒤 빈 구간을 잘라낸 실제 표시 범위
  const times = allTimes.slice(firstActive, lastActive + 1);
  const isActive = active.slice(firstActive, lastActive + 1);

  // 열 모델: 활성 슬롯은 시간 열 1개씩, 연속된 빈 구간은 휴식 열 1개로 접는다.
  const columns: TransposedColumn[] = [];
  const slotToCol = new Array<number>(times.length).fill(-1);
  for (let i = 0; i < times.length; ) {
    if (isActive[i]) {
      slotToCol[i] = columns.length;
      columns.push({ kind: "time", time: times[i] });
      i++;
    } else {
      let j = i;
      while (j < times.length && !isActive[j]) j++;
      columns.push({ kind: "break", time: times[i], slotCount: j - i });
      i = j;
    }
  }

  const placements: TransposedPlacement[] = [];

  // 세션 셀: 각 시각에 시작하는 세션을 colSpan=지속시간(10분 단위) 만큼 배치한다.
  // 이미 진행 중인(앞 시각에 시작한) 세션은 시작 시각에서 이미 배치되었으므로 여기서 건너뛴다.
  times.forEach((time, i) => {
    const starting = Object.entries(selectedTableData[time]).filter((entry): entry is [string, SessionCell] => entry[1] !== undefined);
    if (starting.length === 0) return;

    const colStart = slotToCol[i];
    // 정상 데이터에선 colSpan===rowSpan 이지만, 세션이 표시 범위를 넘겨 선언된 경우 열 개수로 제한한다.
    const colSpan = (datum: SessionCell) => Math.min(datum.rowSpan, columns.length - colStart);
    const sessionIds = new Set(starting.map(([, datum]) => datum.session.id));
    if (sessionIds.size === 1) {
      // 한 종류뿐이면 모든 장소 행을 가로지른다(키노트/전체 대상 세션).
      const [, datum] = starting[0];
      placements.push({ rowStart: 0, rowSpan: roomCount, colStart, colSpan: colSpan(datum), session: datum.session });
    } else {
      starting.forEach(([room, datum]) => {
        placements.push({ rowStart: roomIndex[room], rowSpan: 1, colStart, colSpan: colSpan(datum), session: datum.session });
      });
    }
  });

  // 휴식 셀: 휴식 열은 모든 장소 행을 가로지르는 한 칸으로.
  columns.forEach((col, ci) => {
    if (col.kind === "break") {
      placements.push({ rowStart: 0, rowSpan: roomCount, colStart: ci, colSpan: 1, breakDuration: col.slotCount * 10 });
    }
  });

  return { columns, placements, roomCount };
};

const SessionCellTransposed: FC<{
  rowSpan: number;
  colSpan: number;
  session: SessionSchema;
  linkable?: boolean;
  selectedDate: string;
}> = ({ rowSpan, colSpan, session, linkable, selectedDate }) => {
  const sessionUrl = linkable ? getSessionDetailUrl(session) : undefined;
  const clickable = isArray(session.speakers) && !isEmpty(session.speakers) && !!sessionUrl;
  // Firefox 는 rowSpan 셀 높이 계산에 rowSpan 을 반영하지 않으므로 직접 계산한다.
  const boxHeight = `calc(var(--row-h, ${ROW_HEIGHT}rem) * ${rowSpan})`;
  const content = (
    <SessionBox className={clickable ? "clickable" : undefined} sx={{ height: boxHeight, gap: 0.5, padding: "0.4rem" }}>
      <SessionTitle children={session.title.replace("\\n", "\n")} align="center" sx={{ fontSize: "0.95em" }} />
      <Stack direction="row" alignItems="center" justifyContent="center" sx={{ width: "100%", flexWrap: "wrap", gap: 0.5 }}>
        {session.speakers.map((speaker) => (
          <Chip key={speaker.id} size="small" label={speaker.nickname} />
        ))}
      </Stack>
    </SessionBox>
  );
  return (
    <TransposedBodyCell rowSpan={rowSpan} colSpan={colSpan} sx={{ padding: "0.15rem" }}>
      {clickable ? (
        <Link to={sessionUrl!} style={{ textDecoration: "none", display: "block" }} state={{ selectedDate }} children={content} />
      ) : (
        content
      )}
    </TransposedBodyCell>
  );
};

type SessionTimeTableTransposedPropType = {
  /** 세션을 조회할 이벤트 이름(name_ko 또는 name_en). 미지정 시 최신 활성 이벤트를 사용한다. */
  event?: string;
  /** 필터할 세션 유형. 단일 문자열 또는 배열(내부에서 콤마로 join). */
  types?: string | string[];
  /** 장소 한 줄의 높이(rem). 기본값 6. 값을 키우면 각 행이 세로로 늘어난다. */
  rowHeight?: number;
  /** 10분 한 칸의 너비(rem). 기본값 3.5. 값을 키우면 시간축이 가로로 늘어난다. */
  slotWidth?: number;
};

/**
 * 발표 세션을 장소(행)·시간(열) 기준으로 보여주는 가로형 타임테이블.
 * SessionTimeTable 의 축을 반전한 형태로, 시간이 가로로 흐른다.
 * @example <Common__Components__Session__TimeTableTransposed types="talk" />
 */
export const SessionTimeTableTransposed: FC<SessionTimeTableTransposedPropType> = ErrorBoundary.with(
  { fallback: ErrorFallback },
  Suspense.with(
    { fallback: <CenteredPage children={<CircularProgress />} /> },
    ({ event, types, rowHeight = ROW_HEIGHT, slotWidth = SLOT_WIDTH }) => {
      const location = useLocation();
      const rowH = Number(rowHeight) || ROW_HEIGHT; // MDX 에서 문자열로 들어와도 안전하게 처리
      const slotW = Number(slotWidth) || SLOT_WIDTH;
      const { scrollRef, canScrollLeft, canScrollRight, scrollByViewport } = useHorizontalOverflow();

      const [confDate, setConfDate] = useState<string>(location.state?.selectedDate ?? "");

      const { language, appType } = Common.useCommonContext();
      const linkable = appType === "main";
      const backendAPIClient = BackendAPI.useBackendClient();
      const params = { ...(event && { event }), ...(types && { types: isString(types) ? types : types.join(",") }) };
      const { data: sessionList } = BackendAPI.useSessionsQuery(backendAPIClient, params);

      const timeTableData = getTimeTableData(sessionList);
      const dates = Object.keys(timeTableData).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
      const roomOrders = getRoomOrders(sessionList);
      const sortedRoomList = getRooms(sessionList).sort((a, b) => roomOrders[a] - roomOrders[b] || a.localeCompare(b));

      const [selectedDate, setSelectedDate] = useState<string>(location.state?.selectedDate ?? (confDate || dates[0]));
      const selectedTableData = timeTableData[selectedDate];

      const { columns, placements, roomCount } = buildTransposedModel(selectedTableData, sortedRoomList);

      // rowSpan/colSpan 으로 덮이는 셀은 렌더 시 건너뛰기 위한 점유표와, 각 셀의 시작 배치 조회표.
      const occupied = Array.from({ length: roomCount }, () => new Array<boolean>(columns.length).fill(false));
      const originAt = Array.from({ length: roomCount }, () => new Array<TransposedPlacement | undefined>(columns.length).fill(undefined));
      placements.forEach((p) => {
        originAt[p.rowStart][p.colStart] = p;
        for (let r = p.rowStart; r < p.rowStart + p.rowSpan; r++) {
          for (let c = p.colStart; c < p.colStart + p.colSpan; c++) {
            if (!(r === p.rowStart && c === p.colStart)) occupied[r][c] = true;
          }
        }
      });

      const totalWidth = columns.reduce((acc, col) => acc + (col.kind === "break" ? breakColWidth(col.slotCount, slotW) : slotW), 0);

      const warningMessage =
        language === "ko"
          ? "* 발표 목록은 발표자 사정에 따라 변동될 수 있습니다."
          : "* The list of sessions may change due to the speaker's circumstances.";

      return (
        <Stack direction="column" sx={{ width: "100%" }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ width: "100%", my: 0.5, gap: 1 }}>
            <HorizontalScrollNotice visible={canScrollLeft || canScrollRight} language={language} />
            <Typography variant="body2" sx={{ textAlign: "right", fontSize: "0.6rem" }} children={warningMessage} />
          </Stack>
          <StyledDivider />
          {dates.length > 1 && (
            <>
              <Stack spacing={2} direction="row" justifyContent="center" alignItems="center">
                {dates.map((date, i) => {
                  const dateStr = DateTime.fromISO(date).setLocale(language).toLocaleString({ weekday: "long", month: "long", day: "numeric" });
                  return (
                    <Button
                      variant="text"
                      key={date}
                      onClick={() => {
                        setConfDate(date);
                        setSelectedDate(date);
                      }}
                      className={selectedDate === date ? "selected" : ""}
                    >
                      <SessionDateItemContainer direction="column">
                        <SessionDateTitle children={"Day " + (i + 1)} isSelected={selectedDate === date} />
                        <SessionDateSubTitle children={dateStr} isSelected={selectedDate === date} />
                      </SessionDateItemContainer>
                    </Button>
                  );
                })}
              </Stack>
              <StyledDivider />
            </>
          )}
          <SessionTableContainer>
            {columns.length === 0 ? (
              <Typography variant="subtitle2" sx={{ py: 4 }} children={language === "ko" ? "표시할 세션이 없습니다." : "No sessions to display."} />
            ) : (
              <SessionTableScrollWrapper>
                <SessionTableScroll ref={scrollRef}>
                  <TransposedTable sx={{ "--row-h": `${rowH}rem`, minWidth: `calc(${ROOM_COL_WIDTH} + ${totalWidth}rem)` }}>
                    <colgroup>
                      <col style={{ width: ROOM_COL_WIDTH }} />
                      {columns.map((col, ci) => (
                        <col key={ci} style={{ width: `${col.kind === "break" ? breakColWidth(col.slotCount, slotW) : slotW}rem` }} />
                      ))}
                    </colgroup>
                    <TableHead>
                      <SessionTableRow>
                        <TransposedHeadCell sticky />
                        {columns.map((col, ci) => {
                          if (col.kind === "break") return <TransposedHeadCell key={ci} />;
                          const [h, m] = col.time.split(":");
                          return (
                            <TransposedHeadCell key={ci}>
                              <Typography sx={{ fontSize: "0.6rem", fontWeight: m === "00" ? 700 : 400, whiteSpace: "nowrap" }}>
                                {h.padStart(2, "0")}:{m}
                              </Typography>
                            </TransposedHeadCell>
                          );
                        })}
                      </SessionTableRow>
                    </TableHead>
                    <TableBody>
                      {sortedRoomList.map((room, r) => (
                        <SessionTableRow key={room}>
                          <TransposedBodyCell sticky>
                            <Typography
                              variant="subtitle2"
                              sx={{ fontWeight: 600, whiteSpace: "pre-wrap", overflowWrap: "break-word", textAlign: "center" }}
                              children={room.replace("\\n", "\n")}
                            />
                          </TransposedBodyCell>
                          {columns.map((_, c) => {
                            if (occupied[r][c]) return null;
                            const placement = originAt[r][c];
                            if (placement?.session) {
                              return (
                                <SessionCellTransposed
                                  key={c}
                                  rowSpan={placement.rowSpan}
                                  colSpan={placement.colSpan}
                                  session={placement.session}
                                  linkable={linkable}
                                  selectedDate={selectedDate}
                                />
                              );
                            }
                            if (placement?.breakDuration) {
                              return (
                                <TransposedBodyCell key={c} rowSpan={placement.rowSpan}>
                                  <BreakTime language={language} duration={placement.breakDuration} />
                                </TransposedBodyCell>
                              );
                            }
                            return <TransposedBodyCell key={c} />;
                          })}
                        </SessionTableRow>
                      ))}
                    </TableBody>
                  </TransposedTable>
                </SessionTableScroll>
                {/* 표가 화면보다 넓을 때만 좌우 스크롤 가능 방향을 페이드+화살표로 안내하고, 누르면 한 화면씩 스크롤한다. */}
                <ScrollHintEdge
                  type="button"
                  className="left"
                  data-visible={canScrollLeft || undefined}
                  disabled={!canScrollLeft}
                  onClick={() => scrollByViewport("left")}
                  aria-label={language === "ko" ? "이전 화면으로 스크롤" : "Scroll left"}
                  sx={{ "--hint-left": ROOM_COL_WIDTH, paddingTop: SCROLL_HINT_TOP }}
                >
                  <KeyboardArrowLeft fontSize="small" />
                </ScrollHintEdge>
                <ScrollHintEdge
                  type="button"
                  className="right"
                  data-visible={canScrollRight || undefined}
                  disabled={!canScrollRight}
                  onClick={() => scrollByViewport("right")}
                  aria-label={language === "ko" ? "다음 화면으로 스크롤" : "Scroll right"}
                  sx={{ paddingTop: SCROLL_HINT_TOP }}
                >
                  <KeyboardArrowRight fontSize="small" />
                </ScrollHintEdge>
              </SessionTableScrollWrapper>
            )}
          </SessionTableContainer>
        </Stack>
      );
    }
  )
);

const TransposedTable = styled(Table)({
  tableLayout: "fixed", // colgroup 너비를 고정하고 colSpan 이 열 너비를 합산하도록
  marginInline: "auto",
  "*": {
    textAlign: "center",
  },
});

const TransposedBodyCell = styled(TableCell, { shouldForwardProp: (prop) => prop !== "sticky" })<{ sticky?: boolean }>(({ theme, sticky }) => ({
  height: `var(--row-h, ${ROW_HEIGHT}rem)`,
  padding: "0.25rem",
  verticalAlign: "middle",
  borderRight: `1px solid ${theme.palette.divider}`,
  borderBottom: `1px solid ${theme.palette.divider}`,
  // 좌측 장소 열: 가로 스크롤 시 고정. 배경으로 이웃 셀을 덮어 빈틈 없이 이어진다.
  ...(sticky && {
    position: "sticky",
    left: 0,
    zIndex: 2,
    backgroundColor: theme.palette.background.default,
  }),
}));

const TransposedHeadCell = styled(TableCell, { shouldForwardProp: (prop) => prop !== "sticky" })<{ sticky?: boolean }>(({ theme, sticky }) => ({
  height: HEADER_HEIGHT,
  padding: "0 0.25rem",
  verticalAlign: "middle", // 시간 라벨을 행 중앙에 두어 좌우 스크롤 화살표와 y 위치를 맞춘다.
  borderBottom: `1px solid ${theme.palette.divider}`,
  ...(sticky && {
    position: "sticky",
    left: 0,
    zIndex: 3, // sticky 장소 열(zIndex 2) 위에
    backgroundColor: theme.palette.background.default,
  }),
}));
