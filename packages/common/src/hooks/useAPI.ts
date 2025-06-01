import { useSuspenseQuery } from "@tanstack/react-query";
import * as React from "react";

import BackendAPIs from "../apis";
import { BackendAPIClient } from "../apis/client";
import BackendContext from "../contexts";

const QUERY_KEYS = {
  SITEMAP_LIST: ["query", "sitemap", "list"],
  PAGE: ["query", "page"],
};

namespace BackendAPIHooks {
  export const useBackendContext = () => {
    const context = React.useContext(BackendContext.context);
    if (!context)
      throw new Error("useBackendContext must be used within a CommonProvider");
    return context;
  };

  export const useBackendClient = () => {
    const { backendApiDomain, backendApiTimeout } = useBackendContext();
    return new BackendAPIClient(backendApiDomain, backendApiTimeout);
  };

  export const useFlattenSiteMapQuery = (client: BackendAPIClient) =>
    useSuspenseQuery({
      queryKey: QUERY_KEYS.SITEMAP_LIST,
      queryFn: BackendAPIs.listSiteMaps(client),
    });

  export const usePageQuery = (client: BackendAPIClient, id: string) =>
    useSuspenseQuery({
      queryKey: [...QUERY_KEYS.PAGE, id],
      queryFn: () => BackendAPIs.retrievePage(client)(id),
    });
}

export default BackendAPIHooks;
