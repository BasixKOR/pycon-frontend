import React from 'react';

import { Box, Button } from '@mui/material';
import { MdiTestPage } from "@src/debug/page/mdi_test";
import { ShopTestPage } from '@src/debug/page/shop_test';

type SelectedTabType = "shop" | "mdi";

export const Test: React.FC = () => {
  const [selectedTab, setSelectedTab] = React.useState<SelectedTabType>("shop");

  return <Box>
    <Button variant="contained" onClick={() => setSelectedTab("shop")}>Shop Test</Button>
    <Button variant="contained" onClick={() => setSelectedTab("mdi")}>MDI Test</Button>
    {selectedTab === "shop" && <ShopTestPage />}
    {selectedTab === "mdi" && <MdiTestPage />}
  </Box>
}
