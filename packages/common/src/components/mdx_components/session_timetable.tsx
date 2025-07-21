import { Box, ButtonBase, Chip, Stack, styled, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import { ErrorBoundary, Suspense } from "@suspensive/react";
import * as React from "react";
import { useNavigate } from "react-router-dom";
import * as R from "remeda";
import BackendAPISchemas from "../../schemas/backendAPI";
import { ErrorFallback } from "../error_handler";
import { StyledDivider } from "./styled_divider";

const TD_HEIGHT = 2.5;
const TD_WIDTH = 12.5;
const TD_WIDTH_MOBILE = 20;

const sessionRawData: BackendAPISchemas.SessionSchema[] = [
  {
    id: "efbaf783-25f7-47ec-a8bc-dc1af549d650",
    title: '"네? 파이썬을요? 제가요?" 부제: 우당탕탕 개발자로 성장하기(진행중)',
    description: "",
    image: null,
    isSession: true,
    categories: [
      {
        id: "7f110b3f-0de2-402a-aba1-7bb79918a275",
        name: "직업 / 커리어",
      },
    ],
    speakers: [
      {
        id: "fc2fe85f-8c04-4f8a-885a-82309909f78e",
        nickname: "Noa Hyerim Nam",
        biography: "",
        image:
          "https://s3.ap-northeast-2.amazonaws.com/pyconkr-backend-prod-public/public/%E1%84%82%E1%85%A1%E1%86%B7%E1%84%92%E1%85%A8%E1%84%85%E1%85%B5%E1%86%B7.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=ASIAXRG76FVYLL4SVCKE%2F20250707%2Fap-northeast-2%2Fs3%2Faws4_request&X-Amz-Date=20250707T143106Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEG4aDmFwLW5vcnRoZWFzdC0yIkcwRQIhANnZvGK4hksLniwovDS95OAD%2B17Njkd6Tpi4yFJcolcXAiBi6bnvY41dfqIx%2FOoFvbXGPSWirDIkstjS4JeY6ZSdbiqBAwh3EAQaDDUxODAxMzIwMTc3NiIMUt6TTATzUxD9OyiSKt4CI0Ph0pads9O%2Fa4tKD6vbv2%2FG%2FVTSyqkqQDxtZ56u%2But0NPTDnHpiqmOXmfEWc0nOLs2X44jnhADKMMWocNoeNNahFZcM9A0cZnPhcam%2Fof3hZE%2BvyoLewBVDnMa5JrlHQRoAgeonCie7kyjysKxdOoyTvM9bQwhS124YxuYxoAJ0j%2B5B6WSafvNUBuORy7EP7IoFoEg3vwg%2F7UhecxbPbcEyHZQrkBs4JzsS3LQrn%2BDf32xoXitGMt2H%2Bao7yLFplcmYpgk8tiQbvBrKGHxFYUCpFpDmCbLpao3yHoYNjmY2mrIYOFIEpFCrwpN4z7gHfm%2FPviDdQVJiyAews3svSglGcuykJ4vaHK%2FOB2G5LwTEVXAUB25K%2BMQ92nueca3jDdswkHWuHVuhVBLfGJu5XfSgsBeXPNOXP2uq2BLZj0%2FqmVFHmCXrAQoLDir7d3xz1iGSIZZqffrnLuX%2Ffpcw36evwwY6ngExmRkMV%2BHC8I8eyJ282qr4%2B12nStaqIqgqV0%2FDqPfqMII9wKJesd4DO9aOljfFS%2FXJQ0ZdcPYQ0a9J2TQlh93JcR%2FV54KRviduftojjdu%2BCTHCldC6AlARF5c0URqGlyjbQh2QuDONbOUmN6KY4PXVLfGkSiGKhM%2FHmkHzOkVc5%2FK%2F0SuhdiTFxbCBT0%2Fmr34I5ROLUZhubREbjl9BUQ%3D%3D&X-Amz-Signature=04a6b324d4fc90f23a417406dd9a465858c162c0f4806a531f9b52c5d31d4e2d",
      },
    ],
    room_schedules: {
      id: "id",
      room_name: "room_name",
      event_id: 1,
      event_name: "event_name",
      start_at: new Date(2025, 7, 16, 9, 50, 0, 0),
      end_at: new Date(2025, 7, 16, 10, 50, 0, 0),
    },
    call_for_presentation_schedules: {
      id: "id",
      presentation_type_name: "session",
      start_at: new Date(2025, 7, 16, 9, 50, 0, 0),
      end_at: new Date(2025, 7, 16, 10, 50, 0, 0),
      next_call_for_presentation_schedule: "next_call_for_presentation_schedule",
    },
  },
];

const sessionRawTimeSchedule: SessionExtraDataType[] = [
  {
    room_schedules: {
      id: crypto.randomUUID(),
      room_name: "room1",
      event_id: 1,
      event_name: "pycon2025",
      start_at: new Date(2025, 7, 16, 9, 50, 0, 0),
      end_at: new Date(2025, 7, 16, 10, 50, 0, 0),
    },
    call_for_presentation_schedules: {
      id: crypto.randomUUID(),
      presentation_type_name: "session",
      start_at: new Date(2025, 7, 16, 9, 50, 0, 0),
      end_at: new Date(2025, 7, 16, 10, 50, 0, 0),
      next_call_for_presentation_schedule: crypto.randomUUID(),
    },
  },
  {
    room_schedules: {
      id: crypto.randomUUID(),
      room_name: "room2",
      event_id: 1,
      event_name: "pycon2025",
      start_at: new Date(2025, 7, 16, 9, 50, 0, 0),
      end_at: new Date(2025, 7, 16, 10, 50, 0, 0),
    },
    call_for_presentation_schedules: {
      id: crypto.randomUUID(),
      presentation_type_name: "session",
      start_at: new Date(2025, 7, 16, 9, 50, 0, 0),
      end_at: new Date(2025, 7, 16, 10, 50, 0, 0),
      next_call_for_presentation_schedule: crypto.randomUUID(),
    },
  },
  {
    room_schedules: {
      id: crypto.randomUUID(),
      room_name: "room3",
      event_id: 1,
      event_name: "pycon2025",
      start_at: new Date(2025, 7, 16, 9, 50, 0, 0),
      end_at: new Date(2025, 7, 16, 10, 50, 0, 0),
    },
    call_for_presentation_schedules: {
      id: crypto.randomUUID(),
      presentation_type_name: "session",
      start_at: new Date(2025, 7, 16, 9, 50, 0, 0),
      end_at: new Date(2025, 7, 16, 10, 50, 0, 0),
      next_call_for_presentation_schedule: crypto.randomUUID(),
    },
  },
  {
    room_schedules: {
      id: crypto.randomUUID(),
      room_name: "room4",
      event_id: 1,
      event_name: "pycon2025",
      start_at: new Date(2025, 7, 16, 9, 50, 0, 0),
      end_at: new Date(2025, 7, 16, 10, 50, 0, 0),
    },
    call_for_presentation_schedules: {
      id: crypto.randomUUID(),
      presentation_type_name: "session",
      start_at: new Date(2025, 7, 16, 9, 50, 0, 0),
      end_at: new Date(2025, 7, 16, 10, 50, 0, 0),
      next_call_for_presentation_schedule: crypto.randomUUID(),
    },
  },
  {
    room_schedules: {
      id: crypto.randomUUID(),
      room_name: "room1",
      event_id: 1,
      event_name: "pycon2025",
      start_at: new Date(2025, 7, 16, 9, 50, 0, 0),
      end_at: new Date(2025, 7, 16, 10, 50, 0, 0),
    },
    call_for_presentation_schedules: {
      id: crypto.randomUUID(),
      presentation_type_name: "session",
      start_at: new Date(2025, 7, 16, 11, 0, 0, 0),
      end_at: new Date(2025, 7, 16, 11, 50, 0, 0),
      next_call_for_presentation_schedule: crypto.randomUUID(),
    },
  },
];

type SessionExtraDataType = {
  room_schedules: {
    id: string;
    room_name: string;
    event_id: number;
    event_name: string;
    start_at: Date;
    end_at: Date;
  };
  call_for_presentation_schedules: {
    id: string;
    presentation_type_name: string;
    start_at: Date;
    end_at: Date;
    next_call_for_presentation_schedule: string;
  };
};

type TimeTableData = {
  [date: string]: {
    [time: string]: {
      [room: string]:
        | {
            rowSpan: number;
            session: BackendAPISchemas.SessionSchema;
          }
        | undefined;
    };
  };
};

type SessionDate = {
  index: number;
  date: Date;
  ko: string;
  en: string;
};

type Room = {
  uuid: string;
  name: string;
  availableStartDate: Date;
  availableEndDate: Date;
};

const rawSessionDates: SessionDate[] = [
  {
    index: 1,
    date: new Date(2025, 7, 16),
    ko: "8월 16일 토요일",
    en: "August 16 (Sat)",
  },
  {
    index: 2,
    date: new Date(2025, 7, 17),
    ko: "8월 17일 일요일",
    en: "August 17 (Sun)",
  },
];

const rawRooms: Room[] = [
  {
    uuid: "room1",
    name: "4142호",
    availableStartDate: new Date(2025, 7, 15),
    availableEndDate: new Date(2025, 7, 16),
  },
  {
    uuid: "room2",
    name: "4147호",
    availableStartDate: new Date(2025, 7, 16),
    availableEndDate: new Date(2025, 7, 17),
  },
  {
    uuid: "room3",
    name: "5147호",
    availableStartDate: new Date(2025, 7, 16),
    availableEndDate: new Date(2025, 7, 17),
  },
  {
    uuid: "room4",
    name: "6144호",
    availableStartDate: new Date(2025, 7, 16),
    availableEndDate: new Date(2025, 7, 17),
  },
];

const getDateStr = (date: Date) => date.toLocaleDateString("ko-KR", { timeZone: "Asia/Seoul" });

const getRooms = (data: BackendAPISchemas.SessionSchema[]) => {
  const rooms: Set<string> = new Set();
  data.forEach((session) => session.room_schedules.room_name && rooms.add(session.room_schedules.room_name));
  return Array.from(rooms);
};

const getEveryTenMinutesArr = (start: Date, end: Date) => {
  let time = new Date(start);
  const arr = [];

  while (time <= end) {
    arr.push(time);
    time = new Date(new Date(time).setMinutes(time.getMinutes() + 10));
  }
  return arr;
};

const getConfStartEndTimePerDay: (data: BackendAPISchemas.SessionSchema[]) => {
  [date: string]: { start: Date; end: Date };
} = (data) => {
  const result: { [date: string]: { start: Date; end: Date } } = {};

  data.forEach((session) => {
    if (session.call_for_presentation_schedules.start_at && session.call_for_presentation_schedules.end_at) {
      const startTime = session.call_for_presentation_schedules.start_at;
      const endTime = session.call_for_presentation_schedules.end_at;
      const date = getDateStr(startTime);

      if (!result[date]) {
        result[date] = { start: startTime, end: endTime };
      } else {
        if (startTime < result[date].start) result[date].start = startTime;
        if (endTime > result[date].end) result[date].end = endTime;
      }
    }
  });

  return result;
};

const getPaddedTime = (time: Date) => `${time.getHours()}:${time.getMinutes().toString().padStart(2, "0")}`;

const getTimeTableData: (data: BackendAPISchemas.SessionSchema[]) => TimeTableData = (data) => {
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
    if (session.call_for_presentation_schedules.start_at && session.call_for_presentation_schedules.end_at) {
      const start = session.call_for_presentation_schedules.start_at;
      const end = session.call_for_presentation_schedules.end_at;
      const durationMin = (end.getTime() - start.getTime()) / 1000 / 60;
      timeTableData[getDateStr(start)][getPaddedTime(start)][session.room_schedules.room_name] = {
        rowSpan: durationMin / 10,
        session,
      };
    }
  });

  return timeTableData;
};

