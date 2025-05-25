import * as React from "react";

import { Button, Stack } from "@mui/material";

import { BackendTestPage } from '../../debug/page/backend_test';
import { MdiTestPage } from "../../debug/page/mdi_test";
import { ShopTestPage } from "../../debug/page/shop_test";

const LOCAL_STORAGE_KEY = "selectedTab";
type SelectedTabType = "shop" | "mdi" | "backend";

const getTabFromLocalStorage = (): SelectedTabType => localStorage.getItem(LOCAL_STORAGE_KEY) as SelectedTabType || "shop";

const setTabToLocalStorage = (tab: SelectedTabType) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, tab);
  return tab;
};

const TabList: { [key in SelectedTabType]: React.ReactNode } = {
  shop: <ShopTestPage />,
  mdi: <MdiTestPage />,
  backend: <BackendTestPage />,
};

export const Test: React.FC = () => {
  const [selectedTab, setSelectedTab] = React.useState<SelectedTabType>(getTabFromLocalStorage());
  const selectTab = (tab: SelectedTabType) => setSelectedTab(setTabToLocalStorage(tab));
  const TabButton: React.FC<{ tab: SelectedTabType }> = ({ tab }) => <Button variant={selectedTab === tab ? "contained" : "outlined"} onClick={() => selectTab(tab)}>{tab} Test</Button>;

  return <Stack>
    <Stack direction="row" spacing={2} sx={{ width: "100%", justifyContent: "center" }}>
      {Object.keys(TabList).map((tab) => <TabButton key={tab} tab={tab as SelectedTabType} />)}
    </Stack>
    {TabList[selectedTab]}
  </Stack>;
};
