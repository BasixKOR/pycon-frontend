import CommonSchemas from "../schemas";
import { BackendAPIClient } from "./client";

namespace BackendAPIs {
  export const listSiteMaps = (client: BackendAPIClient) => () => client.get<CommonSchemas.FlattenedSiteMapSchema[]>("v1/cms/sitemap/");
  export const retrievePage = (client: BackendAPIClient) => (id: string) => client.get<CommonSchemas.PageSchema>(`v1/cms/page/${id}/`);
}

export default BackendAPIs;
