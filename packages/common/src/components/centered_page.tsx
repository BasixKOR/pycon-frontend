import { Stack } from "@mui/material";
import * as React from "react";

export const CenteredPage: React.FC<React.PropsWithChildren> = ({ children }) => (
  <Stack
    justifyContent="center"
    alignItems="center"
    sx={{
      width: "100%",
      height: "100%",
      minHeight: "100%",
      maxHeight: "100%",
      flexGrow: 1,
      py: 2,
    }}
  >
    {children}
  </Stack>
);
