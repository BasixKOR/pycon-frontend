import { Stack } from "@mui/material";
import { FC, PropsWithChildren } from "react";
export const CenteredPage: FC<PropsWithChildren> = ({ children }) => (
  <Stack justifyContent="center" alignItems="center" sx={{ minHeight: "80vh", maxHeight: "100%" }}>
    {children}
  </Stack>
);
