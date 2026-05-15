import { ExpandMore } from "@mui/icons-material";
import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionProps,
  AccordionSummary,
  PaletteColor,
  styled,
  SxProps,
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
  const StyledAccordion = styled(Accordion)(({ theme }) => ({
    width: "100%",
    paddingRight: theme.spacing(1),
    paddingLeft: theme.spacing(1),
    border: `1px solid ${paletteColor.dark}`,
    borderRadius: "0.5rem",
    fontWeight: 500,
  }));

  const StyledAccordionSummary = styled(AccordionSummary)(() => ({
    color: paletteColor.dark,
  }));

  const rootSx: SxProps = {
    transition: "background-color 0.3s ease",
    "&.Mui-expanded": {
      backgroundColor: `color-mix(in srgb, ${paletteColor.light} ${transparencyOnExpand || 10}%, transparent)`,
    },
  };

  const DefaultExpandIcon = styled(ExpandMore)(({ theme }) => ({
    color: paletteColor.dark,
    fontSize: theme.typography.h4.fontSize,
  }));

  return (
    <StyledAccordion {...props} disableGutters square elevation={0} slotProps={{ root: { sx: rootSx } }}>
      <StyledAccordionSummary expandIcon={expandIcon || <DefaultExpandIcon />}>
        {typeof summary === "string" ? <Typography variant="h5">{summary}</Typography> : summary}
      </StyledAccordionSummary>
      <AccordionDetails sx={{ pt: "0", pb: "1rem", px: "2rem" }}>{children}</AccordionDetails>
      {actions && <AccordionActions sx={{ pt: "0", pb: "1rem", px: "2rem" }}>{actions}</AccordionActions>}
    </StyledAccordion>
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
