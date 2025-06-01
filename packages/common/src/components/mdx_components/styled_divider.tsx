import { Divider, DividerProps, useTheme } from "@mui/material";
import * as React from "react";

export const StyledDivider: React.FC<DividerProps> = (props) => {
  const { palette } = useTheme();
  const sx = { borderColor: palette.primary.dark, ...props.sx };
  const newProps = { ...props, sx };
  return <Divider {...newProps} />;
};
