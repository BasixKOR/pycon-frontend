import * as Common from "@frontend/common";

import BackendAdminAPISchemas from "../../../../../../packages/common/src/schemas/backendAdminAPI";

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

export const usePreviewImageData = (originalData: Record<string, unknown>, previewData: Record<string, unknown>, name: string) => {
  const backendAdminClient = AdminAPIHooks.useBackendAdminClient();
  const commonArgs = [backendAdminClient, "file", "publicfile"] as const;
  const originalImageId = (originalData[name] as string) || "";
  const previewImageId = (previewData[name] as string) || "";

  const { data: originalImage } = AdminAPIHooks.useRetrieveQuery<BackendAdminAPISchemas.PublicFileSchema>(...commonArgs, originalImageId);
  const { data: previewImage } = AdminAPIHooks.useRetrieveQuery<BackendAdminAPISchemas.PublicFileSchema>(...commonArgs, previewImageId);

  return { originalImage, previewImage };
};
