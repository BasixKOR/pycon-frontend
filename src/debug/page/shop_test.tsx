import React from "react";

import { Divider, Stack, Typography } from "@mui/material";

import { ShopCartList } from '@src/debug/page/shop_component/cart';
import { ShopOrderList } from "@src/debug/page/shop_component/order";
import { ShopProductList } from "@src/debug/page/shop_component/product";
import { ShopUserStatus } from "@src/debug/page/shop_component/user_status";

export const ShopTestPage: React.FC = () => <Stack>
  <Stack spacing={2} sx={{ px: 4, backgroundColor: "#ddd", py: 2 }}>
    <Typography variant="h4" gutterBottom>Shop Test Page</Typography>
    <ShopUserStatus />
    <Divider />
    <ShopProductList />
    <Divider />
    <ShopCartList />
    <Divider />
    <ShopOrderList />
  </Stack>
</Stack>
