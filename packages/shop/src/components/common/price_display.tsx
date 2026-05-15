import { CircularProgress } from "@mui/material";
import { Suspense } from "@suspensive/react";
import { FC } from "react";

import { useShopContext } from "@frontend/shop/hooks";

export const PriceDisplay: FC<{ price: number; label?: string }> = Suspense.with({ fallback: <CircularProgress /> }, ({ price, label }) => {
  const { language } = useShopContext();
  const priceStr = language === "ko" ? "원" : "KRW";
  return <>{(label ? `${label} : ` : "") + price.toLocaleString() + priceStr}</>;
});
