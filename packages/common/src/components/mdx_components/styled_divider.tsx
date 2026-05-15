import { Divider, DividerProps, useTheme } from "@mui/material";
import { FC } from "react";
export const StyledDivider: FC<DividerProps> = (props) => {
  const { palette } = useTheme();
  const sx = { borderColor: palette.primary.dark, ...props.sx };
  const newProps = { ...props, sx };
  return <Divider {...newProps} />;
};
