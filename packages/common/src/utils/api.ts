
import BackendAPISchemas from '../schemas';

export const buildNestedSiteMap: (flattened: BackendAPISchemas.FlattenedSiteMapSchema[]) => BackendAPISchemas.NestedSiteMapSchema[] = (flattened) => {
  const map: Record<string, BackendAPISchemas.NestedSiteMapSchema> = {};
  const roots: BackendAPISchemas.NestedSiteMapSchema[] = [];

  flattened.forEach((item) => {
    map[item.id] = {
      ...item,
      children: [],
    };
  });

  flattened.forEach((item) => {
    if (item.parent_sitemap) {
      map[item.parent_sitemap].children.push(map[item.id]);
    } else {
      roots.push(map[item.id]);
    }
  });

  return roots;
}
