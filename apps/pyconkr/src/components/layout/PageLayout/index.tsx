import { Stack, styled } from "@mui/material";

export const PageLayout = styled(Stack)(({ theme }) => ({
  height: "75%",
  width: "100%",
  maxWidth: "1200px",

  justifyContent: "flex-start",
  alignItems: "center",

  paddingTop: theme.spacing(8),
  paddingBottom: theme.spacing(8),

  paddingRight: theme.spacing(16),
  paddingLeft: theme.spacing(16),

  [theme.breakpoints.down("lg")]: {
    padding: theme.spacing(4),
  },
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(2),
  },
}));
