import { Box } from "@mui/material";
import { FC, PropsWithChildren } from "react";
export const SubContentContainer: FC<PropsWithChildren> = ({ children }) => (
  <Box sx={(theme) => ({ px: theme.spacing(2), py: theme.spacing(4) })}>{children}</Box>
);
