import { Stack, styled } from "@mui/material";
import * as React from "react";

const StyledFieldset = styled("fieldset")(({ theme }) => ({
  margin: 0,
  padding: theme.spacing(1, 2, 2),
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  minWidth: 0,
  width: "fit-content",
  maxWidth: "100%",
}));

const StyledLegend = styled("legend")(({ theme }) => ({
  padding: theme.spacing(0, 1),
  color: theme.palette.text.secondary,
  ...theme.typography.caption,
}));

type Props = {
  label: string;
  children: React.ReactNode;
};

export const AdminFilterFieldset: React.FC<Props> = ({ label, children }) => (
  <StyledFieldset>
    <StyledLegend>{label}</StyledLegend>
    <Stack direction="row" spacing={2} flexWrap="wrap" alignItems="center" sx={{ rowGap: 2 }}>
      {children}
    </Stack>
  </StyledFieldset>
);
