import { CircularProgress, Stack, Typography } from "@mui/material";
import { ErrorBoundary, Suspense } from "@suspensive/react";
import * as React from "react";

import ShopHooks from "../../hooks";

const InnerPatronList: React.FC<{ year: number }> = ErrorBoundary.with(
  { fallback: <>개인후원자 목록을 불러오는 중 문제가 발생했습니다.</> },
  Suspense.with({ fallback: <CircularProgress /> }, ({ year }) => {
    const shopAPIClient = ShopHooks.useShopClient();
    const { data } = ShopHooks.usePatrons(shopAPIClient, year);
    return data.map((patron) => (
      <Stack key={patron.name} spacing={1} sx={{ my: 2 }}>
        <Typography variant="h6" fontWeight="700" children={patron.name} />
        {patron.contribution_message && <Typography variant="subtitle1" children={patron.contribution_message} />}
      </Stack>
    ));
  })
);

export const PatronList: React.FC<{ year: number }> = ({ year }) => <Stack children={<InnerPatronList year={year} />} />;
