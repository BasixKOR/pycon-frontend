import { useMutation, useSuspenseQuery } from "@tanstack/react-query";

import BackendAPIHooks from "./useAPI";
import BackendAdminAPIs from "../apis/admin_api";
import { BackendAPIClient } from "../apis/client";
import BackendAdminAPISchemas from "../schemas/backendAdminAPI";

const QUERY_KEYS = {
  ADMIN_ME: ["query", "admin", "me"],
  ADMIN_LIST: ["query", "admin", "list"],
  ADMIN_RETRIEVE: ["query", "admin", "retrieve"],
  ADMIN_SCHEMA: ["query", "admin", "schema"],
  ADMIN_PREVIEW_MODIFICATION_AUDIT: ["query", "admin", "retrieve", "modification-audit"],
};

const MUTATION_KEYS = {
  ADMIN_SIGN_IN: ["mutation", "admin", "sign-in"],
  ADMIN_SIGN_OUT: ["mutation", "admin", "sign-out"],
  ADMIN_CHANGE_PASSWORD: ["mutation", "admin", "change-password"],
  ADMIN_RESET_PASSWORD: ["mutation", "admin", "reset-password"],
  ADMIN_CREATE: ["mutation", "admin", "create"],
  ADMIN_UPDATE: ["mutation", "admin", "update"],
  ADMIN_REMOVE: ["mutation", "admin", "remove"],
  ADMIN_APPROVE_MODIFICATION_AUDIT: ["mutation", "admin", "approve", "modification-audit"],
  ADMIN_REJECT_MODIFICATION_AUDIT: ["mutation", "admin", "reject", "modification-audit"],
};

namespace BackendAdminAPIHooks {
  export const useBackendAdminClient = () => {
    const { backendApiDomain, backendApiTimeout, backendApiCSRFCookieName } = BackendAPIHooks.useBackendContext();
    return new BackendAPIClient(backendApiDomain, backendApiTimeout, backendApiCSRFCookieName, true);
  };

  export const useSignedInUserQuery = (client: BackendAPIClient) =>
    useSuspenseQuery({
      queryKey: QUERY_KEYS.ADMIN_ME,
      queryFn: BackendAdminAPIs.me(client),
    });

  export const useSignInMutation = (client: BackendAPIClient) =>
    useMutation({
      mutationKey: [...MUTATION_KEYS.ADMIN_SIGN_IN],
      mutationFn: BackendAdminAPIs.signIn(client),
    });

  export const useSignOutMutation = (client: BackendAPIClient) =>
    useMutation({
      mutationKey: [...MUTATION_KEYS.ADMIN_SIGN_OUT],
      mutationFn: BackendAdminAPIs.signOut(client),
    });

  export const useChangePasswordMutation = (client: BackendAPIClient) =>
    useMutation({
      mutationKey: [...MUTATION_KEYS.ADMIN_CHANGE_PASSWORD],
      mutationFn: BackendAdminAPIs.changePassword(client),
    });

  export const useResetUserPasswordMutation = (client: BackendAPIClient, id: string) =>
    useMutation({
      mutationKey: [...MUTATION_KEYS.ADMIN_RESET_PASSWORD, id],
      mutationFn: BackendAdminAPIs.resetUserPassword(client, id),
    });

  export const useSchemaQuery = (client: BackendAPIClient, app: string, resource: string) =>
    useSuspenseQuery({
      queryKey: [...QUERY_KEYS.ADMIN_SCHEMA, app, resource],
      queryFn: BackendAdminAPIs.schema(client, app, resource),
    });

  export const useListQuery = <T>(client: BackendAPIClient, app: string, resource: string, params?: Record<string, string>) =>
    useSuspenseQuery({
      queryKey: [...QUERY_KEYS.ADMIN_LIST, app, resource, JSON.stringify(params)],
      queryFn: BackendAdminAPIs.list<T>(client, app, resource, params),
    });

  export const useRetrieveQuery = <T>(client: BackendAPIClient, app: string, resource: string, id: string) =>
    useSuspenseQuery({
      queryKey: [...QUERY_KEYS.ADMIN_RETRIEVE, app, resource, id],
      queryFn: BackendAdminAPIs.retrieve<T>(client, app, resource, id),
    });

