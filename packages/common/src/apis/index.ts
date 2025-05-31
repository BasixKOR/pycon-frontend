import BackendAPISchemas from "../schemas/backendAPI";
import { BackendAPIClient } from "./client";

namespace BackendAPIs {
  export const listSiteMaps = (client: BackendAPIClient) => () => client.get<BackendAPISchemas.FlattenedSiteMapSchema[]>("v1/cms/sitemap/");
  export const retrievePage = (client: BackendAPIClient) => (id: string) => client.get<BackendAPISchemas.PageSchema>(`v1/cms/page/${id}/`);
}

export default BackendAPIs;