const ErrorHeading = styled(Typography)({
  fontSize: "1em",
  fontWeight: 400,
  lineHeight: 1.25,
  textDecoration: "none",
  whiteSpace: "pre-wrap",
});

export const SessionTimeTable: React.FC = ErrorBoundary.with(
  { fallback: ErrorFallback },
  Suspense.with({ fallback: <ErrorHeading>{"세션 시간표를 불러오는 중 입니다."}</ErrorHeading> }, () => {
    const useGenerateSessionData: () => BackendAPISchemas.SessionSchema[] = () => {
      let rawData: BackendAPISchemas.SessionSchema[] = [];
      for (var i = 0; i < sessionRawTimeSchedule.length; i++) {
        rawData.push(sessionRawData[0]);
        rawData[rawData.length - 1].room_schedules = sessionRawTimeSchedule[i].room_schedules;
        rawData[rawData.length - 1].call_for_presentation_schedules = sessionRawTimeSchedule[i].call_for_presentation_schedules;
      }
      return rawData;
    };

    const [sessionData, setSessionData] = React.useState<BackendAPISchemas.SessionSchema[]>(useGenerateSessionData());
    const [sessionDates, setSessionDates] = React.useState<SessionDate[]>(rawSessionDates);
    const [selectedDate, setSelectedDate] = React.useState<SessionDate>(sessionDates[0]);
    const [timeTableData, setTimeTableData] = React.useState<TimeTableData>(getTimeTableData(sessionData));
    const tempDateStr: string = getDateStr(selectedDate.date);
    const [selectedTableData, setSelectedTableData] = React.useState(timeTableData[tempDateStr]);

    const [dates, setDates] = React.useState(Object.keys(timeTableData).sort((a, b) => new Date(a).getTime() - new Date(b).getTime()));
    const [rooms, setRooms] = React.useState<{ [room: string]: number }>(getRooms(sessionData).reduce((acc, room) => ({ ...acc, [room]: 0 }), {}));
    const [roomCount, setRoomCount] = React.useState<number>(Object.keys(rooms).length);
    const [sortedRoomList, setSortedRoomList] = React.useState(Object.keys(rooms).sort());

    let breakCount = 0;

    const SessionColumn: React.FC<{
      rowSpan: number;
      colSpan: number;
      session: BackendAPISchemas.SessionSchema;
    }> = ({ rowSpan, colSpan, session }) => {
      const navigate = useNavigate();
      const clickable = R.isArray(session.speakers) && !R.isEmpty(session.speakers);
      // Firefox는 rowSpan된 td의 height를 계산할 때 rowSpan을 고려하지 않습니다. 따라서 직접 계산하여 height를 설정합니다.
      const sessionBoxHeight = `${TD_HEIGHT * rowSpan}rem`;
      const urlSafeTitle = session.title
        .replace(/ /g, "-")
        .replace(/([.])/g, "_")
        .replace(/(?![.0-9A-Za-zㄱ-ㅣ가-힣-])./g, "");
      return (
        <TableCell rowSpan={rowSpan} colSpan={colSpan}>
          <SessionBox
            onClick={() => clickable && navigate(`/session/${session.id}#${urlSafeTitle}`)}
            className={clickable ? "clickable" : ""}
            style={{ height: sessionBoxHeight }}
          >
            <SessionTitle children={session.title} align="center" />
            <SessionSpeakerItemContainer direction="row">
              {session.speakers.map((speaker) => (
                <Chip key={speaker.id} size="small" label={speaker.nickname} />
              ))}
            </SessionSpeakerItemContainer>
            <SessionTimeTableItemTagContainer direction="row">
              {session.categories.map((category) => (
                <Chip key={category.id} variant="outlined" color="primary" size="small" label={category.name} />
              ))}
            </SessionTimeTableItemTagContainer>
          </SessionBox>
        </TableCell>
      );
    };

    const SessionDateTab: React.FC = () => {
      // @ts-ignore
      const convertLanguage = (dateString: SessionDate) => {
        const language: "ko" | "en" = "ko";
        if (language === "ko") {
          return dateString.ko;
        } else {
          return dateString.en;
        }
      };

      return (
        <Box>
          <ColoredDivider />
          <SessionDateTabContainer>
            {sessionDates.map((sessionDate) => {
              return (
                <ButtonBase onClick={() => setSelectedDate(sessionDate)}>
                  <SessionDateItemContainer direction="column">
                    <SessionDateTitle
                      children={"Day " + sessionDate.index}
                      isSelected={getDateStr(sessionDate.date) === getDateStr(selectedDate.date)}
                    />
                    <SessionDateSubTitle
                      children={convertLanguage(sessionDate)}
                      isSelected={getDateStr(sessionDate.date) === getDateStr(selectedDate.date)}
                    />
                  </SessionDateItemContainer>
                </ButtonBase>
              );
            })}
          </SessionDateTabContainer>
          <ColoredDivider />
        </Box>
      );
    };

    return (
      <Box sx={{ flexDirection: "column", width: "90%" }}>
        <SessionDateTab />
        <SessionTableContainer>
          <SessionTableStyle>
            <TableHead>
              <SessionTableRow>
                {sortedRoomList.map((room) => {
                  return (
                    <SessionTableCell>
                      <RoomTitle align="center">{room}</RoomTitle>
                    </SessionTableCell>
                  );
                })}
              </SessionTableRow>
            </TableHead>
            <SessionTableBody>
              <TableRow>
                <TableCell colSpan={roomCount + 1}></TableCell>
              </TableRow>
              {Object.entries(selectedTableData).map(([time, roomData], i, a) => {
                const hasSession = Object.values(rooms).some((c) => c >= 1) || Object.values(roomData).some((room) => room !== undefined);

                if (!hasSession) {
                  if (breakCount > 1) {
                    breakCount--;
                    return <TableRow></TableRow>;
                  } else {
                    // 지금부터 다음 세션이 존재하기 전까지의 휴식 시간을 계산합니다.
                    breakCount = 1;
                    for (let bi = i + 1; bi < a.length; bi++) {
                      if (Object.values(a[bi][1]).some((room) => room !== undefined)) break;
                      breakCount += 1;
                    }

                    // I really hate this, but I can't think of a better way to do this.
                    const height = (TD_HEIGHT * breakCount) / (breakCount <= 2 ? 1 : 3);
                    return (
                      <TableRow>
                        <TableCell
                          style={{
                            // height: `${height}rem`,
                            // transform: `translateY(-${height / 2}rem)`,
                            border: "unset",
                          }}
                        >
                          {time}
                        </TableCell>
                        <TableCell colSpan={roomCount + 1} rowSpan={breakCount} style={{ height: `${height}rem` }}>
                          <Box
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            {i !== a.length - 1 && <RestTitle>{"휴식"}</RestTitle>}
                          </Box>
                        </TableCell>
                      </TableRow>
                    );
                  }
                }

                // 만약 세션 타입이 아닌 발표가 존재하는 경우, 해당 줄에서는 colSpan이 roomCount인 column을 생성합니다.
                const nonSessionTypeData = Object.values(roomData).find((room) => room !== undefined && room.session.isSession);
                if (nonSessionTypeData) {
                  Object.keys(rooms).forEach((room) => (rooms[room] = nonSessionTypeData.rowSpan - 1));
                  return (
                    <TableRow>
                      <TableCell sx={{ border: "unset" }}>{time}</TableCell>
                      <SessionColumn rowSpan={nonSessionTypeData.rowSpan} colSpan={roomCount} session={nonSessionTypeData.session} />
                    </TableRow>
                  );
                }

                return (
                  <TableRow>
                    <TableCell sx={{ border: "unset" }}>{time}</TableCell>
                    {sortedRoomList.map((room) => {
                      const roomDatum = roomData[room];
                      if (roomDatum === undefined) {
                        // 진행 중인 세션이 없는 경우, 해당 줄에서는 해당 room의 빈 column을 생성합니다.
                        if (rooms[room] <= 0) return <td></td>;
                        // 진행 중인 세션이 있는 경우, 이번 줄에서는 해당 세션들만큼 column을 생성하지 않습니다.
                        rooms[room] -= 1;
                        return null;
                      }
                      // 세션이 여러 줄에 걸쳐있는 경우, n-1 줄만큼 해당 room에 column을 생성하지 않도록 합니다.
                      if (roomDatum.rowSpan > 1) rooms[room] = roomDatum.rowSpan - 1;
                      return <SessionColumn key={room} rowSpan={roomDatum.rowSpan} colSpan={1} session={roomDatum.session} />;
                    })}
                  </TableRow>
                );
              })}
            </SessionTableBody>
          </SessionTableStyle>
        </SessionTableContainer>
      </Box>
    );
  })
);

