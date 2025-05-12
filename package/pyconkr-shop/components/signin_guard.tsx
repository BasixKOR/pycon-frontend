import React from 'react';

import { Typography } from '@mui/material';

import ShopAPIHook from '@pyconkr-shop/hooks';

export const ShopSignInGuard: React.FC<{ children: React.ReactNode, fallback?: React.ReactNode }> = ({ children, fallback }) => {
  const { data } = ShopAPIHook.useUserStatus();
  const renderedFallback = fallback || <Typography variant="h6" gutterBottom>로그인 후 이용해주세요.</Typography>;
  return (data && data.meta.is_authenticated === true) ? children : renderedFallback;
};
