import { OpenAPIParameterSchema, OpenAPISchema } from "../schemas/backendAdminAPI";

export const extractQueryParameters = (schema: OpenAPISchema, app: string, resource: string): OpenAPIParameterSchema[] => {
  const pathItem = schema.paths[`/v1/admin-api/${app}/${resource}/`];
  if (!pathItem?.get?.parameters) return [];

  return pathItem.get.parameters.filter((param) => param.in === "query");
};
