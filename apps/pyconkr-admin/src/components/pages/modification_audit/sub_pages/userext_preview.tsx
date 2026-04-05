import { Components } from "@frontend/common";
import { Typography } from "@mui/material";

import { PreviewImageField, PreviewTextField } from "../components";
import { SubModificationAuditPageType, UserPreviewSchema } from "./types";

export const UserExtPreviewSubPage: SubModificationAuditPageType<UserPreviewSchema> = ({ original, modified }) => {
  return (
    <>
      <Typography variant="h6" fontWeight="bold" children="프로필 내용" />
      <Components.Fieldset legend="계정 정보">
        <PreviewTextField originalDataset={original} previewDataset={modified} name="id" label="계정 일련번호" />
        <PreviewTextField originalDataset={original} previewDataset={modified} name="username" label="계정 ID" />
        <PreviewTextField originalDataset={original} previewDataset={modified} name="email" label="계정 이메일" />
      </Components.Fieldset>
      <PreviewImageField originalDataset={original} previewDataset={modified} name="image_id" label="프로필 이미지" />
      <Components.Fieldset legend="별칭">
        <PreviewTextField originalDataset={original} previewDataset={modified} multiline name="nickname_ko" label="별칭 (한국어)" />
        <PreviewTextField originalDataset={original} previewDataset={modified} multiline name="nickname_en" label="별칭 (영어)" />
      </Components.Fieldset>
    </>
  );
};