const SessionTimeTableItemTagContainer = styled(Stack)({
  alignItems: "center",
  justifyContent: "center",
});

const SessionDateItemContainer = styled(Stack)({
  alignItems: "center",
  justifyContent: "center",
  padding: "1rem 3rem",
});

const SessionDateTitle = styled(Typography)<{ isSelected: boolean }>(({ theme, isSelected }) => ({
  fontSize: "2.25em",
  fontWeight: 600,
  lineHeight: 1.25,
  textDecoration: "none",
  whiteSpace: "pre-wrap",
  color: isSelected ? theme.palette.primary.main : theme.palette.primary.light,
}));

const SessionDateSubTitle = styled(Typography)<{ isSelected: boolean }>(({ theme, isSelected }) => ({
  fontSize: "1em",
  fontWeight: 600,
  lineHeight: 1.25,
  textDecoration: "none",
  whiteSpace: "pre-wrap",
  color: isSelected ? theme.palette.primary.main : theme.palette.primary.light,
}));

const RestTitle = styled(Typography)({
  fontSize: "1em",
  fontWeight: 500,
  lineHeight: 1.25,
  textDecoration: "none",
  whiteSpace: "pre-wrap",
});

const SessionTitle = styled(Typography)({
  fontSize: "1.25em",
  fontWeight: 600,
  lineHeight: 1.25,
  textDecoration: "none",
  whiteSpace: "pre-wrap",
});

