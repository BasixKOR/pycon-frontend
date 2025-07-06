import { Box, Button, Chip, CircularProgress, Stack, styled, Typography } from "@mui/material";
import { ErrorBoundary, Suspense } from "@suspensive/react";
import * as React from "react";
import * as R from "remeda";

import PyCon2025Logo from "../../assets/pyconkr2025_logo.png";
import Hooks from "../../hooks";
import BackendAPISchemas from "../../schemas/backendAPI";
import { ErrorFallback } from "../error_handler";
import { FallbackImage } from "../fallback_image";
import { StyledDivider } from "./styled_divider";

const SessionItem: React.FC<{ session: BackendAPISchemas.SessionSchema }> = Suspense.with({ fallback: <CircularProgress /> }, ({ session }) => {
  const sessionTitle = session.title.replace("\\n", "\n");
  const speakerImgSrc = session.image || (R.isArray(session.speakers) && !R.isEmpty(session.speakers) && session.speakers[0].image) || "";
  // const urlSafeTitle = session.title
  //   .replace(/ /g, "-")
  //   .replace(/([.])/g, "_")
  //   .replace(/(?![0-9A-Za-zㄱ-ㅣ가-힣-_])./g, "");
  // const sessionDetailedUrl = `/session/${session.id}#${urlSafeTitle}`;

  return (
    <>
      {/* <Link to={sessionDetailedUrl} style={{ textDecoration: "none" }}> */}
      <SessionItemContainer direction="row">
        <SessionImageContainer
          children={<SessionImage src={speakerImgSrc} alt="Session Image" loading="lazy" errorFallback={<SessionImageErrorFallback />} />}
        />
        <Stack direction="column" sx={{ flexGrow: 1, py: 0.5, gap: 0.75 }}>
          <SessionTitle children={sessionTitle} />
          <Stack direction="row" spacing={0.5}>
            {session.speakers.map((speaker) => (
              <Chip key={speaker.id} size="small" label={speaker.nickname} />
            ))}
          </Stack>
          <Stack direction="row" spacing={0.5}>
            {session.categories.map((tag) => (
              <Chip key={tag.id} variant="outlined" color="primary" size="small" label={tag.name} />
            ))}
          </Stack>
        </Stack>
      </SessionItemContainer>
      {/* </Link> */}
      <StyledDivider />
    </>
  );
});

type SessionListPropType = {
  event?: string;
  types?: string[];
};

export const SessionList: React.FC<SessionListPropType> = ErrorBoundary.with(
  { fallback: ErrorFallback },
  Suspense.with({ fallback: <CircularProgress /> }, ({ event, types }) => {
    const { language } = Hooks.Common.useCommonContext();
    const backendAPIClient = Hooks.BackendAPI.useBackendClient();
    const params = { ...(event && { event }), ...(types && { types: types.join(",") }) };
    const { data: sessions } = Hooks.BackendAPI.useSessionsQuery(backendAPIClient, params);

    const warningMessage =
      language === "ko"
        ? "* 발표 목록은 발표자 사정에 따라 변동될 수 있습니다."
        : "* The list of sessions may change due to the speaker's circumstances.";

    const [selectedCategoryIds, setSelectedCategories] = React.useState<string[]>([]);
    const toggleCategory = (catId: string) => setSelectedCategories((ps) => (ps.includes(catId) ? ps.filter((id) => id !== catId) : [...ps, catId]));
    const categories = React.useMemo(
      () =>
        sessions
          .map((s) => s.categories)
          .flat()
          .filter((o1, i, a) => a.findIndex((o2) => o2.id === o1.id) === i),
      [sessions]
    );
    const filteredSessions = React.useMemo(() => {
      return sessions.filter((session) => {
        const sessionCategoryIds: string[] = session.categories.map((category) => category.id);
        return selectedCategoryIds.length === 0 || selectedCategoryIds.some((cat) => sessionCategoryIds.includes(cat));
      });
    }, [sessions, selectedCategoryIds]);

    return (
      <Box sx={{ my: 2 }}>
        <Box>
          <Typography variant="body2" sx={{ width: "100%", textAlign: "right", my: 0.5, fontSize: "0.6rem" }} children={warningMessage} />
          <StyledDivider />
          {categories && (
            <>
              <Stack direction="row" sx={{ flexWrap: "wrap", justifyContent: "center", gap: "0.1rem 0.2rem", my: 1 }}>
                {categories.map((cat) => (
                  <CategoryButtonStyle
                    key={cat.id}
                    onClick={() => toggleCategory(cat.id)}
                    children={cat.name}
                    selected={selectedCategoryIds.some((selectedCatId) => selectedCatId === cat.id)}
                  />
                ))}
              </Stack>
              <StyledDivider />
            </>
          )}
        </Box>
        {filteredSessions.map((s) => (
          <SessionItem key={s.id} session={s} />
        ))}
      </Box>
    );
  })
);

const CategoryButtonStyle = styled(Button)<{ selected?: boolean }>(({ theme, selected }) => ({
  flexGrow: 0,
  flexShrink: 0,
  flexBasis: "14rem",

  wordBreak: "keep-all",
  whiteSpace: "nowrap",

  backgroundColor: selected ? theme.palette.primary.light : "transparent",
  color: selected ? theme.palette.primary.main : theme.palette.primary.light,
  "&:hover": {
    color: theme.palette.primary.dark,
  },
}));

const SessionItemContainer = styled(Stack)(({ theme }) => ({
  alignItems: "center",
  justifyContent: "flex-start",
  padding: "0.5rem 1.5rem",
  gap: "1.5rem",
  minHeight: "9rem",

  [theme.breakpoints.down("md")]: {
    fontSize: "0.75rem",
    padding: "0.5rem",
    gap: "1rem",

    "& .MuiChip-labelSmall": {
      fontSize: "0.75em",
    },
  },
}));

const SessionImageContainer = styled(Stack)({
  alignItems: "center",
  justifyContent: "center",

  width: "6rem",
  minWidth: "6rem",
  maxWidth: "6rem",
  height: "6rem",
  minHeight: "6rem",
  maxHeight: "6rem",
});

const SessionImage = styled(FallbackImage)(({ theme }) => ({
  border: `1px solid color-mix(in srgb, ${theme.palette.primary.light} 50%, transparent 50%)`,

  width: "100%",
  height: "100%",
  borderRadius: "50%",
  objectFit: "cover",
}));

const SessionImageErrorFallbackBox = styled(Box)(({ theme }) => ({
  width: "100%",
  height: "100%",
  borderRadius: "50%",
  border: `1px solid color-mix(in srgb, ${theme.palette.primary.light} 50%, transparent 50%)`,

  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const SessionImageErrorFallback: React.FC = () => (
  <SessionImageErrorFallbackBox>
    <img src={PyCon2025Logo} alt="PyCon 2025 Logo" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }} />
  </SessionImageErrorFallbackBox>
);

const SessionTitle = styled(Typography)({
  fontSize: "1.5em",
  fontWeight: 600,
  lineHeight: 1.25,
  textDecoration: "none",
  whiteSpace: "pre-wrap",
});
