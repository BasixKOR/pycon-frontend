namespace BackendParticipantPortalAPISchemas {
  export type EmptyObject = Record<string, never>;

  export type DetailedErrorSchema = {
    code: string;
    detail: string;
    attr: string | null;
  };

  export type ErrorResponseSchema = {
    type: string;
    errors: DetailedErrorSchema[];
  };

  export type UserSchema = {
    id: number;
    email: string;
    username: string;
    nickname: string | null;
    nickname_ko: string | null;
    nickname_en: string | null;
    image: string | null; // PK of the user's profile image
    profile_image: string | null; // URL to the user's profile image

    has_requested_modification_audit: boolean;
    requested_modification_audit_id: string | null;
  };

  export type UserUpdateSchema = {
    nickname_ko: string | null;
    nickname_en: string | null;
    image?: string | null; // PK of the user's profile image
  };

  export type UserSignInSchema = {
    identity: string; // email
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
    name: string; // Name of the public file
  };

  export type PresentationRetrieveSchema = {
    id: string; // UUID
    title: string; // Title of the presentation, translated to the current language
    title_ko: string; // Title in Korean
    title_en: string; // Title in English
    summary: string; // Summary of the presentation, translated to the current language
    summary_ko: string; // Summary in Korean
    summary_en: string; // Summary in English
    description: string; // Description of the presentation, translated to the current language
    description_ko: string; // Description in Korean
    description_en: string; // Description in English
    image: string | null; // PK of the presentation's image
    speakers: {
      id: string; // UUID of the speaker
      biography_ko: string; // Biography in Korean
      biography_en: string; // Biography in English
      image: string | null; // PK of the speaker's image
    }[];

    has_requested_modification_audit: boolean;
    requested_modification_audit_id: string | null;
  };

  export type PresentationUpdateSchema = {
    id: string;
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
    str_repr: string; // String representation of the modification audit, e.g., "Presentation Title - Status"
    status: "requested" | "approved" | "rejected" | "cancelled"; // Status of the modification request
    created_at: string; // ISO 8601 timestamp
    updated_at: string; // ISO 8601 timestamp

    instance_type: string; // Type of the instance being modified (e.g., "presentation")
    instance_id: string; // UUID of the instance being modified (e.g., presentation ID)
    modification_data: string; // JSON string containing the modification data

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
  };

  export type ModificationAuditCancelRequestSchema = {
    id: string; // UUID of the modification audit
    reason: string | null; // Reason for cancelling the modification request
  };
}

export default BackendParticipantPortalAPISchemas;
