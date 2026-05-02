import * as Shop from "@frontend/shop";
import { Divider, Stack, Typography } from "@mui/material";
import React from "react";

export const ShopTestPage: React.FC = () => (
  <Stack>
    <Stack spacing={2} sx={{ px: 4, py: 2 }}>
      <Typography variant="h4" gutterBottom>
        Shop Test Page
      </Typography>
      <Typography variant="h5" gutterBottom>
        계정 상태
      </Typography>
      <Shop.Components.Features.UserInfo />
      <Divider />
      <Typography variant="h5" gutterBottom>
        상품 목록
      </Typography>
      <Shop.Components.Features.ProductList category_group="2025" category="티켓" />
      <Typography variant="h5" gutterBottom>
        상품 목록 (이미지 카드)
      </Typography>
      <Shop.Components.Features.ProductImageCardList category_group="2025" category="티셔츠" />
      <Divider />
      <Typography variant="h5" gutterBottom>
        장바구니
      </Typography>
      <Shop.Components.Features.CartStatus />
      <Divider />
      <Typography variant="h5" gutterBottom>
        주문 내역
      </Typography>
      <Shop.Components.Features.OrderList />
    </Stack>
  </Stack>
);
