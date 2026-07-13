import { SwapHoriz } from "@mui/icons-material";
import { keyframes, Stack, styled, TableRow, Typography } from "@mui/material";
import { FC } from "react";

import { TIME_COL_WIDTH } from "./session_timetable_data";

// 세로형 SessionTimeTable / 가로형 SessionTimeTableTransposed 가 공유하는 표시용(styled·컴포넌트) 조각.
// 순수 데이터 헬퍼는 ./session_timetable_data 로 분리되어 있다.

export const BreakTime: FC<{ language: "ko" | "en"; duration: number }> = ({ language, duration }) => {
  const text = language === "ko" ? `휴식 (${duration}분)` : `Break Time (${duration}min.)`;
  return <Typography variant="subtitle2" fontWeight="500" children={text} />;
};

// 표가 화면 폭을 넘겨 좌우 스크롤이 가능할 때만 상단에 노출하는 작은 안내 문구.
// visible 이 false 여도 자리를 유지해 나타날 때 레이아웃이 흔들리지 않도록 opacity 로만 감춘다.
export const HorizontalScrollNotice: FC<{ visible: boolean; language: "ko" | "en" }> = ({ visible, language }) => (
  <Stack
    direction="row"
    alignItems="center"
    gap={0.25}
    aria-hidden={!visible}
    sx={{
      flexShrink: 0,
      color: (t) => t.palette.primary.main,
      fontSize: "0.6rem",
      whiteSpace: "nowrap",
      userSelect: "none",
      pointerEvents: "none",
      opacity: visible ? 1 : 0,
      transition: "opacity 0.25s ease",
    }}
  >
    <SwapHoriz sx={{ fontSize: "0.9rem" }} />
    <span>{language === "ko" ? "좌우로 스크롤할 수 있습니다" : "Scroll horizontally to see more"}</span>
  </Stack>
);

export const SessionDateItemContainer = styled(Stack)({
  alignItems: "center",
  justifyContent: "center",
  padding: "1rem 3rem",
});

export const SessionDateTitle = styled(Typography)<{ isSelected: boolean }>(({ theme, isSelected }) => ({
  fontSize: "2.25em",
  fontWeight: 600,
  lineHeight: 1.25,
  textDecoration: "none",
  whiteSpace: "pre-wrap",
  color: isSelected ? theme.palette.primary.main : theme.palette.primary.light,
}));

export const SessionDateSubTitle = styled(Typography)<{ isSelected: boolean }>(({ theme, isSelected }) => ({
  fontSize: "1em",
  fontWeight: 600,
  lineHeight: 1.25,
  textDecoration: "none",
  whiteSpace: "pre-wrap",
  color: isSelected ? theme.palette.primary.main : theme.palette.primary.light,
}));

export const SessionTitle = styled(Typography)({
  fontSize: "1.125em",
  fontWeight: 600,
  lineHeight: 1.25,
  textDecoration: "none",
  whiteSpace: "pre-wrap",
  overflowWrap: "break-word", // 고정 너비 열에서 긴 제목 줄바꿈
});

export const SessionTableScroll = styled("div")({
  width: "100%",
  overflowX: "auto",
  overscrollBehaviorX: "none", // 좌우 스크롤이 뒤로가기 등 상위로 전파되지 않도록
  WebkitOverflowScrolling: "touch",
});

// 오버플로 안내 화살표가 스크롤을 살짝 재촉하도록 좌우로 흔드는 애니메이션
const nudgeRight = keyframes({
  "0%, 100%": { transform: "translateX(0)" },
  "50%": { transform: "translateX(0.2rem)" },
});
const nudgeLeft = keyframes({
  "0%, 100%": { transform: "translateX(0)" },
  "50%": { transform: "translateX(-0.2rem)" },
});

export const SessionTableScrollWrapper = styled("div")({
  position: "relative",
  width: "100%",
});

