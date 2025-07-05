import BackendAdminAPISchemas from "../../../../../../../packages/common/src/schemas/backendAdminAPI";

export type SubModificationAuditPageType = React.FC<{
  audit: BackendAdminAPISchemas.ModificationAuditSchema;
  originalData: Record<string, string>;
  previewData: Record<string, string>;
}>;
