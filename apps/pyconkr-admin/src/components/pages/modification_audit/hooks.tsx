import * as Common from "@frontend/common";

const AdminAPIHooks = Common.Hooks.BackendAdminAPI;

export const useModificationAuditData = <T extends Record<string, string>>(auditId: string) => {
  const backendAdminClient = AdminAPIHooks.useBackendAdminClient();
  const { data: audit } = AdminAPIHooks.useModificationAuditRetrieveQuery(backendAdminClient, auditId);
  const app = audit?.instance.app || "";
  const model = audit?.instance.model || "";
  const objId = audit?.instance.id || "";

  const { data: originalData } = AdminAPIHooks.useRetrieveQuery<T>(backendAdminClient, app, model, objId);
  const { data: previewData } = AdminAPIHooks.useModificationAuditPreviewQuery<T>(backendAdminClient, app, model, objId, auditId);

  return !audit || !originalData || !previewData ? null : { audit, originalData, previewData };
};
