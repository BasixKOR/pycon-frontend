import { Badge, CircularProgress, Divider, Stack, Tooltip, Typography, TypographyProps, styled } from "@mui/material";
import { ErrorBoundary, Suspense } from "@suspensive/react";
import { Link } from "react-router-dom";

import { useAppContext } from "../../../contexts/app_context";

const LogoHeight: React.CSSProperties["height"] = "8rem";
const LogoWidth: React.CSSProperties["width"] = "15rem";
const LogoContainerHeight: React.CSSProperties["height"] = `calc(${LogoHeight} + 2rem)`;
const LogoContainerWidth: React.CSSProperties["width"] = `calc(${LogoWidth} + 4rem)`;

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
  gap: "4rem",
});

const LogoImageEqualWidthContainer = styled(Stack)(({ theme }) => ({
  position: "relative",
  alignItems: "center",
  justifyContent: "center",
  alignContent: "stretch",
  height: LogoContainerHeight,
  maxHeight: LogoContainerHeight,
  minWidth: LogoContainerWidth,
  maxWidth: LogoContainerWidth,
  border: `1px solid ${theme.palette.primary.light}`,
  borderRadius: "0.5rem",

  transition: "all 0.3s ease-in-out",

  "&:hover": {
    borderColor: theme.palette.primary.dark,
    boxShadow: theme.shadows[3],
  },
}));

const LogoImageContainer = styled(Stack)({
  width: "auto",
  height: "auto",
  minHeight: LogoHeight,
  maxWidth: LogoWidth,
  maxHeight: LogoHeight,
  objectFit: "contain",
  alignItems: "center",
  justifyContent: "center",
  margin: "4rem 8rem",
});

const LogoImage = styled("img")({
  width: "auto",
  height: "auto",
  minHeight: LogoHeight,
  maxWidth: LogoWidth,
  maxHeight: LogoHeight,
  objectFit: "contain",
});

const LogoBadgeContainer = styled(Stack)({
  position: "absolute",
  width: "auto",
  height: "auto",
  top: "0.5rem",
  right: "-0.5rem",
  flexDirection: "column",
  alignItems: "flex-end",
  justifyContent: "center",
  gap: "0.25rem",
});

const LogoBadge = styled(Badge)(({ theme }) => ({
  alignItems: "flex-end",

  "& .MuiBadge-badge": {
    position: "relative",
    borderRadius: "0.25rem",
    padding: "0 0.5rem",
    backgroundColor: theme.palette.primary.main,
    color: "white",
    borderEndEndRadius: "0",
    transform: "none",

    "&:after": {
      content: '""',
      position: "absolute",
      bottom: "-8px",
      right: "-0.1px",
      width: 0,
      height: 0,
      border: "solid 4px",
      borderColor: `${theme.palette.primary.dark} transparent transparent ${theme.palette.primary.dark}`,
    },
  },
}));

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
    const { sponsorTiers, language } = useAppContext();
    if (!sponsorTiers) return <CircularProgress />;

    const textProps: TypographyProps = {
      textAlign: "center",
      fontWeight: "bold",
    };

    const titleStr = language === "ko" ? "후원사 목록" : "Sponsor List";

    return (
      <SponsorContainer>
        <SponsorSection aria-label="후원사 섹션">
          <Typography variant="h4" {...textProps} children={titleStr} area-level={4} />
          <Stack spacing={4} sx={{ my: 4 }} aria-label="후원사 목록 그리드">
            {sponsorTiers
              .filter((t) => t.sponsors.length)
              .map((sponsorTier, i, a) => (
                <Stack spacing={6} key={sponsorTier.id} aria-label={`후원사 티어: ${sponsorTier.name}`}>
                  <Typography variant="h5" key={sponsorTier.id} {...textProps} children={sponsorTier.name} area-level={5} />
                  <SponsorStack>
                    {sponsorTier.sponsors.map((sponsor) => {
                      const sponsorName = sponsor.name.replace(/\\n/g, "\n");
                      const sponsorNameContent = <Typography variant="body1" {...textProps} children={sponsorName} sx={{ whiteSpace: "pre-wrap" }} />;
                      return (
                        <Link to={`/sponsors/${sponsor.id}`} key={sponsor.id} style={{ textDecoration: "none" }}>
                          <Tooltip title={sponsorNameContent} arrow placement="top">
                            <LogoImageEqualWidthContainer>
                              <LogoBadgeContainer>
                                {sponsor.tags.map((tag, i) => (
                                  <LogoBadge key={i} badgeContent={tag} />
                                ))}
                              </LogoBadgeContainer>
                              <LogoImageContainer>
                                <LogoImage src={sponsor.logo} alt={sponsor.name} loading="lazy" />
                              </LogoImageContainer>
                            </LogoImageEqualWidthContainer>
                          </Tooltip>
                        </Link>
                      );
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
