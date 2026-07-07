import { OpenInNew } from "@mui/icons-material";
import { styled, Theme } from "@mui/material";
import { FC, PropsWithChildren } from "react";
import { Link } from "react-router-dom";

const EXTERNAL_PROTOCOLS = ["http://", "https://", "mailto:", "tel:"];

const baseLinkStyle = (theme: Theme) => ({
  color: theme.palette.primary.main,
  fontWeight: 600,
  textDecoration: "underline",
  textDecorationThickness: "1px",
  textUnderlineOffset: "0.2em",
  textDecorationColor: theme.palette.primary.main,
  transition: "color 0.15s ease, text-decoration-color 0.15s ease",
  "&:hover": {
    color: theme.palette.primary.light,
    textDecorationColor: theme.palette.primary.light,
  },
});

const StyledExternalLink = styled("a")(({ theme }) => baseLinkStyle(theme));

const StyledInternalLink = styled(Link)(({ theme }) => baseLinkStyle(theme));

const ExternalLinkIcon = styled(OpenInNew)({
  fontSize: "0.85em",
  verticalAlign: "-0.12em",
  marginLeft: "0.15em",
});

export const MDXLink: FC<PropsWithChildren<{ href?: string }>> = ({ href, children, ...props }) => {
  if (href && EXTERNAL_PROTOCOLS.some((protocol) => href.startsWith(protocol)))
    return (
      <StyledExternalLink href={href} target="_blank" rel="noopener noreferrer" {...props}>
        {children}
        <ExternalLinkIcon />
      </StyledExternalLink>
    );

  return (
    <StyledInternalLink to={href ?? ""} {...props}>
      {children}
    </StyledInternalLink>
  );
};
