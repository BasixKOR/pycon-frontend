import { useSuspenseQuery } from "@tanstack/react-query";
import * as React from "react";

import * as BackendAPIs from "@frontend/common/apis";
import { BackendAPIClient } from "@frontend/common/apis/client";
import { context as backendContext } from "@frontend/common/contexts";
import * as BackendAPISchemas from "@frontend/common/schemas/backendAPI";

const QUERY_KEYS = {
  SITEMAP_LIST: ["query", "sitemap", "list"],
  PAGE: ["query", "page"],
  SPONSOR_LIST: ["query", "sponsor", "list"],
  SESSION_LIST: ["query", "session", "list"],
};

export const useBackendContext = () => {
  const ctx = React.useContext(backendContext);
  if (!ctx) throw new Error("useBackendContext must be used within a CommonProvider");
  return ctx;
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

export const useSessionsQuery = (client: BackendAPIClient, params?: BackendAPISchemas.SessionQueryParameterSchema) =>
  useSuspenseQuery({
    queryKey: [...QUERY_KEYS.SESSION_LIST, client.language, ...(params ? [JSON.stringify(params)] : [])],
    queryFn: BackendAPIs.listSessions(client, params),
  });

export const useSessionQuery = (client: BackendAPIClient, id: string) =>
  useSuspenseQuery({
    queryKey: [...QUERY_KEYS.SESSION_LIST, id, client.language],
    queryFn: () => BackendAPIs.retrieveSession(client)(id),
  });
