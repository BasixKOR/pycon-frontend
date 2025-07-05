import * as Common from "@frontend/common";
import { Divider, Typography } from "@mui/material";

import { PreviewImageField, PreviewMarkdownField, PreviewTextField } from "../components";
import { SubModificationAuditPageType } from "./types";

export const PresentationPreviewSubPage: SubModificationAuditPageType = ({ originalData, previewData }) => {
  return (
    <>
      <Typography variant="h6" fontWeight="bold" children="발표 내용" />
      <Common.Components.Fieldset legend="제목">
        <PreviewTextField originalDataset={originalData} previewDataset={previewData} name="title_ko" label="제목 (한국어)" />
        <PreviewTextField originalDataset={originalData} previewDataset={previewData} name="title_en" label="제목 (영어)" />
      </Common.Components.Fieldset>
      <Common.Components.Fieldset legend="요약">
        <PreviewTextField originalDataset={originalData} previewDataset={previewData} multiline name="summary_ko" label="요약 (한국어)" />
        <PreviewTextField originalDataset={originalData} previewDataset={previewData} multiline name="summary_en" label="요약 (영어)" />
      </Common.Components.Fieldset>
      <Common.Components.Fieldset legend="상세 설명">
        <PreviewMarkdownField originalDataset={originalData} previewDataset={previewData} name="description_ko" label="상세 설명 (한국어)" />
        <PreviewMarkdownField originalDataset={originalData} previewDataset={previewData} name="description_en" label="상세 설명 (영어)" />
      </Common.Components.Fieldset>
      <PreviewImageField originalDataset={originalData} previewDataset={previewData} name="image" label="발표 이미지" />

      <Divider sx={{ my: 1, borderColor: "black" }} />
      <Typography variant="h6" fontWeight="bold" children="발표자 정보" />
    </>
  );
};
