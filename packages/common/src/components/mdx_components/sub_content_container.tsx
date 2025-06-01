import { Box } from "@mui/material";
import * as React from "react";

export const SubContentContainer: React.FC<React.PropsWithChildren> = ({ children }) => (
  <Box sx={(theme) => ({ px: theme.spacing(2), py: theme.spacing(4) })}>{children}</Box>
);
