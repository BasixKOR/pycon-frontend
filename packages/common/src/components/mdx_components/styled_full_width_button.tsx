import { Button, ButtonProps, Typography } from "@mui/material";
import * as React from "react";
import * as R from "remeda";

import { LinkHandler } from "../link_handler";

type StyledFullWidthButtonPropType = ButtonProps & {
  link?: string;
  setBackgroundColor?: boolean;
  transparency: number;
};

export const StyledFullWidthButton: React.FC<StyledFullWidthButtonPropType> = ({
  link,
  setBackgroundColor,
  transparency,
  ...props
}) => {
  let children = props.children;
  if (React.isValidElement(children) && R.isString((children.props as { children: unknown }).children))
    children = (children.props as { children: unknown }).children as string;
  if (children) children = <Typography variant="h5" fontSize="1.5rem" children={children} />;

  const button = (
    <Button
      fullWidth
      variant="outlined"
      sx={({ palette }) => ({
        borderRadius: "0.5rem",
        textTransform: "none",
        color: palette.primary.dark,
        borderColor: palette.primary.dark,
        backgroundColor: setBackgroundColor
          ? `color-mix(in srgb, ${palette.primary.light} ${transparency || 10}%, transparent)`
          : "transparent",
        "&:hover": {
          backgroundColor: setBackgroundColor
            ? `color-mix(in srgb, ${palette.primary.light} ${transparency || 20}%, transparent)`
            : `color-mix(in srgb, ${palette.primary.light} ${transparency || 10}%, transparent)`,
        },
        "&.MuiButton-sizeLarge": { height: "3.5rem" },
      })}
      {...props}
      children={children}
    />
  );

  return link ? <LinkHandler href={link} children={button} /> : button;
};
