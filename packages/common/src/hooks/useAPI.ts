import { useSuspenseQuery } from "@tanstack/react-query";
import * as React from "react";

import BackendAPIs from "../apis";
import { BackendAPIClient } from "../apis/client";
import BackendContext from "../contexts";

const QUERY_KEYS = {
  SITEMAP_LIST: ["query", "sitemap", "list"],
  PAGE: ["query", "page"],
  SPONSOR_LIST: ["query", "sponsor", "list"],
  SESSION_LIST: ["query", "session", "list"],
};

namespace BackendAPIHooks {
  export const useBackendContext = () => {
    const context = React.useContext(BackendContext.context);
    if (!context) throw new Error("useBackendContext must be used within a CommonProvider");
    return context;
  };

  export const useBackendClient = () => {
    const { language, backendApiDomain, backendApiTimeout } = useBackendContext();
    return new BackendAPIClient(backendApiDomain, backendApiTimeout, "", false, language);
  };

  export const useFlattenSiteMapQuery = (client: BackendAPIClient) =>
    useSuspenseQuery({
      queryKey: [...QUERY_KEYS.SITEMAP_LIST, client.language],
      queryFn: BackendAPIs.listSiteMaps(client),
    });

  export const usePageQuery = (client: BackendAPIClient, id: string) =>
    useSuspenseQuery({
      queryKey: [...QUERY_KEYS.PAGE, id, client.language],
      queryFn: () => BackendAPIs.retrievePage(client)(id),
    });

  export const useSponsorQuery = (client: BackendAPIClient) =>
    useSuspenseQuery({
      queryKey: [...QUERY_KEYS.SPONSOR_LIST, client.language],
      queryFn: BackendAPIs.listSponsors(client),
    });

  export const useSessionsQuery = (client: BackendAPIClient) =>
    useSuspenseQuery({
      queryKey: [...QUERY_KEYS.SESSION_LIST, client.language],
      queryFn: BackendAPIs.listSessions(client),
    });
}

export default BackendAPIHooks;