const RoomTitle = styled(Typography)({
  fontSize: "1.25em",
  fontWeight: 500,
});

const ColoredDivider = styled(StyledDivider)(({ theme }) => ({
  color: theme.palette.primary.main,
}));

const SessionSpeakerItemContainer = styled(Stack)({
  alignItems: "center",
  justifyContent: "center",
});

const SessionTableStyle = styled(Table)({
  alignItems: "center",
  justifyContent: "center",
  gap: "1rem",
  width: "100%",
  flex: 1,
});

const SessionTableBody = styled(TableBody)({
  gap: "1rem",
});

const SessionTableRow = styled(TableRow)({
  alignItems: "center",
  justifyContent: "center",
});

const SessionTableCell = styled(TableCell)({
  alignItems: "center",
  justifyContent: "center",
  border: "unset",
});

const SessionDateTabContainer = styled(Box)({
  display: "flex",
  gap: "2rem",
  justifyContent: "center",
  alignItems: "center",
  button: {
    backgroundColor: "unset",
    color: "rgba(255, 255, 255, 0.5)",
    border: "unset",
    "&.selected": {
      color: "rgba(255, 255, 255, 1)",
    },
  },
  "h1, h2, h3, h4, h5, h6": {
    margin: 0,
    color: "inherit",
  },
});

const SessionBox = styled(Box)(({ theme }) => ({
  height: "100%",
  margin: "0.25rem",
  padding: "0.25rem",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  border: `1px solid color-mix(in srgb, ${theme.palette.primary.light} 50%, transparent 50%)`,
  borderRadius: "0.5rem",
  backgroundColor: `${theme.palette.primary.light}1A`,
  fontSize: "1rem",
  gap: "0.5rem",
}));

const SessionTableContainer = styled(Box)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: "1rem",
});
