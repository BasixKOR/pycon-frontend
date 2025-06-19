import * as R from "remeda";

type GFlatSiteMap = {
  id: string;
  route_code: string;
  order: number;
  parent_sitemap: string | null;
  page: string;
  hide: boolean;
};
type GNestedSiteMap<T = GFlatSiteMap> = T & { children: GNestedSiteMap<T>[] };
type MultiRootGNestedSiteMap<T = GFlatSiteMap> = { [key: string]: GNestedSiteMap<T> };

const _sortChildren = <T extends GFlatSiteMap>(children: GNestedSiteMap<T>[]) => {
  return children
    .sort((a, b) => a.order - b.order)
    .map(<Z extends GNestedSiteMap<T>>(child: Z): Z => ({ ...child, children: _sortChildren(child.children) }));
};

export const buildNestedSiteMap = <T extends GFlatSiteMap>(flat: T[]) => {
  const roots: GNestedSiteMap<T>[] = [];
  const flatWithChildren = flat.map((item) => ({ ...item, children: [] as GNestedSiteMap<T>[] }));
  const map = flatWithChildren.reduce((a, i) => ({ ...a, [i.id]: i }), {} as MultiRootGNestedSiteMap<T>);

  flat.forEach((item) => {
    if (item.parent_sitemap) {
      map[item.parent_sitemap].children.push(map[item.id]);
    } else {
      roots.push(map[item.id]);
    }
  });

  return roots
    .map((root) => ({ ...root, children: _sortChildren(root.children) }))
    .reduce((a, i) => ({ ...a, [i.route_code]: i }), {} as MultiRootGNestedSiteMap<T>);
};

export const buildFlatSiteMap = <T extends GNestedSiteMap>(nested: GNestedSiteMap<T>) => {
  const flat: (T & { route: string })[] = [];

  const traverse = (node: GNestedSiteMap<T>, parentRoute: string) => {
    const route = parentRoute ? `${parentRoute}/${node.route_code}` : node.route_code;
    flat.push({ ...node, route });
    node.children.forEach((n: GNestedSiteMap<T>) => traverse(n, route));
  };

  traverse(nested, "");
  return flat;
};

export const parseCss = (t: unknown): React.CSSProperties => {
  try {
    if (R.isString(t) && !R.isEmpty(t)) return JSON.parse(t);
  } catch (e) {
    console.warn("Failed to parse CSS string:", t, e);
  }
  return {} as React.CSSProperties;
};
