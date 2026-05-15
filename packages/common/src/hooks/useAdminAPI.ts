import { useMutation, useQuery, useSuspenseQuery } from "@tanstack/react-query";

import {
  approveModificationAudit,
  bulkUpdateSections,
  changePassword,
  choices,
  create,
  issueGoogleOAuth2AccessToken,
  list,
  listPaginated,
  listSections,
  me,
  openApiSchema,
  previewModificationAudit,
  rejectModificationAudit,
  remove,
  removePrepared,
  renderSentTo,
  renderTemplate,
  resetUserPassword,
  retrieve,
  retryHistory,
  retrySentTo,
  schema,
  signIn,
  signOut,
  update,
  updatePrepared,
  uploadPublicFile,
} from "@frontend/common/apis/admin_api";
import { BackendAPIClient } from "@frontend/common/apis/client";
import { PublicFileSchema } from "@frontend/common/schemas/backendAdminAPI";

import { useBackendContext } from "./useAPI";

const QUERY_KEYS = {
  ADMIN_ME: ["query", "admin", "me"],
  ADMIN_LIST: ["query", "admin", "list"],
  ADMIN_RETRIEVE: ["query", "admin", "retrieve"],
  ADMIN_SCHEMA: ["query", "admin", "schema"],
  ADMIN_CHOICES: ["query", "admin", "choices"],
  ADMIN_OPENAPI_SCHEMA: ["query", "admin", "openapi-schema"],
  ADMIN_PREVIEW_MODIFICATION_AUDIT: ["query", "admin", "retrieve", "modification-audit"],
  ADMIN_RENDER_SENT_TO: ["query", "admin", "render-sent-to"],
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
  ADMIN_RENDER_TEMPLATE: ["mutation", "admin", "render-template"],
  ADMIN_RETRY_HISTORY: ["mutation", "admin", "retry-history"],
  ADMIN_RETRY_SENT_TO: ["mutation", "admin", "retry-sent-to"],
  ADMIN_ISSUE_GOOGLE_OAUTH2_ACCESS_TOKEN: ["mutation", "admin", "google-oauth2-access-token"],
};

export const useBackendAdminClient = () => {
  const { backendApiDomain, backendApiTimeout, backendApiCSRFCookieName } = useBackendContext();
  return new BackendAPIClient(backendApiDomain, backendApiTimeout, backendApiCSRFCookieName, true);
};

export const useSignedInUserQuery = (client: BackendAPIClient) =>
  useSuspenseQuery({
    queryKey: QUERY_KEYS.ADMIN_ME,
    queryFn: me(client),
  });

export const useSignInMutation = (client: BackendAPIClient) =>
  useMutation({
    mutationKey: [...MUTATION_KEYS.ADMIN_SIGN_IN],
    mutationFn: signIn(client),
  });

export const useSignOutMutation = (client: BackendAPIClient) =>
  useMutation({
    mutationKey: [...MUTATION_KEYS.ADMIN_SIGN_OUT],
    mutationFn: signOut(client),
  });

export const useChangePasswordMutation = (client: BackendAPIClient) =>
  useMutation({
    mutationKey: [...MUTATION_KEYS.ADMIN_CHANGE_PASSWORD],
    mutationFn: changePassword(client),
  });

export const useResetUserPasswordMutation = (client: BackendAPIClient, id: string) =>
  useMutation({
    mutationKey: [...MUTATION_KEYS.ADMIN_RESET_PASSWORD, id],
    mutationFn: resetUserPassword(client, id),
  });

export const useSchemaQuery = (client: BackendAPIClient, app: string, resource: string) =>
  useSuspenseQuery({
    queryKey: [...QUERY_KEYS.ADMIN_SCHEMA, app, resource],
    queryFn: schema(client, app, resource),
  });

export const useChoicesQuery = (client: BackendAPIClient, app: string, resource: string) =>
  useSuspenseQuery({
    queryKey: [...QUERY_KEYS.ADMIN_CHOICES, app, resource],
    queryFn: choices(client, app, resource),
  });

export const useOpenApiSchemaQuery = (client: BackendAPIClient) =>
  useSuspenseQuery({
    queryKey: QUERY_KEYS.ADMIN_OPENAPI_SCHEMA,
    queryFn: openApiSchema(client),
    staleTime: Infinity,
  });

export const useListQuery = <T>(client: BackendAPIClient, app: string, resource: string, params?: Record<string, string>) =>
  useSuspenseQuery({
    queryKey: [...QUERY_KEYS.ADMIN_LIST, app, resource, JSON.stringify(params)],
    queryFn: list<T>(client, app, resource, params),
  });

export const useListPaginatedQuery = <T>(client: BackendAPIClient, app: string, resource: string, params?: Record<string, string>) =>
  useSuspenseQuery({
    queryKey: [...QUERY_KEYS.ADMIN_LIST, app, resource, "paginated", JSON.stringify(params)],
    queryFn: listPaginated<T>(client, app, resource, params),
  });

export const useRetrieveQuery = <T>(client: BackendAPIClient, app: string, resource: string, id: string) =>
  useSuspenseQuery({
    queryKey: [...QUERY_KEYS.ADMIN_RETRIEVE, app, resource, id],
    queryFn: retrieve<T>(client, app, resource, id),
  });

