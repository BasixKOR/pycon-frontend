import * as Common from "@frontend/common";
import React from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { SponsorProvider } from "./contexts/SponsorContext";

import MainLayout from "./components/layout";
import { Test } from "./components/pages/test";
import { IS_DEBUG_ENV } from "./consts/index.ts";

// 스폰서를 표시할 페이지 경로 설정
const SPONSOR_VISIBLE_PATHS = ["/"];

const AppContent = () => {
  const location = useLocation();
  const shouldShowSponsor = SPONSOR_VISIBLE_PATHS.includes(location.pathname);

  return (
    <SponsorProvider initialVisibility={shouldShowSponsor}>
      <Routes>
        <Route element={<MainLayout />}>
          {IS_DEBUG_ENV && <Route path="/debug" element={<Test />} />}
          <Route
            path="/pages/:id"
            element={<Common.Components.PageIdParamRenderer />}
          />
          <Route path="*" element={<Common.Components.RouteRenderer />} />
        </Route>
      </Routes>
    </SponsorProvider>
  );
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
};
