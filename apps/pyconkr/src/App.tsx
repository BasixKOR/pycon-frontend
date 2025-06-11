import * as Common from "@frontend/common";
import * as React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import * as R from "remeda";

import MainLayout from "./components/layout/index.tsx";
import { PageIdParamRenderer, RouteRenderer } from "./components/pages/dynamic_route.tsx";
import { ShopSignInPage } from "./components/pages/sign_in.tsx";
import { Test } from "./components/pages/test.tsx";
import { IS_DEBUG_ENV } from "./consts";
import { useAppContext } from "./contexts/app_context";
import BackendAPISchemas from "../../../packages/common/src/schemas/backendAPI";

export const App: React.FC = () => {
  const backendAPIClient = Common.Hooks.BackendAPI.useBackendClient();
  const { data: flatSiteMap } = Common.Hooks.BackendAPI.useFlattenSiteMapQuery(backendAPIClient);
  const siteMapNode = Common.Utils.buildNestedSiteMap(flatSiteMap)?.[""];

  const location = useLocation();
  const { setAppContext, language } = useAppContext();

  React.useEffect(() => {
    (async () => {
      const currentRouteCodes = ["", ...location.pathname.split("/").filter((code) => !R.isEmpty(code))];
      const currentSiteMapDepth: (BackendAPISchemas.NestedSiteMapSchema | undefined)[] = [siteMapNode];

      for (const routeCode of currentRouteCodes.splice(1)) {
        currentSiteMapDepth.push(currentSiteMapDepth.at(-1)?.children[routeCode]);
        if (R.isNullish(currentSiteMapDepth.at(-1))) {
          console.warn(`Route not found in site map: ${routeCode}`);
          break;
        }
      }

      setAppContext((ps) => ({ ...ps, siteMapNode, currentSiteMapDepth }));
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location, language, flatSiteMap]);

  return (
    <Routes>
      <Route element={<MainLayout />}>
        {IS_DEBUG_ENV && <Route path="/debug" element={<Test />} />}
        <Route path="/account/sign-in" element={<ShopSignInPage />} />
        <Route path="/pages/:id" element={<PageIdParamRenderer />} />
        <Route path="*" element={<RouteRenderer />} />
      </Route>
    </Routes>
  );
};