export const useCreateMutation = <T>(client: BackendAPIClient, app: string, resource: string) =>
  useMutation({
    mutationKey: [...MUTATION_KEYS.ADMIN_CREATE, app, resource],
    mutationFn: create<T>(client, app, resource),
  });

export const useUpdateMutation = <T>(client: BackendAPIClient, app: string, resource: string, id: string) =>
  useMutation({
    mutationKey: [...MUTATION_KEYS.ADMIN_UPDATE, app, resource, id],
    mutationFn: update<T>(client, app, resource, id),
  });

export const useUpdatePreparedMutation = <T extends { id: string }>(client: BackendAPIClient, app: string, resource: string) =>
  useMutation({
    mutationKey: [...MUTATION_KEYS.ADMIN_UPDATE, app, resource, "prepared"],
    mutationFn: updatePrepared<T>(client, app, resource),
  });

export const useRemoveMutation = (client: BackendAPIClient, app: string, resource: string, id: string) =>
  useMutation({
    mutationKey: [...MUTATION_KEYS.ADMIN_REMOVE, app, resource, id],
    mutationFn: remove(client, app, resource, id),
  });

export const useRemovePreparedMutation = (client: BackendAPIClient, app: string, resource: string) =>
  useMutation({
    mutationKey: [...MUTATION_KEYS.ADMIN_REMOVE, app, resource, "prepared"],
    mutationFn: removePrepared(client, app, resource),
  });

export const usePublicFileQuery = (client: BackendAPIClient, id: string) =>
  useSuspenseQuery({
    queryKey: [...QUERY_KEYS.ADMIN_RETRIEVE, "file", "publicfile", id],
    queryFn: retrieve<PublicFileSchema>(client, "file", "publicfile", id),
  });

export const useUploadPublicFileMutation = (client: BackendAPIClient) =>
  useMutation({
    mutationKey: [...MUTATION_KEYS.ADMIN_CREATE, "public-file", "upload"],
    mutationFn: uploadPublicFile(client),
  });

export const useListPageSectionsQuery = (client: BackendAPIClient, pageId: string) =>
  useSuspenseQuery({
    queryKey: [...QUERY_KEYS.ADMIN_LIST, "cms", "page", pageId, "section"],
    queryFn: listSections(client, pageId),
  });

export const useBulkUpdatePageSectionsMutation = (client: BackendAPIClient, pageId: string) =>
  useMutation({
    mutationKey: [...MUTATION_KEYS.ADMIN_UPDATE, "cms", "page", pageId, "section"],
    mutationFn: bulkUpdateSections(client, pageId),
  });

export const useModificationAuditPreviewQuery = <T>(client: BackendAPIClient, id: string) =>
  useSuspenseQuery({
    queryKey: [...QUERY_KEYS.ADMIN_PREVIEW_MODIFICATION_AUDIT, id],
    queryFn: previewModificationAudit<T>(client, id),
  });

export const useApproveModificationAuditMutation = (client: BackendAPIClient, id: string) =>
  useMutation({
    mutationKey: MUTATION_KEYS.ADMIN_APPROVE_MODIFICATION_AUDIT,
    mutationFn: approveModificationAudit(client, id),
  });

export const useRejectModificationAuditMutation = (client: BackendAPIClient, id: string) =>
  useMutation({
    mutationKey: MUTATION_KEYS.ADMIN_REJECT_MODIFICATION_AUDIT,
    mutationFn: rejectModificationAudit(client, id),
  });

export const useRenderTemplateMutation = (client: BackendAPIClient, app: string, resource: string) =>
  useMutation({
    mutationKey: [...MUTATION_KEYS.ADMIN_RENDER_TEMPLATE, app, resource],
    mutationFn: renderTemplate(client, app, resource),
    meta: { invalidates: [] },
  });

export const useRetryHistoryMutation = (client: BackendAPIClient, app: string, resource: string, id: string) =>
  useMutation({
    mutationKey: [...MUTATION_KEYS.ADMIN_RETRY_HISTORY, app, resource, id],
    mutationFn: retryHistory(client, app, resource, id),
  });

export const useRetrySentToMutation = (client: BackendAPIClient, app: string, resource: string, id: string, sentToId: string) =>
  useMutation({
    mutationKey: [...MUTATION_KEYS.ADMIN_RETRY_SENT_TO, app, resource, id, sentToId],
    mutationFn: retrySentTo(client, app, resource, id, sentToId),
  });

export const useRenderSentToQuery = (client: BackendAPIClient, app: string, resource: string, id: string, sentToId: string | null) =>
  useQuery({
    queryKey: [...QUERY_KEYS.ADMIN_RENDER_SENT_TO, app, resource, id, sentToId],
    queryFn: renderSentTo(client, app, resource, id, sentToId ?? ""),
    enabled: !!sentToId,
  });

export const useIssueGoogleOAuth2AccessTokenMutation = (client: BackendAPIClient, id: string) =>
  useMutation({
    mutationKey: [...MUTATION_KEYS.ADMIN_ISSUE_GOOGLE_OAUTH2_ACCESS_TOKEN, id],
    mutationFn: issueGoogleOAuth2AccessToken(client, id),
    meta: { invalidates: [] },
  });
