import * as Common from "@frontend/common";
import { Typography } from "@mui/material";

import { PreviewImageField, PreviewTextField } from "../components";
import { SubModificationAuditPageType } from "./types";

export const UserExtPreviewSubPage: SubModificationAuditPageType = ({ originalData, previewData }) => {
  return (
    <>
      <Typography variant="h6" fontWeight="bold" children="프로필 내용" />
      <Common.Components.Fieldset legend="계정 정보">
        <PreviewTextField originalDataset={originalData} previewDataset={previewData} name="id" label="계정 일련번호" />
        <PreviewTextField originalDataset={originalData} previewDataset={previewData} name="username" label="계정 ID" />
        <PreviewTextField originalDataset={originalData} previewDataset={previewData} name="email" label="계정 이메일" />
      </Common.Components.Fieldset>
      <PreviewImageField originalDataset={originalData} previewDataset={previewData} name="image" label="프로필 이미지" />
      <Common.Components.Fieldset legend="별칭">
        <PreviewTextField originalDataset={originalData} previewDataset={previewData} multiline name="nickname_ko" label="별칭 (한국어)" />
        <PreviewTextField originalDataset={originalData} previewDataset={previewData} multiline name="nickname_en" label="별칭 (영어)" />
      </Common.Components.Fieldset>
    </>
  );
};
