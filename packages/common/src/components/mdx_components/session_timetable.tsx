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

import { getRoomOrders, getRooms, getTimeTableData, TIME_COL_WIDTH, useHorizontalOverflow } from "./session_timetable_data";
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

const TD_HEIGHT = 4; // 10분 한 줄의 기본 높이(rem). rowHeight prop으로 재정의 가능하다.
const TD_MIN_WIDTH = 11; // 각 발표 열의 최소 너비(rem). 이보다 좁아지면 좌우 스크롤로 전환된다.

const SessionColumn: FC<{
  rowSpan: number;
  colSpan?: number;
  session: SessionSchema;
  linkable?: boolean;
  selectedDate: string;
}> = ({ rowSpan, colSpan, session, linkable, selectedDate }) => {
  const sessionUrl = linkable ? getSessionDetailUrl(session) : undefined;
  const clickable = isArray(session.speakers) && !isEmpty(session.speakers) && !!sessionUrl;
  // height 100% 로 rowSpan 셀의 실제 높이를 채우되(Chromium 기준), Firefox 는 rowSpan 셀에서 100% 를 지정 높이(--td-h) 기준으로 계산해 한 줄로 쪼그라들므로
  // minHeight 로 rowSpan×--td-h 하한을 준다. (세션 셀은 --td-h 이상 행만 span 하므로 안전한 하한)
  const sessionBoxMinHeight = `calc(var(--td-h, ${TD_HEIGHT}rem) * ${rowSpan})`;
  return (
    <SessionTableCell rowSpan={rowSpan} colSpan={colSpan}>
      {clickable ? (
        <Link
          to={sessionUrl!}
          style={{ textDecoration: "none", display: "block", height: "100%", minHeight: sessionBoxMinHeight }}
          state={{ selectedDate: selectedDate }}
        >
          <SessionBox className="clickable" sx={{ height: "100%", minHeight: sessionBoxMinHeight, gap: 0.75, padding: "0.5rem" }}>
            <SessionTitle children={session.title.replace("\\n", "\n")} align="center" />
            <Stack direction="row" alignItems="center" justifyContent="center" sx={{ width: "100%", flexWrap: "wrap", gap: 0.5 }}>
              {session.speakers.map((speaker) => (
                <Chip key={speaker.id} size="small" label={speaker.nickname} />
              ))}
            </Stack>
          </SessionBox>
        </Link>
      ) : (
        <SessionBox sx={{ height: "100%", minHeight: sessionBoxMinHeight, gap: 0.75, padding: "0.5rem" }}>
          <SessionTitle children={session.title.replace("\\n", "\n")} align="center" />
          <Stack direction="row" alignItems="center" justifyContent="center" sx={{ width: "100%", flexWrap: "wrap", gap: 0.5 }}>
            {session.speakers.map((speaker) => (
              <Chip key={speaker.id} size="small" label={speaker.nickname} />
            ))}
          </Stack>
        </SessionBox>
      )}
    </SessionTableCell>
  );
};

type SessionTimeTablePropType = {
  /** 세션을 조회할 이벤트 이름(name_ko 또는 name_en). 미지정 시 최신 활성 이벤트를 사용한다. */
  event?: string;
  /** 필터할 세션 유형. 단일 문자열 또는 배열(내부에서 콤마로 join). */
  types?: string | string[];
  /** 10분 한 줄의 높이(rem). 기본값 4. 값을 키우면 시간표가 세로로 늘어난다. */
  rowHeight?: number;
};

/**
 * 발표 세션을 날짜·시간·장소(room) 기준의 표로 보여주는 타임테이블.
 * 날짜 선택 탭, 장소별 열, 휴식 시간 표시를 포함한다.
 * @example <Common__Components__Session__TimeTable types="talk" />
 */
