import React from "react";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainLayout from "./components/layout";
import { Test } from "./components/pages/test";
import { IS_DEBUG_ENV } from "./consts/index.ts";

import * as Common from "@frontend/common";

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          { IS_DEBUG_ENV && <Route path="/debug" element={<Test />} /> }
          <Route path="*" element={<Common.Components.DynamicRoutePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
