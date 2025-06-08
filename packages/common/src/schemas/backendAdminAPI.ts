import { RJSFSchema, UiSchema } from "@rjsf/utils";

namespace BackendAdminAPISchemas {
  export type DetailedErrorSchema = {
    code: string;
    detail: string;
    attr: string | null;
  };

  export type ErrorResponseSchema = {
    type: string;
    errors: DetailedErrorSchema[];
  };

  export type AdminSchemaDefinition = {
    schema: RJSFSchema;
    ui_schema: UiSchema;
    translation_fields: string[];
  };

  export type UserSchema = {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    is_staff: boolean;
    is_active: boolean;
    date_joined: string; // ISO 8601 format
  };

  export type UserSignInSchema = {
    identity: string; // username or email
    password: string;
  };

  export type UserChangePasswordSchema = {
    old_password: string;
    new_password: string;
    new_password_confirm: string;
  };

  export type PublicFileSchema = {
    id: string; // UUID
    file: string; // URL to the public file
    mimetype: string | null; // MIME type of the file
    hash: string; // Hash of the file for integrity check
    size: number; // Size of the file in bytes
  };

  export type PageSectionSchema = {
    id?: string;
    order: number;
    css: string;
    body_ko: string | null;
    body_en: string | null;
  };

  export type PageSectionBulkUpdateSchema = PageSectionSchema | Omit<PageSectionSchema, "id">;
}

export default BackendAdminAPISchemas;
