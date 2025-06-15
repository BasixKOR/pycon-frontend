import { BackendAPIClient } from "./client";
import BackendAdminAPISchemas from "../schemas/backendAdminAPI";

namespace BackendAdminAPIs {
  export const me = (client: BackendAPIClient) => async () => {
    try {
      return await client.get<BackendAdminAPISchemas.UserSchema>("v1/admin-api/user/userext/me/");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_) {
      return null;
    }
  };

  export const signIn = (client: BackendAPIClient) => (data: BackendAdminAPISchemas.UserSignInSchema) =>
    client.post<BackendAdminAPISchemas.UserSchema, BackendAdminAPISchemas.UserSignInSchema>("v1/admin-api/user/userext/signin/", data);

  export const signOut = (client: BackendAPIClient) => () => client.delete<void>("v1/admin-api/user/userext/signout/");

  export const changePassword = (client: BackendAPIClient) => (data: BackendAdminAPISchemas.UserChangePasswordSchema) =>
    client.post<void, BackendAdminAPISchemas.UserChangePasswordSchema>("v1/admin-api/user/userext/password/", data);

  export const resetUserPassword = (client: BackendAPIClient, id: string) => () =>
    client.delete<void, void>(`v1/admin-api/user/userext/${id}/password/`);

  export const list =
    <T>(client: BackendAPIClient, app: string, resource: string) =>
    () =>
      client.get<T[]>(`v1/admin-api/${app}/${resource}/`);

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

  export const remove = (client: BackendAPIClient, app: string, resource: string, id: string) => () =>
    client.delete<void>(`v1/admin-api/${app}/${resource}/${id}/`);

  export const removePrepared = (client: BackendAPIClient, app: string, resource: string) => (id: string) =>
    client.delete<void>(`v1/admin-api/${app}/${resource}/${id}/`);

  export const schema = (client: BackendAPIClient, app: string, resource: string) => () =>
    client.get<BackendAdminAPISchemas.AdminSchemaDefinition>(`v1/admin-api/${app}/${resource}/json-schema/`);

  export const uploadPublicFile = (client: BackendAPIClient) => (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return client.post<BackendAdminAPISchemas.PublicFileSchema, FormData>(`v1/admin-api/file/publicfile/upload/`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  };

  export const listSections = (client: BackendAPIClient, pageId: string) => () => {
    if (!pageId) return Promise.resolve([]);
    return client.get<BackendAdminAPISchemas.PageSectionSchema[]>(`v1/admin-api/cms/page/${pageId}/section/`);
  };

  export const bulkUpdateSections =
    (client: BackendAPIClient, pageId: string) => (data: { sections: BackendAdminAPISchemas.PageSectionBulkUpdateSchema[] }) =>
      client.put<BackendAdminAPISchemas.PageSectionSchema[], { sections: BackendAdminAPISchemas.PageSectionBulkUpdateSchema[] }>(
        `v1/admin-api/cms/page/${pageId}/section/bulk-update/`,
        data
      );
}

export default BackendAdminAPIs;
