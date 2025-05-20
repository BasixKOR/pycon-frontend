import * as React from "react";

import { Box, Button } from "@mui/material";

import { BackendTestPage } from '../../debug/page/backend_test';
import { MdiTestPage } from "../../debug/page/mdi_test";
import { ShopTestPage } from "../../debug/page/shop_test";

type SelectedTabType = "shop" | "mdi" | "backend";

export const Test: React.FC = () => {
  const [selectedTab, setSelectedTab] = React.useState<SelectedTabType>("mdi");

  return (
    <Box>
      <Button variant="contained" onClick={() => setSelectedTab("shop")}>
        Shop Test
      </Button>
      <Button variant="contained" onClick={() => setSelectedTab("mdi")}>
        MDI Test
      </Button>
      <Button variant="contained" onClick={() => setSelectedTab("backend")}>
        Backend Test
      </Button>
      {selectedTab === "shop" && <ShopTestPage />}
      {selectedTab === "mdi" && <MdiTestPage />}
      {selectedTab === "backend" && <BackendTestPage />}
    </Box>
  );
};
