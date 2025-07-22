import { PresentationPreviewSubPage } from "./presentation_preview";
import { ModificationAuditPreviewSchema, PresentationPreviewSchema, SubModificationAuditPageType, UserPreviewSchema } from "./types";
import { UserExtPreviewSubPage } from "./userext_preview";

export const SubModificationAuditPage: SubModificationAuditPageType<unknown> = (data) => {
  switch (data.modification_audit.instance.model) {
    case "presentation":
      return <PresentationPreviewSubPage {...(data as unknown as ModificationAuditPreviewSchema<PresentationPreviewSchema>)} />;
    case "userext":
      return <UserExtPreviewSubPage {...(data as unknown as ModificationAuditPreviewSchema<UserPreviewSchema>)} />;
    default:
      return <div>지원하지 않는 모델입니다: {data.modification_audit.instance.model}</div>;
  }
};
