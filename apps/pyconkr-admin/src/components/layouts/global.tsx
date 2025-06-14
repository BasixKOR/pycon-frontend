import { ChevronLeft, Menu } from "@mui/icons-material";
import {
  Backdrop,
  Box,
  Chip,
  CssBaseline,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  styled,
  SvgIcon,
  Theme,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import * as React from "react";
import { Outlet, useNavigate } from "react-router-dom";

import { MiniVariantAppBar, MiniVariantDrawer } from "./sidebar";

export type RouteDef =
  | {
      type: "routeDefinition";
      key: string; // Unique key for the route
      icon: typeof SvgIcon;
      title: string;
      app: string;
      resource: string;
      route?: string; // If specified, this will be used as the route instead of the default one
      hideOnSidebar?: boolean;
      placeOnBottom?: boolean;
    }
  | {
      type: "separator";
      key: string; // Unique key for the route
      title: string;
    };

type LayoutState = {
  showDrawer: boolean;
};

const PageOuterContainer = styled(Stack)(({ theme }) => ({
  position: "absolute",
  left: theme.spacing(7),
  minHeight: "100%",
  width: `calc(100% - ${theme.spacing(7)} - 1px)`,

  backgroundColor: "#f0f0f0",

  [theme.breakpoints.up("sm")]: {
    left: theme.spacing(8),
    width: `calc(100% - ${theme.spacing(8)} - 1px)`,
  },
}));

const PageInnerContainer = styled(Box)(({ theme }) => ({
  height: "100%",
  minHeight: "100%",
  width: "100%",
  padding: theme.spacing(2),
  flexGrow: 1,
}));

export const Layout: React.FC<{ routes: RouteDef[] }> = ({ routes }) => {
  const navigate = useNavigate();
  const [state, dispatch] = React.useState<LayoutState>({ showDrawer: false });
  const toggleDrawer = () => dispatch((ps) => ({ ...ps, showDrawer: !ps.showDrawer }));

  const SidebarItem: React.FC<{ routeInfo: RouteDef }> = ({ routeInfo }) =>
    routeInfo.type === "separator" ? (
      <ListItem key={routeInfo.title} disablePadding sx={{ minHeight: 48 }}>
        {state.showDrawer ? (
          <ListItemButton disabled>
            <ListItemText primary={routeInfo.title} />
          </ListItemButton>
        ) : (
          <Stack
            alignItems="center"
            sx={(t) => ({
              width: t.spacing(7),
              [t.breakpoints.up("sm")]: { width: t.spacing(8) },
            })}
          >
            <Chip label={routeInfo.title} variant="outlined" size="small" sx={{ flexGrow: 0 }} />
          </Stack>
        )}
      </ListItem>
    ) : (
      <ListItem key={`${routeInfo.app}-${routeInfo.resource}`} sx={routeInfo.placeOnBottom ? { marginTop: "auto" } : {}} disablePadding>
        <ListItemButton
          sx={{
            minHeight: 48,
            px: 2.5,
            justifyContent: state.showDrawer ? "initial" : "center",
          }}
          onClick={() => navigate(routeInfo.route || `/${routeInfo.app}/${routeInfo.resource}`)}
        >
          <ListItemIcon
            sx={{
              minWidth: 0,
              justifyContent: "center",
              mr: state.showDrawer ? 3 : "auto",
            }}
          >
            <routeInfo.icon />
          </ListItemIcon>
          {state.showDrawer && <ListItemText primary={routeInfo.title} />}
        </ListItemButton>
      </ListItem>
    );

  const menuButtonStyle: (t: Theme) => React.CSSProperties = (t) => ({
    width: `calc(${t.spacing(7)} + 1px)`,
    [t.breakpoints.up("sm")]: {
      width: `calc(${t.spacing(8)} + 1px)`,
    },
    display: state.showDrawer ? "none" : "flex",
  });

  return (
    <Box sx={{ width: "100%", height: "100%" }}>
      <CssBaseline />
      <MiniVariantAppBar position="fixed" open={state.showDrawer}>
        <Toolbar sx={{ justifyContent: "flex-start", gap: "1rem" }} disableGutters>
          <Stack justifyContent="center" alignItems="center" sx={menuButtonStyle}>
            <Tooltip title="Menu">
              <IconButton color="inherit" onClick={toggleDrawer}>
                <Menu />
              </IconButton>
            </Tooltip>
          </Stack>
          {state.showDrawer && <>&nbsp;&nbsp;&nbsp;</>}
          <Typography component="div" variant="h6">
            <a
              href="/"
              style={{
                color: "white",
                textDecoration: "none",
                fontWeight: "bolder",
              }}
            >
              PyCon Korea Admin
            </a>
          </Typography>
        </Toolbar>
      </MiniVariantAppBar>

      <Box sx={{ width: "100%", minHeight: "100%" }}>
        <MiniVariantDrawer variant="permanent" open={state.showDrawer}>
          <Stack alignItems="center" justifyContent="center" sx={(t) => t.mixins.toolbar}>
            <IconButton onClick={toggleDrawer}>
              <ChevronLeft />
            </IconButton>
          </Stack>
          <Divider />
          <Stack sx={{ height: "100%" }}>
            {routes
              .filter((r) => r.type === "separator" || !r.hideOnSidebar)
              .map((r) => (
                <SidebarItem key={r.key} routeInfo={r} />
              ))}
          </Stack>
        </MiniVariantDrawer>
        <PageOuterContainer>
          <Toolbar />
          <PageInnerContainer>
            <Outlet />
          </PageInnerContainer>
        </PageOuterContainer>
        <Backdrop open={state.showDrawer} onClick={toggleDrawer} />
      </Box>
    </Box>
  );
};
