import * as Shop from "@frontend/shop";
import { ShoppingCart } from "@mui/icons-material";
import { Badge, badgeClasses, IconButton, styled } from "@mui/material";
import { ErrorBoundary, Suspense } from "@suspensive/react";
import * as React from "react";
import { useNavigate } from "react-router-dom";

type InnerCartBadgeButtonPropType = {
  loading?: boolean;
  count?: number;
};

const InnerCartBadge = styled(Badge)({ [`& .${badgeClasses.badge}`]: { top: "-12px", right: "-3px" } });

const InnerCartBadgeButton: React.FC<InnerCartBadgeButtonPropType> = ({ loading, count }) => {
  const navigate = useNavigate();

  return (
    <IconButton loading={loading} onClick={() => navigate("/store/cart")}>
      <ShoppingCart />
      {count !== undefined && count > 0 && <InnerCartBadge badgeContent={count} color="primary" overlap="circular" />}
    </IconButton>
  );
};

export const CartBadgeButton: React.FC = Suspense.with(
  { fallback: <InnerCartBadgeButton loading /> },
  ErrorBoundary.with({ fallback: <InnerCartBadgeButton /> }, () => {
    const shopAPIClient = Shop.Hooks.useShopClient();
    const { data: cart } = Shop.Hooks.useCart(shopAPIClient);
    return <InnerCartBadgeButton count={cart?.products.length} loading={false} />;
  })
);
