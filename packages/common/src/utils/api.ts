import * as R from "remeda";

import BackendAPISchemas from "../schemas";

export const buildNestedSiteMap: (
  flattened: BackendAPISchemas.FlattenedSiteMapSchema[]
) => { [key: string]: BackendAPISchemas.NestedSiteMapSchema } = (flattened) => {
  const map: Record<string, BackendAPISchemas.NestedSiteMapSchema> = {};
  const roots: BackendAPISchemas.NestedSiteMapSchema[] = [];

  const siteMapIdRouteCodeMap = flattened.reduce((acc, item) => {
    acc[item.id] = item.route_code;
    return acc;
  }, {} as Record<string, string>);

  flattened.forEach((item) => {
    map[item.id] = {
      ...item,
      children: {},
    };
  });

  flattened.forEach((item) => {
    if (item.parent_sitemap) {
      map[item.parent_sitemap].children[siteMapIdRouteCodeMap[item.id]] = map[item.id];
    } else {
      roots.push(map[item.id]);
    }
  });

  return roots.reduce((acc, item) => {
    acc[item.route_code] = item;
    return acc;
  }, {} as Record<string, BackendAPISchemas.NestedSiteMapSchema>);
};

export const findSiteMapUsingRoute = (route: string, siteMapData: BackendAPISchemas.NestedSiteMapSchema): BackendAPISchemas.NestedSiteMapSchema | null => {
  const currentRouteCodes = ['', ...route.split('/').filter((code) => !R.isEmpty(code))];

  let currentSitemap: BackendAPISchemas.NestedSiteMapSchema | null | undefined = siteMapData.children[currentRouteCodes[0]];
  if (currentSitemap === undefined) return null;

  for (const routeCode of currentRouteCodes.slice(1)) {
    if ((currentSitemap = currentSitemap.children[routeCode] || null) === null) {
      break;
    }
  }
  return currentSitemap;
};

export const parseCss = (t: unknown): React.CSSProperties => (R.isString(t) && !R.isEmpty(t) && JSON.parse(t)) || {};