// 표가 화면 폭을 넘칠 때 해당 방향으로 더 스크롤할 수 있음을 알리는 페이드+화살표.
// data-visible 이 있을 때만 나타나고 클릭 가능해지며, 이때 눌러 한 화면씩 스크롤할 수 있다.
export const ScrollHintEdge = styled("button")(({ theme }) => ({
  position: "absolute",
  top: 0,
  bottom: 0,
  width: "3rem",
  display: "flex",
  alignItems: "flex-start",
  paddingTop: "0.75rem",
  color: theme.palette.primary.main,
  // button 기본 스타일 초기화
  border: "none",
  margin: 0,
  font: "inherit",
  appearance: "none",
  WebkitAppearance: "none",
  // 숨겨진(스크롤 불가) 동안엔 아래 셀 클릭을 막지 않도록 pointer-events 를 끈다.
  pointerEvents: "none",
  opacity: 0,
  transition: "opacity 0.25s ease",
  zIndex: 3, // sticky 시간 열(zIndex 2) 위에 표시
  "&[data-visible]": { opacity: 1, pointerEvents: "auto", cursor: "pointer" },

  "&.right": {
    right: 0,
    justifyContent: "flex-end",
    paddingRight: "0.25rem",
    background: `linear-gradient(to right, transparent, ${theme.palette.background.default})`,
  },
  // 좌측은 sticky 열을 덮지 않도록 그 너비만큼 안쪽에서 시작한다.
  // 고정 열 너비는 레이아웃마다 달라서 --hint-left 로 재정의할 수 있게 한다(미지정 시 시간 열 너비).
  // 인스턴스의 sx 보다 "&.left" 선택자 특이도가 높아 left 를 직접 덮을 수 없으므로 CSS 변수로 우회한다.
  "&.left": {
    left: `var(--hint-left, ${TIME_COL_WIDTH})`,
    justifyContent: "flex-start",
    paddingLeft: "0.25rem",
    background: `linear-gradient(to left, transparent, ${theme.palette.background.default})`,
  },
  "&.right svg": { animation: `${nudgeRight} 1.4s ease-in-out infinite` },
  "&.left svg": { animation: `${nudgeLeft} 1.4s ease-in-out infinite` },

  "@media (prefers-reduced-motion: reduce)": {
    svg: { animation: "none" },
  },
}));

export const SessionTableRow = styled(TableRow)({
  alignItems: "center",
  justifyContent: "center",
});

export const SessionBox = styled(Stack)(({ theme }) => ({
  height: "100%",
  padding: "0.25rem",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  border: `1px solid color-mix(in srgb, ${theme.palette.primary.light} 50%, transparent 50%)`,
  borderRadius: "0.5rem",

  backgroundColor: `${theme.palette.primary.light}1A`,
  transition: "all 0.25s ease",
  gap: "0.5rem",

  "&.clickable": {
    cursor: "pointer",
  },

  h6: {
    margin: 0,
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: "0.8rem",
    transition: "all 0.25s ease",
  },

  kbd: {
    backgroundColor: "rgba(222, 240, 128, 0.5)",
    padding: "0.1rem 0.25rem",
    margin: "0.5rem 0.25rem 0 0.25rem",
    borderRadius: "0.25rem",
    color: "black",
    fontSize: "0.6rem",
    transition: "all 0.25s ease",
  },

  "&:hover": {
    borderColor: `${theme.palette.primary.dark}`,
    backgroundColor: `${theme.palette.primary.light}57`,

    h6: {
      color: "rgba(255, 255, 255, 1)",
      transition: "all 0.25s ease",
    },

    kbd: {
      backgroundColor: "rgba(222, 240, 128, 0.75)",
      transition: "all 0.25s ease",
    },
  },

  "@media only screen and (max-width: 810px)": {
    fontSize: "0.75rem",
    margin: "0.1rem",
    padding: "0.1rem",
    h6: {
      fontSize: "0.666rem",
    },
    kbd: {
      fontSize: "0.45rem",
      margin: "0.25rem 0.1rem",
    },
  },
}));

export const SessionTableContainer = styled(Stack)({
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: "1rem",
  flex: 1,
});
