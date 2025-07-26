import * as Common from "@frontend/common";
import { Box, Chip, CircularProgress, Divider, Stack, styled, Typography } from "@mui/material";
import { ErrorBoundary, Suspense } from "@suspensive/react";
import * as React from "react";
import { useParams } from "react-router-dom";
import * as R from "remeda";

import BackendAPISchemas from "../../../../../packages/common/src/schemas/backendAPI";
import { useAppContext } from "../../contexts/app_context";
import { PageLayout } from "../layout/PageLayout";

const PageNotFound: React.FC = () => <>404 Not Found</>;
const CenteredLoadingPage: React.FC = () => (
  <Common.Components.CenteredPage>
    <CircularProgress />
  </Common.Components.CenteredPage>
);

const LogoImage = styled("img")(({ theme }) => ({
  maxWidth: "20rem",
  height: "auto",

  padding: theme.spacing(8, 0),
  marginBottom: theme.spacing(4),

  [theme.breakpoints.down("lg")]: {
    padding: theme.spacing(4),
  },
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(2),
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

export const SponsorDetailPage: React.FC = ErrorBoundary.with(
  { fallback: Common.Components.ErrorFallback },
  Suspense.with({ fallback: <CenteredLoadingPage /> }, () => {
    const { id } = useParams();
    const { language, sponsorTiers, setAppContext } = useAppContext();
    const sponsors = sponsorTiers?.reduce((acc, tier) => [...acc, ...tier.sponsors], [] as BackendAPISchemas.SponsorTierSchema["sponsors"]);
    const sponsor = sponsors?.find((s) => s.id === id);

    const title = language === "ko" ? "후원사" : "Sponsor";
    const descriptionFallback = language === "ko" ? "해당 후원사의 설명은 준비 중이에요!" : "This sponsor's description is under preparation!";

    React.useEffect(() => {
      setAppContext((prev) => ({
        ...prev,
        title: `${title} - ${sponsor?.name || "Detail"}`,
        shouldShowTitleBanner: true,
        shouldShowSponsorBanner: !R.isNonNullish(sponsor),
      }));
    }, [sponsor, title, setAppContext]);

    if (!id || !sponsorTiers) return <CenteredLoadingPage />;
    if (!sponsor) return <PageNotFound />;

    return (
      <PageLayout sx={{ maxWidth: "960px" }}>
        <LogoImage src={sponsor.logo} alt={sponsor.name} loading="lazy" />
        <Divider flexItem />
        <Typography variant="h4" fontWeight="700" textAlign="start" sx={{ width: "100%", p: 2 }}>
          {sponsor.name.replace(/\\n/g, "\n")}
          {sponsor.tags.length ? (
            <Stack direction="row" spacing={1} sx={{ width: "100%", mt: 1 }} aria-label="후원사 태그 목록">
              {sponsor.tags.map((tag) => (
                <Chip key={tag} size="small" variant="outlined" color="primary" label={tag} />
              ))}
            </Stack>
          ) : null}
        </Typography>
        <Divider flexItem />
        <DescriptionBox>
          <Common.Components.MDXRenderer text={sponsor.description || descriptionFallback} format="md" />
        </DescriptionBox>
      </PageLayout>
    );
  })
);