  export const useCreateMutation = <T>(client: BackendAPIClient, app: string, resource: string) =>
    useMutation({
      mutationKey: [...MUTATION_KEYS.ADMIN_CREATE, app, resource],
      mutationFn: BackendAdminAPIs.create<T>(client, app, resource),
    });

  export const useUpdateMutation = <T>(client: BackendAPIClient, app: string, resource: string, id: string) =>
    useMutation({
      mutationKey: [...MUTATION_KEYS.ADMIN_UPDATE, app, resource, id],
      mutationFn: BackendAdminAPIs.update<T>(client, app, resource, id),
    });

  export const useUpdatePreparedMutation = <T extends { id: string }>(client: BackendAPIClient, app: string, resource: string) =>
    useMutation({
      mutationKey: [...MUTATION_KEYS.ADMIN_UPDATE, app, resource, "prepared"],
      mutationFn: BackendAdminAPIs.updatePrepared<T>(client, app, resource),
    });

  export const useRemoveMutation = (client: BackendAPIClient, app: string, resource: string, id: string) =>
    useMutation({
      mutationKey: [...MUTATION_KEYS.ADMIN_REMOVE, app, resource, id],
      mutationFn: BackendAdminAPIs.remove(client, app, resource, id),
    });

  export const useRemovePreparedMutation = (client: BackendAPIClient, app: string, resource: string) =>
    useMutation({
      mutationKey: [...MUTATION_KEYS.ADMIN_REMOVE, app, resource, "prepared"],
      mutationFn: BackendAdminAPIs.removePrepared(client, app, resource),
    });

  export const usePublicFileQuery = (client: BackendAPIClient, id: string) =>
    useSuspenseQuery({
      queryKey: [...QUERY_KEYS.ADMIN_RETRIEVE, "file", "publicfile", id],
      queryFn: BackendAdminAPIs.retrieve<BackendAdminAPISchemas.PublicFileSchema>(client, "file", "publicfile", id),
    });

  export const useUploadPublicFileMutation = (client: BackendAPIClient) =>
    useMutation({
      mutationKey: [...MUTATION_KEYS.ADMIN_CREATE, "public-file", "upload"],
      mutationFn: BackendAdminAPIs.uploadPublicFile(client),
    });

  export const useListPageSectionsQuery = (client: BackendAPIClient, pageId: string) =>
    useSuspenseQuery({
      queryKey: [...QUERY_KEYS.ADMIN_LIST, "cms", "page", pageId, "section"],
      queryFn: BackendAdminAPIs.listSections(client, pageId),
    });

  export const useBulkUpdatePageSectionsMutation = (client: BackendAPIClient, pageId: string) =>
    useMutation({
      mutationKey: [...MUTATION_KEYS.ADMIN_UPDATE, "cms", "page", pageId, "section"],
      mutationFn: BackendAdminAPIs.bulkUpdateSections(client, pageId),
    });

  export const useModificationAuditPreviewQuery = <T>(client: BackendAPIClient, id: string) =>
    useSuspenseQuery({
      queryKey: [...QUERY_KEYS.ADMIN_PREVIEW_MODIFICATION_AUDIT, id],
      queryFn: BackendAdminAPIs.previewModificationAudit<T>(client, id),
    });

  export const useApproveModificationAuditMutation = (client: BackendAPIClient, id: string) =>
    useMutation({
      mutationKey: MUTATION_KEYS.ADMIN_APPROVE_MODIFICATION_AUDIT,
      mutationFn: BackendAdminAPIs.approveModificationAudit(client, id),
    });

  export const useRejectModificationAuditMutation = (client: BackendAPIClient, id: string) =>
    useMutation({
      mutationKey: MUTATION_KEYS.ADMIN_REJECT_MODIFICATION_AUDIT,
      mutationFn: BackendAdminAPIs.rejectModificationAudit(client, id),
    });
}

export default BackendAdminAPIHooks;
