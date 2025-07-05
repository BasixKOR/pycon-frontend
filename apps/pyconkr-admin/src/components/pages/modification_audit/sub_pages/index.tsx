import { PresentationPreviewSubPage } from "./presentation_preview";
import { SubModificationAuditPageType } from "./types";
import { UserExtPreviewSubPage } from "./userext_preview";

export const SubModificationAuditPage: SubModificationAuditPageType = ({ audit, originalData, previewData }) => {
  switch (audit.instance.model) {
    case "presentation":
      return <PresentationPreviewSubPage originalData={originalData} previewData={previewData} audit={audit} />;
    case "userext":
      return <UserExtPreviewSubPage originalData={originalData} previewData={previewData} audit={audit} />;
    default:
      return <div>지원하지 않는 모델입니다: {audit.instance.model}</div>;
  }
};
