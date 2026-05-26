import { createBrowserRouter } from "react-router-dom";

import { App } from "./App.tsx";
import MainLayout from "./components/layout/index.tsx";
import { PageIdParamRenderer, RouteRenderer } from "./components/pages/dynamic_route.tsx";
import { PresentationDetailPage } from "./components/pages/presentation_detail.tsx";
import { ShopSignInPage } from "./components/pages/sign_in.tsx";
import { SponsorDetailPage } from "./components/pages/sponsor_detail.tsx";

export const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        element: <MainLayout />,
        children: [
          { path: "/account/sign-in", element: <ShopSignInPage /> },
          { path: "/sponsors/:id", element: <SponsorDetailPage /> },
          { path: "/presentations/:id", element: <PresentationDetailPage /> },
          { path: "/pages/:id", element: <PageIdParamRenderer /> },
          { path: "*", element: <RouteRenderer /> },
        ],
      },
    ],
  },
]);
