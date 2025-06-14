import { CircularProgress } from "@mui/material";
import { Suspense } from "@suspensive/react";
import * as React from "react";

import ShopHooks from "../../hooks";

export const PriceDisplay: React.FC<{ price: number; label?: string }> = Suspense.with({ fallback: <CircularProgress /> }, ({ price, label }) => {
  const { language } = ShopHooks.useShopContext();
  const priceStr = language === "ko" ? "원" : "KRW";
  return <>{(label ? `${label} : ` : "") + price.toLocaleString() + priceStr}</>;
});