export const SessionTimeTable: FC<SessionTimeTablePropType> = ErrorBoundary.with(
  { fallback: ErrorFallback },
  Suspense.with({ fallback: <CenteredPage children={<CircularProgress />} /> }, ({ event, types, rowHeight = TD_HEIGHT }) => {
    const location = useLocation();
    const tdHeight = Number(rowHeight) || TD_HEIGHT; // MDX에서 문자열로 들어와도 안전하게 처리
    const { scrollRef, canScrollLeft, canScrollRight, scrollByViewport } = useHorizontalOverflow();

    const [confDate, setConfDate] = useState<string>(location.state?.selectedDate ?? "");

    const { language, appType } = Common.useCommonContext();
    const linkable = appType === "main";
    const backendAPIClient = BackendAPI.useBackendClient();
    const params = { ...(event && { event }), ...(types && { types: isString(types) ? types : types.join(",") }) };
    const { data: sessionList } = BackendAPI.useSessionsQuery(backendAPIClient, params);

    const timeTableData = getTimeTableData(sessionList);
    const dates = Object.keys(timeTableData).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
    const rooms: { [room: string]: number } = getRooms(sessionList).reduce((acc, room) => ({ ...acc, [room]: 0 }), {});
    const roomCount = Object.keys(rooms).length;
    const roomOrders = getRoomOrders(sessionList);
    const sortedRoomList = Object.keys(rooms).sort((a, b) => roomOrders[a] - roomOrders[b] || a.localeCompare(b));

    const [selectedDate, setSelectedDate] = useState<string>(location.state?.selectedDate ?? (confDate || dates[0]));
    const selectedTableData = timeTableData[selectedDate] ?? {};

    let breakCount = 0;

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
          <SessionTableScrollWrapper>
            <SessionTableScroll ref={scrollRef}>
              <SessionTable
                sx={{
                  "--td-h": `${tdHeight}rem`, // 10분당 높이(셀·세션 박스가 공유)
                  minWidth: `calc(${TIME_COL_WIDTH} + ${roomCount} * ${TD_MIN_WIDTH}rem)`, // 이보다 좁아지면 좌우 스크롤
                }}
              >
                {/* table-layout: fixed 의 열 너비 정의 (시간 열 고정, 나머지 균등 분배) */}
                <colgroup>
                  <col style={{ width: TIME_COL_WIDTH }} />
                  {sortedRoomList.map((room) => (
                    <col key={room} />
                  ))}
                </colgroup>
                <TableHead>
                  <SessionTableCell></SessionTableCell>
                  {sortedRoomList.map((room) => (
                    <SessionTableCell key={room} sx={{ padding: "1rem" }}>
                      <Typography
                        variant="subtitle1"
                        sx={{ whiteSpace: "pre-wrap", overflowWrap: "break-word", fontWeight: 600, textAlign: "center" }}
                        children={room.replace("\\n", "\n")}
                      />
                    </SessionTableCell>
                  ))}
                </TableHead>
                <SessionTableBody>
                  <SessionTableRow children={<SessionTableCell colSpan={roomCount + 1} />} /> {/* dummy first row */}
                  {Object.entries(selectedTableData).map(([time, roomData], i, a) => {
                    const hasSession = Object.values(rooms).some((c) => c >= 1) || Object.values(roomData).some((room) => room !== undefined);

                    if (!hasSession) {
                      if (breakCount > 1) {
                        breakCount--;
                        return <SessionTableRow />;
                      } else {
                        // 지금부터 다음 세션이 존재하기 전까지의 휴식 시간을 계산합니다.
                        breakCount = 1;
                        for (let bi = i + 1; bi < a.length; bi++) {
                          if (Object.values(a[bi][1]).some((room) => room !== undefined)) break;
                          breakCount += 1;
                        }

                        // I really hate this, but I can't think of a better way to do this.
                        const height = (tdHeight * breakCount) / (breakCount <= 2 ? 1 : 3);
                        const isLast = i === a.length - 1;
                        const duration = breakCount * 10; // 10 minutes per row
                        return (
                          <SessionTableRow>
                            <SessionTableCell rowSpan={breakCount} sx={{ height: `${height}rem !important`, border: "unset" }} align="center">
                              <TimeLabel>{time}</TimeLabel>
                            </SessionTableCell>
                            <SessionTableCell
                              colSpan={roomCount}
                              rowSpan={breakCount}
                              sx={{
                                height: `${height}rem !important`,
                                borderTop: (t) => `1px solid ${t.palette.divider} !important`,
                                borderBottom: isLast ? "transparent" : (t) => `1px solid ${t.palette.divider} !important`,
                              }}
                            >
                              <Stack direction="column" justifyContent="center" alignItems="center">
                                {!isLast && <BreakTime language={language} duration={duration} />}
                              </Stack>
                            </SessionTableCell>
                          </SessionTableRow>
                        );
                      }
                    }

                    // 동일 세션이 "모든 방"에서 동시에 시작하는 경우(키노트 등)에만 colSpan=roomCount 로 한 칸에 합칩니다.
                    // roomData 는 이 시각에 시작하는 방만 담으므로, 방 하나에서만 시작하는 세션이 전체 폭으로 퍼지지 않도록 방 개수까지 확인합니다.
                    const sessionIds = new Set(Object.values(roomData).map((room) => room?.session.id));
                    const firstSessionInfo = Object.values(roomData)[0];
                    if (sessionIds.size === 1 && firstSessionInfo !== undefined && Object.keys(roomData).length === roomCount) {
                      Object.keys(rooms).forEach((room) => (rooms[room] = firstSessionInfo.rowSpan - 1));
                      return (
                        <SessionTableRow>
                          <SessionTableCell align="center">
                            <TimeLabel>{time}</TimeLabel>
                          </SessionTableCell>
                          <SessionColumn
                            rowSpan={firstSessionInfo.rowSpan}
                            colSpan={roomCount}
                            session={firstSessionInfo.session}
                            linkable={linkable}
                            selectedDate={selectedDate}
                          />
                        </SessionTableRow>
                      );
                    }

                    return (
                      <SessionTableRow>
                        <SessionTableCell align="center" children={time} />
                        {sortedRoomList.map((room) => {
                          const roomDatum = roomData[room];
                          if (roomDatum === undefined) {
                            // 진행 중인 세션이 없는 경우, 해당 줄에서는 해당 room의 빈 column을 생성합니다.
                            if (rooms[room] <= 0) return <SessionTableCell />;
                            // 진행 중인 세션이 있는 경우, 이번 줄에서는 해당 세션들만큼 column을 생성하지 않습니다.
                            rooms[room] -= 1;
                            return null;
                          }
                          // 세션이 여러 줄에 걸쳐있는 경우, n-1 줄만큼 해당 room에 column을 생성하지 않도록 합니다.
                          if (roomDatum.rowSpan > 1) rooms[room] = roomDatum.rowSpan - 1;
                          return (
                            <SessionColumn
                              key={room}
                              rowSpan={roomDatum.rowSpan}
                              session={roomDatum.session}
                              linkable={linkable}
                              selectedDate={selectedDate}
                            />
                          );
                        })}
                      </SessionTableRow>
                    );
                  })}
                </SessionTableBody>
              </SessionTable>
            </SessionTableScroll>
            {/* 표가 화면보다 넓을 때만 좌우 스크롤 가능 방향을 페이드+화살표로 안내하고, 누르면 한 화면씩 스크롤한다. */}
            <ScrollHintEdge
              type="button"
              className="left"
              data-visible={canScrollLeft || undefined}
              disabled={!canScrollLeft}
              onClick={() => scrollByViewport("left")}
              aria-label={language === "ko" ? "이전 화면으로 스크롤" : "Scroll left"}
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
            >
              <KeyboardArrowRight fontSize="small" />
            </ScrollHintEdge>
          </SessionTableScrollWrapper>
        </SessionTableContainer>
      </Stack>
    );
  })
);

