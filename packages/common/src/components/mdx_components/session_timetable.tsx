import * as React from "react";
import BackendAPISchemas from "../../schemas/backendAPI";
import { Box, Button, Stack, styled, Typography } from "@mui/material";
import { ErrorBoundary, Suspense } from "@suspensive/react";
import { ErrorFallback } from "../error_handler";
import Hooks from "../../hooks";
import { BackendAPIClient } from "../../apis/client";
import { StyledDivider } from "./styled_divider";
import * as R from "remeda";


type Position = {
    readonly left: number;
    readonly top: number;
    readonly width: number;
    readonly height: number;
}

type SessionTimeTableSlotType = {
    session: BackendAPISchemas.SessionSchema;
    position: Position;
}

type SessionDate = {
    index: number;
    date: Date;
    ko: string;
    en: string;
}

const sessionDates: SessionDate[] = [
    {
        index: 1,
        date: new Date(2025, 8, 15),
        ko: "8월 15일 금요일",
        en: "August 15 (Fri)"
    },
    {
        index: 2,
        date: new Date(2025, 8, 16),
        ko: "8월 16일 토요일",
        en: "August 16 (Sat)"
    },
    {
        index: 3,
        date: new Date(2025, 8, 17),
        ko: "8월 17일 일요일",
        en: "August 17 (Sun)"
    }
];

const SessionTimeTableItem: React.FC<{ data: SessionTimeTableSlotType }> = ({ data }) => {
    const sessionCategories = data.session.categories;

    return (
        <SessionTimeTableItemBox position={data.position} >
            <SessionTimeTableItemContainer direction="column">
            <SessionTimeTableItemTagContainer direction="row">
                {sessionCategories.map((category) => (
                    <CategoryButtonStyle>
                        {category.name}
                    </CategoryButtonStyle>
                ))}
            </SessionTimeTableItemTagContainer>
            <SessionTitle children={data.session.title} />
            <SpeakerName children={data.session.speakers ? data.session.speakers[0].nickname : ""} />
        </SessionTimeTableItemContainer>
        </SessionTimeTableItemBox>
    );
}

const ErrorHeading = styled(Typography)({
    fontSize: "1em",
    fontWeight: 400,
    lineHeight: 1.25,
    textDecoration: "none",
    whiteSpace: "pre-wrap",
  });

export const SessionTimeTable: React.FC = ErrorBoundary.with(
    { fallback: ErrorFallback },
    Suspense.with(
        { fallback: <ErrorHeading>{"세션 목록을 불러오는 중 입니다."}</ErrorHeading> },
        () => {
            const SessionDateTab: React.FC = () => {
                const convertLanguage = (dateString: SessionDate) => {
                    const language: "ko" | "en" = "ko";
                    if (language === "ko") {
                        return dateString.ko;
                    } else {
                        return dateString.en;
                    }
                }

                return (
                    <SessionDateTabContainer>
                        <StyledDivider />
                            {sessionDates.map(sessionDate => {
                               return (
                                <SessionDateItemContainer direction="column">
                                    <SessionDateTitle children={"Day " + sessionDate.index} isSelected={sessionDate.date.toDateString() === selectedDate} />
                                    <SessionDateSubTitle children={convertLanguage(sessionDate)} isSelected={sessionDate.date.toDateString() === selectedDate} />
                                </SessionDateItemContainer>)
                            })}
                        <StyledDivider />
                    </SessionDateTabContainer>
                );
            }

            const backendAPIClient = Hooks.BackendAPI.useBackendClient();
            const { data: sessions } = Hooks.BackendAPI.useSessionsQuery(backendAPIClient);
            const [sessionData, setSessionData] = React.useState(sessions);
            const [selectedDate, setSelectedDate] = React.useState("");
            const filteredSessions = React.useMemo(() => {
                return sessions.filter((session) => {
                    return selectedDate === session.schedule.startTime.toDateString();
                });
            }, [sessions, selectedDate]);

            const filteredSessionTimeTableSlots: SessionTimeTableSlotType[] = React.useMemo(() => {
                let data: SessionTimeTableSlotType[] = [];
                filteredSessions.map(session => {
                    data.push({
                        session: session,
                        left: 1,
                        top: 2,
                        width: 3,
                        height: 4
                    })
                });
                return data;
            }, [filteredSessions, selectedDate])

            return (
                <>
                    <SessionDateTab />
                </>
            );
        }
    )
)

const SessionTimeTableItemBox = styled(Box)<{position: Position}>(({position}) => ({
    alignItems: "center",
    justifyContent: "center",
    position: "absolute" as const,
    left: position.left,
    top: position.top,
    width: position.width,
    height: position.height,
}));

const SessionTimeTableItemContainer = styled(Stack)({
    alignItems: "center",
    justifyContent: "center"
});

const SessionTimeTableItemTagContainer = styled(Stack)({
    alignItems: "center",
    justifyContent: "center",
});

const SessionDateTabContainer = styled(Box)({
    alignItems: "center",
    justifyContent: "center"
});

const SessionDateItemContainer = styled(Stack)({
    alignItems: "center",
    justifyContent: "center"
});

const SessionDateTitle = styled(Typography)<{isSelected: boolean}>(({theme, isSelected}) => ({
    fontSize: "1.5em",
    fontWeight: 400,
    lineHeight: 1.25,
    textDecoration: "none",
    whiteSpace: "pre-wrap",
    color: isSelected ? theme.palette.primary.main : theme.palette.primary.light
}));

const SessionDateSubTitle = styled(Typography)<{isSelected: boolean}>(({theme, isSelected}) => ({
    fontSize: "1.5em",
    fontWeight: 400,
    lineHeight: 1.25,
    textDecoration: "none",
    whiteSpace: "pre-wrap",
    color: isSelected ? theme.palette.primary.main : theme.palette.primary.light
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


