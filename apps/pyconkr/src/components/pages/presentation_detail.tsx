import * as Common from "@frontend/common";
import { Box, Chip, CircularProgress, Divider, Stack, styled, Typography } from "@mui/material";
import { ErrorBoundary, Suspense } from "@suspensive/react";
import * as React from "react";
import { Navigate, useParams } from "react-router-dom";

import { useAppContext } from "../../contexts/app_context";
import { PageLayout } from "../layout/PageLayout";

const CenteredLoadingPage: React.FC = () => (
  <Common.Components.CenteredPage>
    <CircularProgress />
  </Common.Components.CenteredPage>
);

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
  },
}));

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

    React.useEffect(() => {
      setAppContext((prev) => ({
        ...prev,
        title: language === "ko" ? "발표 상세" : "Presentation Detail",
        shouldShowTitleBanner: true,
        shouldShowSponsorBanner: true,
      }));
    }, [language, presentation, setAppContext]);

    return (
      <PageLayout sx={{ maxWidth: "960px" }}>
        <Typography variant="h4" fontWeight="700" textAlign="start" sx={{ width: "100%", p: 2 }}>
          {presentation.title}
        </Typography>
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
        <DescriptionBox>
          <Common.Components.MDXRenderer text={presentation.description || descriptionFallback} format="md" />
        </DescriptionBox>
      </PageLayout>
    );
  })
);
