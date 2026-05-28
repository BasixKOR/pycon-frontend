import { useShopClient, useSignOutMutation, useUserStatus } from "@frontend/shop/hooks";
import { UserSignedInStatus } from "@frontend/shop/schemas";
import { AccountCircle, Login, Logout, Receipt } from "@mui/icons-material";
import { Divider, IconButton, ListItemIcon, ListItemText, Menu, MenuItem, styled, Typography } from "@mui/material";
import { ErrorBoundary, Suspense } from "@suspensive/react";
import { FC, MouseEvent, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAppContext } from "@apps/pyconkr-2026/contexts/app_context";

const ColoredIconButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.primary.nonFocus,
  "&:hover": { color: theme.palette.primary.dark },
  "&:active": { color: theme.palette.primary.main },
  transition: "color 0.4s ease, background-color 0.4s ease",
}));

type InnerUserMenuButtonPropType = {
  loading?: boolean;
  user?: UserSignedInStatus["data"]["user"];
  onSignOut?: () => void;
};

const InnerUserMenuButton: FC<InnerUserMenuButtonPropType> = ({ loading, user, onSignOut }) => {
  const navigate = useNavigate();
  const { language } = useAppContext();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);

  const handleOpen = (event: MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const signInLabel = language === "ko" ? "로그인" : "Sign In";
  const orderHistoryLabel = language === "ko" ? "결제 내역" : "Order History";
  const signOutLabel = language === "ko" ? "로그아웃" : "Sign Out";

  const goTo = (path: string) => {
    handleClose();
    navigate(path);
  };

  const handleSignOut = () => {
    handleClose();
    onSignOut?.();
  };

  return (
    <>
      <ColoredIconButton
        loading={loading}
        onClick={handleOpen}
        aria-controls={open ? "user-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
      >
        <AccountCircle />
      </ColoredIconButton>
      <Menu
        id="user-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{ paper: { sx: { minWidth: 180, mt: 0.5 } } }}
      >
        {user ? (
          [
            <UserNameItem key="username" disabled>
              <Typography variant="body2" sx={{ fontWeight: 600, color: (theme) => theme.palette.text.primary }}>
                {user.display || user.email}
              </Typography>
            </UserNameItem>,
            <Divider key="divider" sx={{ my: 0.5 }} />,
            <MenuItem key="orders" onClick={() => goTo("/store/orders")}>
              <ListItemIcon>
                <Receipt fontSize="small" />
              </ListItemIcon>
              <ListItemText>{orderHistoryLabel}</ListItemText>
            </MenuItem>,
            <MenuItem key="signout" onClick={handleSignOut}>
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              <ListItemText>{signOutLabel}</ListItemText>
            </MenuItem>,
          ]
        ) : (
          <MenuItem onClick={() => goTo("/account/sign-in")}>
            <ListItemIcon>
              <Login fontSize="small" />
            </ListItemIcon>
            <ListItemText>{signInLabel}</ListItemText>
          </MenuItem>
        )}
      </Menu>
    </>
  );
};

const UserMenuButtonContent: FC = () => {
  const shopAPIClient = useShopClient();
  const signOutMutation = useSignOutMutation(shopAPIClient);
  const { data } = useUserStatus(shopAPIClient);

  return <InnerUserMenuButton user={data?.data.user} onSignOut={signOutMutation.mutate} />;
};

export const UserMenuButton: FC = () => (
  <ErrorBoundary fallback={<InnerUserMenuButton />}>
    <Suspense fallback={<InnerUserMenuButton loading />}>
      <UserMenuButtonContent />
    </Suspense>
  </ErrorBoundary>
);

const UserNameItem = styled(MenuItem)(({ theme }) => ({
  opacity: 1,
  "&.Mui-disabled": { opacity: 1 },
  pointerEvents: "none",
  paddingTop: theme.spacing(1),
  paddingBottom: theme.spacing(1),
}));
