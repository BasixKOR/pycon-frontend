import { CircularProgress } from "@mui/material";
import { Suspense } from "@suspensive/react";
import * as React from "react";

import { useShopContext } from "../../hooks";

export const PriceDisplay: React.FC<{ price: number; label?: string }> = Suspense.with({ fallback: <CircularProgress /> }, ({ price, label }) => {
  const { language } = useShopContext();
  const priceStr = language === "ko" ? "원" : "KRW";
  return <>{(label ? `${label} : ` : "") + price.toLocaleString() + priceStr}</>;
});
