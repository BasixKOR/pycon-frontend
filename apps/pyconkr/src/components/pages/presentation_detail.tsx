import * as Common from "@frontend/common";
import { Box, Chip, CircularProgress, Divider, Stack, styled, Typography } from "@mui/material";
import { ErrorBoundary, Suspense } from "@suspensive/react";
import * as React from "react";
import { Navigate, useParams } from "react-router-dom";

import PyCon2025Logo from "../../assets/pyconkr2025_logo.png";
import { useAppContext } from "../../contexts/app_context";
import { PageLayout } from "../layout/PageLayout";

const PROFILE_IMAGE_SIZE = "7rem";

type SimplifiedSpeakerSchema = {
  id: string;
  nickname: string;
  image: string | null;
  biography: string;
};

const CenteredLoadingPage: React.FC = () => (
  <Common.Components.CenteredPage>
    <CircularProgress />
  </Common.Components.CenteredPage>
);

const StyledPresentationImage = styled(Common.Components.FallbackImage)(({ theme }) => ({
  maxWidth: "75%",
  maxHeight: "480px",
  aspectRatio: "1",
  margin: theme.spacing(4, 0),
  borderRadius: "2rem",
  border: `1px solid ${theme.palette.divider}`,

  [theme.breakpoints.down("lg")]: {
    maxWidth: "100%",
  },
}));

const DescriptionBox = styled(Box)(({ theme }) => ({
  width: "100%",
  padding: theme.spacing(2, 4),

  [theme.breakpoints.down("lg")]: {
    padding: theme.spacing(2),
  },
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(1),
  },

  "& .markdown-body": {
    width: "100%",
    p: { margin: theme.spacing(2, 0) },
    a: { color: theme.palette.primary.main },
  },
}));

const BiographyBox = styled(Box)(({ theme }) => ({
  width: "100%",

  "& .markdown-body": {
    width: "100%",
    p: { margin: theme.spacing(2, 0) },
    a: { color: theme.palette.primary.main },
  },
}));

const ProfileImageContainer = styled(Stack)({
  minWidth: PROFILE_IMAGE_SIZE,
  width: PROFILE_IMAGE_SIZE,
  maxWidth: PROFILE_IMAGE_SIZE,
  minHeight: PROFILE_IMAGE_SIZE,
  height: PROFILE_IMAGE_SIZE,
  maxHeight: PROFILE_IMAGE_SIZE,
  overflow: "hidden",
  borderRadius: "50%",
  border: `1px solid rgba(0, 0, 0, 0.12)`,
});

const ProfileImageStyle: React.CSSProperties = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
};

const ProfileImage = styled(Common.Components.FallbackImage)(ProfileImageStyle);

const ProfileImageErrorFallback: React.FC = () => (
  <Stack alignItems="center" justifyContent="center" sx={{ ...ProfileImageStyle }}>
    <img src={PyCon2025Logo} alt="PyCon 2025 Logo" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }} />
  </Stack>
);

const PresentationSpeakerItem: React.FC<{ speaker: SimplifiedSpeakerSchema }> = ({ speaker }) => {
  return (
    <>
      <Stack direction="row" spacing={4} sx={{ px: 2, py: 1 }}>
        <ProfileImageContainer sx={{ flexGrow: 0 }}>
          <ProfileImage alt="Speaker Image" src={speaker.image || ""} errorFallback={<ProfileImageErrorFallback />} />
        </ProfileImageContainer>
        <Stack alignItems="flex-start" justifyContent="center" sx={{ flexGrow: 1 }}>
          <Typography variant="h4" fontWeight="700" fontSize="2rem" children={speaker.nickname} />
          {speaker.biography ? (
            <BiographyBox children={<Common.Components.MDXRenderer text={speaker.biography || ""} format="md" />} />
          ) : (
            <>
              <br />
              <br />
            </>
          )}
        </Stack>
      </Stack>
      <Divider flexItem />
    </>
  );
};

