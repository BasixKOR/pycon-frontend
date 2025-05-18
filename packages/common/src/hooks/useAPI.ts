import * as React from "react";

import { useSuspenseQuery } from "@tanstack/react-query";

import BackendAPIs from "../apis";
import { BackendAPIClient } from '../apis/client';
import BackendContext from '../contexts';
import Utils from "../utils";

const QUERY_KEYS = {
  SITEMAP: ["query", "sitemap"],
  SITEMAP_LIST: ["query", "sitemap", "list"],
  SITEMAP_NESTED_LIST: ["query", "sitemap", "list", "nested"],
  PAGE: ["query", "page"],
};

namespace BackendAPIHooks {
  export const useBackendContext = () => {
    const context = React.useContext(BackendContext.context);
    if (!context) throw new Error("useBackendContext must be used within a CommonProvider");
    return context;
  }

  const clientDecorator = <T = CallableFunction>(func:(client: BackendAPIClient) => T): T => {
    const { backendApiDomain, backendApiTimeout } = useBackendContext();
    return func(new BackendAPIClient(backendApiDomain, backendApiTimeout));
  }

  export const useFlattenSiteMapQuery = () => useSuspenseQuery({
    queryKey: QUERY_KEYS.SITEMAP_LIST,
    queryFn: clientDecorator(BackendAPIs.listSiteMaps),
    meta: { invalidates: [ QUERY_KEYS.SITEMAP ] },
  });

  export const useNestedSiteMapQuery = () => useSuspenseQuery({
    queryKey: QUERY_KEYS.SITEMAP_LIST,
    queryFn: async () => {
      const { data } = useFlattenSiteMapQuery();
      return Utils.buildNestedSiteMap(data);
    },
    meta: { invalidates: [ QUERY_KEYS.SITEMAP_NESTED_LIST ] },
  });

  export const usePageQuery = (id: string) => useSuspenseQuery({
    queryKey: [ ...QUERY_KEYS.PAGE, id ],
    queryFn: () => clientDecorator(BackendAPIs.retrievePage)(id),
  });
}

export default BackendAPIHooks;
