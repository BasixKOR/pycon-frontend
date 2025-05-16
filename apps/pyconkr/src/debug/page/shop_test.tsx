import React from "react";

import { Divider, Stack, Typography } from "@mui/material";

import { ShopCartList } from "./shop_component/cart";
import { ShopOrderList } from "./shop_component/order";
import { ShopProductList } from "./shop_component/product";
import { ShopUserStatus } from "./shop_component/user_status";

export const ShopTestPage: React.FC = () => (
  <Stack>
    <Stack spacing={2} sx={{ px: 4, backgroundColor: "#ddd", py: 2 }}>
      <Typography variant="h4" gutterBottom>
        Shop Test Page
      </Typography>
      <ShopUserStatus />
      <Divider />
      <ShopProductList />
      <Divider />
      <ShopCartList />
      <Divider />
      <ShopOrderList />
    </Stack>
  </Stack>
);