const PresentationImageFallback: React.FC<{ language: "ko" | "en" }> = ({ language }) => {
  const message =
    language === "ko" ? (
      <>
        지금은 발표 사진을 불러올 수 없어요
        <br />
        잠시 후 다시 시도해 주세요.
      </>
    ) : (
      <>
        Unable to load the presentation image at the moment.
        <br />
        Please try again later.
      </>
    );

  return <Typography variant="caption" color="textSecondary" children={message} />;
};

export const PresentationDetailPage: React.FC = ErrorBoundary.with(
  { fallback: Common.Components.ErrorFallback },
  Suspense.with({ fallback: <CenteredLoadingPage /> }, () => {
    const { id } = useParams();
    const { language, setAppContext } = useAppContext();
    const backendClient = Common.Hooks.BackendAPI.useBackendClient();
    const { data: presentation } = Common.Hooks.BackendAPI.useSessionQuery(backendClient, id || "");

    if (!id || !presentation) return <Navigate to="/" replace />;

    const descriptionFallback = language === "ko" ? "해당 발표의 설명은 준비 중이에요!" : "Description of the presentation is under preparation!";
    const categoriesStr = language === "ko" ? "카테고리" : "Categories";
    const speakersStr = language === "ko" ? "발표자" : "Speakers";
    // const slideShowStr = language === "ko" ? "발표 슬라이드" : "Presentation Slideshow";

    React.useEffect(() => {
      setAppContext((prev) => ({
        ...prev,
        title: language === "ko" ? "발표 상세" : "Presentation Detail",
        shouldShowTitleBanner: true,
        shouldShowSponsorBanner: true,
      }));
    }, [language, presentation, setAppContext]);

    return (
      <PageLayout>
        <Typography variant="h4" fontWeight="700" textAlign="start" sx={{ width: "100%", px: 2, pt: 0, pb: 1 }} children={presentation.title} />
        {presentation.summary && (
          <Typography variant="h6" fontWeight="700" textAlign="start" sx={{ width: "100%", px: 2, pt: 1, pb: 3 }} children={presentation.summary} />
        )}
        <Divider flexItem />
        {presentation.categories.length ? (
          <>
            <Stack direction="row" alignItems="center" justifyContent="flex-start" sx={{ width: "100%", gap: 1, p: 2 }}>
              <Typography variant="subtitle1" fontWeight="bold" children={categoriesStr} />
              <Stack direction="row" spacing={1} sx={{ width: "100%" }}>
                {presentation.categories.map((c) => (
                  <Chip key={c.id} size="small" variant="outlined" color="primary" label={c.name} />
                ))}
              </Stack>
            </Stack>
            <Divider flexItem />
          </>
        ) : null}
        {/* {presentation.slideshow_url && (
          <>
            <Typography variant="subtitle1" fontWeight="bold" sx={{ width: "100%", p: 2, a: { color: "blue" } }}>
              {slideShowStr} :&nbsp;
              <Common.Components.LinkHandler href={presentation.slideshow_url} children={presentation.slideshow_url} />
            </Typography>
            <Divider flexItem />
          </>
        )} */}
        {presentation.image && (
          <StyledPresentationImage
            alt="Presentation Image"
            src={presentation.image}
            errorFallback={<PresentationImageFallback language={language} />}
          />
        )}
        <DescriptionBox>
          <Common.Components.MDXRenderer text={presentation.description || descriptionFallback} format="md" />
        </DescriptionBox>
        <Divider flexItem />
        {presentation.speakers && (
          <>
            <Typography variant="h5" fontWeight="bold" sx={{ width: "100%", px: 2, py: 4 }} children={speakersStr} />
            <Stack spacing={2} sx={{ width: "100%", px: 3 }}>
              {presentation.speakers.map((speaker) => (
                <PresentationSpeakerItem key={speaker.id} speaker={speaker as SimplifiedSpeakerSchema} />
              ))}
            </Stack>
          </>
        )}
      </PageLayout>
    );
  })
);
