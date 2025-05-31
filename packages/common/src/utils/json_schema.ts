import { JSONSchema7 } from 'json-schema';

export const filterWritablePropertiesInJsonSchema = (schema: JSONSchema7) => {
  const writableSchema: JSONSchema7 = { ...schema };
  if (writableSchema.properties) {
    writableSchema.properties = Object.entries(writableSchema.properties)
      .filter(([_, propDef]) => !(propDef as JSONSchema7).readOnly)
      .reduce(
        (acc, [propKey, propDef]) => ({...acc, [propKey]: filterWritablePropertiesInJsonSchema(propDef as JSONSchema7)}),
        {} as JSONSchema7["properties"],
      );
  }

  return writableSchema;
}

export const filterReadOnlyPropertiesInJsonSchema = (schema: JSONSchema7) => {
  const readOnlySchema: JSONSchema7 = { ...schema };
  if (readOnlySchema.properties) {
    readOnlySchema.properties = Object.entries(readOnlySchema.properties)
      .filter(([_, propDef]) => (propDef as JSONSchema7).readOnly)
      .reduce(
        (acc, [propKey, propDef]) => ({...acc, [propKey]: filterReadOnlyPropertiesInJsonSchema(propDef as JSONSchema7)}),
        {} as JSONSchema7["properties"],
      );
    readOnlySchema.required = readOnlySchema.required?.filter((key) => key in (readOnlySchema?.properties || {}));
  }

  return readOnlySchema;
}
