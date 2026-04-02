import BackendAdminAPISchemas from "../schemas/backendAdminAPI";

export const extractQueryParameters = (
  schema: BackendAdminAPISchemas.OpenAPISchema,
  app: string,
  resource: string
): BackendAdminAPISchemas.OpenAPIParameterSchema[] => {
  const pathItem = schema.paths[`/v1/admin-api/${app}/${resource}/`];
  if (!pathItem?.get?.parameters) return [];

  return pathItem.get.parameters.filter((param) => param.in === "query");
};
