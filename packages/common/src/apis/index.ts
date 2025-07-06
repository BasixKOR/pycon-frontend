import { BackendAPIClient, BackendAPIClientError as _BackendAPIClientError } from "./client";
import BackendAPISchemas from "../schemas/backendAPI";

namespace BackendAPIs {
  export const BackendAPIClientError = _BackendAPIClientError;
  export const listSiteMaps = (client: BackendAPIClient) => () => client.get<BackendAPISchemas.FlattenedSiteMapSchema[]>("v1/cms/sitemap/");
  export const retrievePage = (client: BackendAPIClient) => (id: string) => client.get<BackendAPISchemas.PageSchema>(`v1/cms/page/${id}/`);
  export const listSponsors = (client: BackendAPIClient) => () => client.get<BackendAPISchemas.SponsorTierSchema[]>("v1/event/sponsor/");
  export const listSessions = (client: BackendAPIClient, params?: BackendAPISchemas.SessionQueryParameterSchema) => () =>
    client.get<BackendAPISchemas.SessionSchema[]>("v1/event/presentation/", { params });
}

export default BackendAPIs;
