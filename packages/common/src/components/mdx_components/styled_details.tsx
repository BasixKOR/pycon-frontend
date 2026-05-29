import { ExpandMore } from "@mui/icons-material";
import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionProps,
  AccordionSummary,
  PaletteColor,
  SxProps,
  Theme,
  Typography,
  useTheme,
} from "@mui/material";
import { FC, PropsWithChildren, ReactNode } from "react";
type StyledDetailsProps = PropsWithChildren<
  AccordionProps & {
    expandIcon?: ReactNode;
    summary?: ReactNode;
    actions?: ReactNode;
  }
>;

type BaseStyledDetailsProps = StyledDetailsProps & {
  paletteColor: PaletteColor;
  transparencyOnExpand?: number;
};

const BaseStyledDetails: FC<BaseStyledDetailsProps> = ({ expandIcon, summary, children, actions, paletteColor, transparencyOnExpand, ...props }) => {
  const rootSx: SxProps<Theme> = (theme) => ({
    width: "100%",
    paddingRight: theme.spacing(1),
    paddingLeft: theme.spacing(1),
    border: `1px solid ${paletteColor.dark}`,
    borderRadius: "0.5rem",
    fontWeight: 500,
    transition: "background-color 0.3s ease",
    "&.Mui-expanded": {
      backgroundColor: `color-mix(in srgb, ${paletteColor.light} ${transparencyOnExpand || 10}%, transparent)`,
    },
  });

  const summarySx: SxProps<Theme> = { color: paletteColor.dark };

  const expandIconSx: SxProps<Theme> = (theme) => ({
    color: paletteColor.dark,
    fontSize: theme.typography.h4.fontSize,
  });

  return (
    <Accordion {...props} disableGutters square elevation={0} sx={rootSx}>
      <AccordionSummary expandIcon={expandIcon || <ExpandMore sx={expandIconSx} />} sx={summarySx}>
        {typeof summary === "string" ? <Typography variant="h5">{summary}</Typography> : summary}
      </AccordionSummary>
      <AccordionDetails sx={{ pt: "0", pb: "1rem", px: "2rem" }}>{children}</AccordionDetails>
      {actions && <AccordionActions sx={{ pt: "0", pb: "1rem", px: "2rem" }}>{actions}</AccordionActions>}
    </Accordion>
  );
};

export const PrimaryStyledDetails: FC<StyledDetailsProps> = (props) => {
  const { palette } = useTheme();
  return <BaseStyledDetails {...props} paletteColor={palette.primary} transparencyOnExpand={20} />;
};

export const HighlightedStyledDetails: FC<StyledDetailsProps> = (props) => {
  const { palette } = useTheme();
  return <BaseStyledDetails {...props} paletteColor={palette.highlight} transparencyOnExpand={10} />;
};
