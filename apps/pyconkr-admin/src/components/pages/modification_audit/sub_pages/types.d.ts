import BackendAdminAPISchemas from "../../../../../../../packages/common/src/schemas/backendAdminAPI";

export type ModificationAuditPreviewSchema<T> = BackendAdminAPISchemas.ModificationAuditPreviewSchema<T>;

export type PresentationPreviewSchema = {
  type: string;
  categories: string[];
  image: string | null;
  title_ko: string;
  title_en: string;
  summary_ko: string;
  summary_en: string;
  description_ko: string;
  description_en: string;
  speakers: {
    id: string;
    user: {
      id: number;
      nickname_ko: string;
      nickname_en: string;
    };
    image: string | null;
    biography_ko: string;
    biography_en: string;
  }[];
};

export type UserPreviewSchema = {
  id: number;
  email: string;
  image: string | null;
  nickname_ko: string;
  nickname_en: string;
};

export type SubModificationAuditPageType<T> = React.FC<{
  modification_audit: BackendAdminAPISchemas.ModificationAuditSchema;
  original: T;
  modified: T;
}>;