// 시간 라벨을 자기 높이의 절반만큼 올려 셀 상단(격자선)에 맞춘다
const TimeLabel = styled("span")({
  display: "inline-block",
  transform: "translateY(-50%)",
});

const SessionTable = styled(Table)(({ theme }) => ({
  width: "100%",
  maxWidth: "60rem",
  marginInline: "auto",
  tableLayout: "fixed", // 모든 발표 열을 동일 너비로 (colSpan은 열 수에 비례해 확장)
  alignItems: "center",
  justifyContent: "center",
  gap: "1rem",
  flex: 1,

  "*": {
    textAlign: "center",
  },

  "tbody > th": {
    border: "unset",
  },

  "tr:first-child td": {
    borderTop: "unset",
    height: `calc(var(--td-h, ${TD_HEIGHT}rem) / 2)`,
  },

  td: {
    height: `var(--td-h, ${TD_HEIGHT}rem)`,
  },

  // 좌측 시간 열: 가로 스크롤 시 고정. 배경은 변형 없이 셀 박스를 그대로 덮어 이웃 행과 빈틈없이 이어진다.
  "th:first-child, td:first-child": {
    position: "sticky",
    left: 0,
    zIndex: 2,
    verticalAlign: "top",
    backgroundColor: theme.palette.background.default,
  },

  "td:first-child": {
    borderTop: "unset",
  },

  "td:not(:first-child)": {
    borderTop: `1px solid rgba(255, 255, 255, 0.1)`,
  },
}));

const SessionTableBody = styled(TableBody)({
  gap: "1rem",
});

const SessionTableCell = styled(TableCell)({
  padding: "0 0.5rem",
  alignItems: "center",
  justifyContent: "center",
  border: "unset",
});
