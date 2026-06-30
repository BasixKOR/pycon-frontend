import {
  AdminSchemaDefinition,
  DashboardChartDataResponse,
  DashboardChartDefinition,
  GoogleOAuth2AccessTokenResponseSchema,
  ModificationAuditPreviewSchema,
  ModificationAuditSchema,
  OpenAPISchema,
  PageSectionBulkUpdateSchema,
  PageSectionSchema,
  PaginatedListResponse,
  PublicFileSchema,
  SelectablesResponse,
  UserChangePasswordSchema,
  UserResetPasswordResponseSchema,
  UserSchema,
  UserSignInSchema,
} from "@frontend/common/schemas/backendAdminAPI";

import { BackendAPIClient } from "./client";

export const me = (client: BackendAPIClient) => async () => {
  try {
    return await client.get<UserSchema>("v1/admin-api/user/userext/me/");
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_) {
    return null;
  }
};

export const signIn = (client: BackendAPIClient) => (data: UserSignInSchema) =>
  client.post<UserSchema, UserSignInSchema>("v1/admin-api/user/userext/signin/", data);

export const signOut = (client: BackendAPIClient) => () => client.delete<void>("v1/admin-api/user/userext/signout/");

export const changePassword = (client: BackendAPIClient) => (data: UserChangePasswordSchema) =>
  client.post<void, UserChangePasswordSchema>("v1/admin-api/user/userext/password/", data);

export const resetUserPassword = (client: BackendAPIClient, id: string) => () =>
  client.delete<UserResetPasswordResponseSchema>(`v1/admin-api/user/userext/${id}/password/`);

export const listPaginated =
  <T>(client: BackendAPIClient, app: string, resource: string, params?: Record<string, string>) =>
  () =>
    client.get<PaginatedListResponse<T>>(`v1/admin-api/${app}/${resource}/`, { params });

export const listAll =
  <T>(client: BackendAPIClient, app: string, resource: string, params?: Record<string, string>) =>
  async (): Promise<T[]> => {
    const items: T[] = [];
    for (let page = 1; ; page += 1) {
      const data = await client.get<PaginatedListResponse<T>>(`v1/admin-api/${app}/${resource}/`, {
        params: { ...params, page: String(page), page_size: "200" },
      });
      items.push(...data.results);
      if (!data.next) break;
    }
    return items;
  };

export const retrieve =
  <T>(client: BackendAPIClient, app: string, resource: string, id: string) =>
  () => {
    if (!id) return Promise.resolve(null);
    return client.get<T>(`v1/admin-api/${app}/${resource}/${id}/`);
  };

export const create =
  <T>(client: BackendAPIClient, app: string, resource: string) =>
  (data: T) =>
    client.post<Omit<T, "id">, T>(`v1/admin-api/${app}/${resource}/`, data);

export const update =
  <T>(client: BackendAPIClient, app: string, resource: string, id: string) =>
  (data: Omit<T, "id">) =>
    client.patch<T, Omit<T, "id">>(`v1/admin-api/${app}/${resource}/${id}/`, data);

export const updatePrepared =
  <T extends { id: string }>(client: BackendAPIClient, app: string, resource: string) =>
  (data: T) =>
    client.patch<T, Omit<T, "id">>(`v1/admin-api/${app}/${resource}/${data.id}/`, data);

export const remove = (client: BackendAPIClient, app: string, resource: string, id: string) => () =>
  client.delete<void>(`v1/admin-api/${app}/${resource}/${id}/`);

export const removePrepared = (client: BackendAPIClient, app: string, resource: string) => (id: string) =>
  client.delete<void>(`v1/admin-api/${app}/${resource}/${id}/`);

export const schema = (client: BackendAPIClient, app: string, resource: string) => () =>
  client.get<AdminSchemaDefinition>(`v1/admin-api/${app}/${resource}/json-schema/`);

export const uploadPublicFile = (client: BackendAPIClient) => (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  return client.post<PublicFileSchema, FormData>(`v1/admin-api/file/publicfile/upload/`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const listSections = (client: BackendAPIClient, pageId: string) => () => {
  if (!pageId) return Promise.resolve([]);
  return client.get<PageSectionSchema[]>(`v1/admin-api/cms/page/${pageId}/section/`);
};

export const selectables = (client: BackendAPIClient, app: string, resource: string) => () =>
  client.get<SelectablesResponse>(`v1/admin-api/${app}/${resource}/selectables/`);

export const openApiSchema = (client: BackendAPIClient) => () => client.get<OpenAPISchema>("api/schema/v1/", { params: { format: "json" } });

export const bulkUpdateSections = (client: BackendAPIClient, pageId: string) => (data: { sections: PageSectionBulkUpdateSchema[] }) =>
  client.put<PageSectionSchema[], { sections: PageSectionBulkUpdateSchema[] }>(`v1/admin-api/cms/page/${pageId}/section/bulk-update/`, data);

export const approveModificationAudit = (client: BackendAPIClient, id: string) => (reason?: string | null) =>
  client.patch<ModificationAuditSchema, { reason?: string | null }>(`v1/admin-api/participant_portal_api/modificationaudit/${id}/approve/`, {
    reason: reason ?? null,
  });

export const rejectModificationAudit = (client: BackendAPIClient, id: string) => (reason?: string | null) =>
  client.patch<ModificationAuditSchema, { reason?: string | null }>(`v1/admin-api/participant_portal_api/modificationaudit/${id}/reject/`, {
    reason: reason ?? null,
  });

export const previewModificationAudit =
  <T>(client: BackendAPIClient, id: string) =>
  () =>
    client.get<ModificationAuditPreviewSchema<T>>(`v1/admin-api/participant_portal_api/modificationaudit/${id}/preview/`);

export const renderTemplate =
  (client: BackendAPIClient, app: string, resource: string) =>
  ({ id, context }: { id: string; context: Record<string, unknown> }) =>
    client.post<string, { context: Record<string, unknown> }>(`v1/admin-api/${app}/${resource}/${id}/render/`, { context });

export const retryHistory = (client: BackendAPIClient, app: string, resource: string, id: string) => () =>
  client.post<unknown, undefined>(`v1/admin-api/${app}/${resource}/${id}/retry/`, undefined);

export const retrySentTo = (client: BackendAPIClient, app: string, resource: string, id: string, sentToId: string) => () =>
  client.post<unknown, undefined>(`v1/admin-api/${app}/${resource}/${id}/sent-to/${sentToId}/retry/`, undefined);

export const renderSentTo = (client: BackendAPIClient, app: string, resource: string, id: string, sentToId: string) => () =>
  client.get<string>(`v1/admin-api/${app}/${resource}/${id}/sent-to/${sentToId}/render/`);

export const issueGoogleOAuth2AccessToken = (client: BackendAPIClient, id: string) => () =>
  client.post<GoogleOAuth2AccessTokenResponseSchema, undefined>(`v1/admin-api/external_api/googleoauth2/${id}/access-token/`, undefined);

export const exportOrders = (client: BackendAPIClient) => (params: Record<string, string>) =>
  client.post<Blob, null>("v1/admin-api/shop/order/export/", null, { params, responseType: "blob" });

export const listDashboardCharts = (client: BackendAPIClient) => () => client.get<DashboardChartDefinition[]>("v1/admin-api/dashboard/charts/");

export const fetchDashboardChartData = (client: BackendAPIClient, endpoint: string) => (params: Record<string, unknown>) =>
  client.post<DashboardChartDataResponse, { params: Record<string, unknown> }>(endpoint, { params });
