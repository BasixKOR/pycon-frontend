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

  export type FlattenedSiteMapSchema = {
    id: string;
    route_code: string;
    name_ko: string;
    name_en: string;
    order: number;
    parent_sitemap: string | null;
    hide: boolean;
    page: string | null;
    external_link: string | null;
  };

  export type NestedSiteMapSchema = {
    id: string;
    route_code: string;
    name_ko: string;
    name_en: string;
    order: number;
    parent_sitemap: string | null;
    hide: boolean;
    children: NestedSiteMapSchema[];
    page: string | null;
    external_link: string | null;
  };

  export type PageSectionBulkUpdateSchema = PageSectionSchema | Omit<PageSectionSchema, "id">;

  export type PresentationSchema = {
    id: string; // UUID
    type: string; // UUID of the presentation type
    categories: string[]; // Array of category UUIDs
    title_ko: string;
    title_en: string;
    summary_ko: string;
    summary_en: string;
    description_ko: string;
    description_en: string;
    image: string | null;
  };

  export type ModificationAuditSchema = {
    id: string; // UUID
    status: "requested" | "approved" | "rejected" | "cancelled"; // Status of the modification request
    created_at: string; // ISO 8601 timestamp
    updated_at: string; // ISO 8601 timestamp
    created_by: string;
    updated_by: string | null; // User ID of the person who last updated the audit
    modification_data: string; // JSON string containing the modification data
    str_repr: string; // String representation of the modification audit, e.g., "Presentation Title - Status"
    comments: {
      id: string; // UUID of the comment
      content: string; // Content of the comment
      created_at: string; // ISO 8601 timestamp
      created_by: {
        id: number; // User ID of the commenter
        nickname: string; // Nickname of the commenter
        is_superuser: boolean; // Whether the commenter is a staff member
      };
      updated_at: string; // ISO 8601 timestamp
    }[];
    instance: {
      app: string;
      model: string;
      id: string; // UUID of the instance being modified, e.g., presentation ID
    };
  };
}

export default BackendAdminAPISchemas;
