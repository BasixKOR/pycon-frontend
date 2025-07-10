import { Box, Button, Stack, styled, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { ErrorBoundary, Suspense } from "@suspensive/react";
import * as React from "react";
import BackendAPISchemas from "../../schemas/backendAPI";
import { ErrorFallback } from "../error_handler";
import { StyledDivider } from "./styled_divider";

const sessionRawData: BackendAPISchemas.SessionSchema[] = [
  {
    id: "efbaf783-25f7-47ec-a8bc-dc1af549d650",
    title: '"네? 파이썬을요? 제가요?" 부제: 우당탕탕 개발자로 성장하기(진행중)',
    description: "",
    image: null,
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
      start_at: new Date(),
      end_at: new Date(),
    },
    call_for_presentation_schedules: {
      id: "id",
      presentation_type_name: "session",
      start_at: new Date(),
      end_at: new Date(),
      next_call_for_presentation_schedule: "next_call_for_presentation_schedule",
    },
  },
];

const sessionRawTimeSchedule: SessionExtraDataType[] = [
  {
    room_schedules: {
      id: crypto.randomUUID(),
      room_name: "eventhall",
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
      room_name: "eventhall",
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
      room_name: "eventhall",
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
];

const generateSessionData: () => BackendAPISchemas.SessionSchema[] = () => {
  let rawData: BackendAPISchemas.SessionSchema[] = [];
  for (var i = 0; i < sessionRawTimeSchedule.length; i++) {
    rawData.push(sessionRawData[0]);
    rawData[rawData.length - 1].room_schedules = sessionRawTimeSchedule[i].room_schedules;
    rawData[rawData.length - 1].call_for_presentation_schedules = sessionRawTimeSchedule[i].call_for_presentation_schedules;
  }
  return rawData;
};

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

type SessionTimeTableSlotType = {
  session: BackendAPISchemas.SessionSchema;
  rowSpan: number;
  colSpan: number;
};

type SessionDate = {
  index: number;
  date: Date;
  ko: string;
  en: string;
};

type Room = {
  name: string;
  availableStartDate: Date;
  availableEndDate: Date;
};

// @ts-ignore
const rawSessionDates: SessionDate[] = [
  {
    index: 1,
    date: new Date(2025, 8, 15),
    ko: "8월 15일 금요일",
    en: "August 15 (Fri)",
  },
  {
    index: 2,
    date: new Date(2025, 8, 16),
    ko: "8월 16일 토요일",
    en: "August 16 (Sat)",
  },
  {
    index: 3,
    date: new Date(2025, 8, 17),
    ko: "8월 17일 일요일",
    en: "August 17 (Sun)",
  },
];

const SessionTimeTableItem: React.FC<{ data: SessionTimeTableSlotType }> = ({ data }) => {
  const sessionCategories = data.session.categories;

  return (
    <SessionTimeTableItemContainer direction="column">
      <SessionTimeTableItemTagContainer direction="row">
        {sessionCategories.map((category) => (
          <CategoryButtonStyle>{category.name}</CategoryButtonStyle>
        ))}
      </SessionTimeTableItemTagContainer>
      <SessionTitle children={data.session.title} />
      <SpeakerName children={data.session.speakers ? data.session.speakers[0].nickname : ""} />
    </SessionTimeTableItemContainer>
  );
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
          <SessionDateTabContainer>
            <StyledDivider />
            {sessionDates.map((sessionDate) => {
              return (
                <SessionDateItemContainer direction="column">
                  <SessionDateTitle children={"Day " + sessionDate.index} isSelected={sessionDate.date === selectedDate.date} />
                  <SessionDateSubTitle children={convertLanguage(sessionDate)} isSelected={sessionDate.date === selectedDate.date} />
                </SessionDateItemContainer>
              );
            })}
            <StyledDivider />
          </SessionDateTabContainer>
        </Box>
      );
    };

    // const backendAPIClient = Hooks.BackendAPI.useBackendClient();
    // const { data: sessions } = Hooks.BackendAPI.useSessionsQuery(backendAPIClient);
    const sessions: BackendAPISchemas.SessionSchema[] = generateSessionData();
    // @ts-ignore
    const [sessionData, setSessionData] = React.useState(sessions);
    // @ts-ignore
    const [sessionDates, setSessionDates] = React.useState<SessionDate[]>(rawSessionDates);
    // @ts-ignore
    const [selectedDate, setSelectedDate] = React.useState<SessionDate>(sessionDates[0]);
    // @ts-ignore
    const [sessionRooms, setSessionRooms] = React.useState<Room[]>([]);
    const filteredSessions = React.useMemo(() => {
      return sessions.filter((session) => {
        return selectedDate.date.toLocaleDateString() === session.room_schedules.start_at.toLocaleDateString();
      });
    }, [sessions, selectedDate]);

    const filteredSessionTimeTableSlots: SessionTimeTableSlotType[] = React.useMemo(() => {
      let data: SessionTimeTableSlotType[] = [];
      filteredSessions.map((session) => {
        data.push({
          session: session,
          rowSpan: 1,
          colSpan: 1,
        });
      });
      return data;
    }, [filteredSessions, selectedDate]);

    return (
      <>
        <SessionDateTab />
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {sessionRooms.map((room) => {
                  return <TableCell>{room.name}</TableCell>;
                })}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredSessionTimeTableSlots.map((session) => {
                return <SessionTimeTableItem data={session} />;
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </>
    );
  })
);

const SessionTimeTableItemContainer = styled(Stack)({
  alignItems: "center",
  justifyContent: "center",
});

const SessionTimeTableItemTagContainer = styled(Stack)({
  alignItems: "center",
  justifyContent: "center",
});

const SessionDateTabContainer = styled(Box)({
  alignItems: "center",
  justifyContent: "center",
});

// @ts-ignore
const SessionDateItemContainer = styled(Stack)({
  alignItems: "center",
  justifyContent: "center",
});

// @ts-ignore
const SessionDateTitle = styled(Typography)<{ isSelected: boolean }>(({ theme, isSelected }) => ({
  fontSize: "1.5em",
  fontWeight: 400,
  lineHeight: 1.25,
  textDecoration: "none",
  whiteSpace: "pre-wrap",
  color: isSelected ? theme.palette.primary.main : theme.palette.primary.light,
}));

// @ts-ignore
const SessionDateSubTitle = styled(Typography)<{ isSelected: boolean }>(({ theme, isSelected }) => ({
  fontSize: "1.5em",
  fontWeight: 400,
  lineHeight: 1.25,
  textDecoration: "none",
  whiteSpace: "pre-wrap",
  color: isSelected ? theme.palette.primary.main : theme.palette.primary.light,
}));

const CategoryButtonStyle = styled(Button)(({ theme }) => ({
  flexGrow: 0,
  flexShrink: 0,
  flexBasis: "14rem",

  wordBreak: "keep-all",
  whiteSpace: "nowrap",

  // backgroundColor: selected ? theme.palette.primary.light : "transparent",
  // color: selected ? theme.palette.primary.main : theme.palette.primary.light,  // main or light color로 지정
  backgroundColor: "transparent",
  color: theme.palette.primary.light,
  "&:hover": {
    color: theme.palette.primary.dark,
  },
}));

const SessionTitle = styled(Typography)({
  fontSize: "1.5em",
  fontWeight: 600,
  lineHeight: 1.25,
  textDecoration: "none",
  whiteSpace: "pre-wrap",
});

const SpeakerName = styled(Typography)({
  fontSize: "1em",
  fontWeight: 400,
  lineHeight: 1.25,
  textDecoration: "none",
  whiteSpace: "pre-wrap",
});
