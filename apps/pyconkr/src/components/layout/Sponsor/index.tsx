import * as Common from "@frontend/common";
import { CircularProgress, Divider, Stack, Tooltip, Typography, TypographyProps, styled } from "@mui/material";
import { ErrorBoundary, Suspense } from "@suspensive/react";
import { Link } from "react-router-dom";

import { useAppContext } from "../../../contexts/app_context";

const LogoHeight: React.CSSProperties["height"] = "8rem";
const LogoWidth: React.CSSProperties["width"] = "15rem";

const SponsorContainer = styled(Stack)({
  width: "100%",
  alignItems: "center",
  justifyContent: "center",
});

const SponsorSection = styled(Stack)({
  margin: "8rem 8rem 4rem 8rem",
  width: "100%",
  maxWidth: "1300px",
});

const SponsorStack = styled(Stack)({
  flexDirection: "row",
  flexWrap: "wrap",
  justifyContent: "center",
  alignItems: "center",
  padding: "0 1rem",
  gap: "2rem",
});

const LogoImageContainer = styled(Stack)({
  alignItems: "center",
  justifyContent: "center",
  alignContent: "stretch",
  height: LogoHeight,
  maxHeight: LogoHeight,
  maxWidth: LogoWidth,
});

const LogoImage = styled("img")({
  height: `calc(${LogoHeight} * 0.9)`, // 90% of LogoHeight
  minHeight: LogoHeight,
  minWidth: `calc(${LogoWidth} * 0.9)`, // 80% of LogoWidth
  maxWidth: "100%",
  maxHeight: "100%",
  objectFit: "contain",
});

export const Sponsor: React.FC = ErrorBoundary.with(
  {
    fallback: (
      <Typography variant="h6" color="error">
        후원사 정보를 불러오는 중 문제가 발생했습니다,
        <br />
        잠시 후 다시 시도해 주세요.
      </Typography>
    ),
  },
  Suspense.with({ fallback: <CircularProgress /> }, () => {
    const { siteMapNode } = useAppContext();
    const backendAPIClient = Common.Hooks.BackendAPI.useBackendClient();
    const { data: sponsorData } = Common.Hooks.BackendAPI.useSponsorQuery(backendAPIClient);

    if (!siteMapNode) return <CircularProgress />;

    const flatSiteMap = Common.Utils.buildFlatSiteMap(siteMapNode);
    const flatSiteMapObj = flatSiteMap.reduce((a, i) => ({ ...a, [i.id]: i }), {} as Record<string, { route: string }>);

    const textProps: TypographyProps = {
      textAlign: "center",
      fontWeight: "bold",
    };

    return (
      <SponsorContainer>
        <SponsorSection aria-label="후원사 섹션">
          <Typography variant="h4" {...textProps} children="후원사 목록" area-level={4} />
          <Stack spacing={4} sx={{ my: 4 }} aria-label="후원사 목록 그리드">
            {sponsorData
              .filter((t) => t.sponsors.length)
              .map((sponsorTier, i, a) => (
                <Stack spacing={6} key={sponsorTier.id} aria-label={`후원사 티어: ${sponsorTier.name}`}>
                  <Typography variant="h5" key={sponsorTier.id} {...textProps} children={sponsorTier.name} area-level={5} />
                  <SponsorStack>
                    {sponsorTier.sponsors.map((sponsor) => {
                      const sponsorName = sponsor.name.replace(/\\n/g, "\n");
                      const sponsorNameContent = <Typography variant="body1" {...textProps} children={sponsorName} sx={{ whiteSpace: "pre-wrap" }} />;
                      const sponsorImg = (
                        <LogoImageContainer>
                          <Tooltip title={sponsorNameContent} arrow placement="top">
                            <LogoImage src={sponsor.logo} alt={sponsor.name} loading="lazy" />
                          </Tooltip>
                        </LogoImageContainer>
                      );
                      return sponsor.sitemap_id ? <Link to={flatSiteMapObj[sponsor.sitemap_id].route} children={sponsorImg} /> : sponsorImg;
                    })}
                  </SponsorStack>
                  {i !== a.length - 1 && <Divider sx={{ m: "2rem" }} />}
                </Stack>
              ))}
          </Stack>
        </SponsorSection>
      </SponsorContainer>
    );
  })
);
