import React from "react";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainLayout from "./components/layout";
import { Test } from "./components/pages/test";

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Test />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
