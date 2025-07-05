import * as Common from "@frontend/common";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Stack,
  styled,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  TextFieldProps,
  Typography,
} from "@mui/material";
import * as React from "react";

type SharedPreviewFieldProps = {
  originalDataset: Record<string, unknown>;
  previewDataset: Record<string, unknown>;
  name: string;
  label: string;
};

type PreviewFieldProps = Omit<TextFieldProps, "value" | "name" | "label"> & SharedPreviewFieldProps;

export const PreviewTextField: React.FC<PreviewFieldProps> = ({ originalDataset, previewDataset, name, ...props }) => {
  const textFieldSx: TextFieldProps["sx"] = {
    "& .MuiInputBase-input, & .Mui-disabled": {
      color: "black",
      WebkitTextFillColor: "black",
      "-webkit-text-fill-color": "black",
    },
  };
  const textFieldProps: TextFieldProps = {
    fullWidth: true,
    disabled: true,
    variant: "outlined",
    value: previewDataset[name] || "(값 없음)",
    sx: textFieldSx,
    ...props,
  };
  const modifiedTextFieldProps: TextFieldProps = { ...textFieldProps, sx: { ...textFieldSx, backgroundColor: "rgba(255, 255, 0, 0.1)" } };
  const originalTextFieldProps: TextFieldProps = { ...textFieldProps, sx: { ...textFieldSx, backgroundColor: "rgba(0, 64, 64, 0.1)" } };
  const isModified = originalDataset[name] !== previewDataset[name];

  return originalDataset[name] === previewDataset[name] ? (
    <TextField {...textFieldProps} sx={{ ...textFieldSx, my: 1 }} />
  ) : (
    <Box sx={{ my: 1 }}>
      <Accordion>
        <AccordionSummary>
          <Stack sx={{ width: "100%" }} direction="column" alignItems="flex-start" justifyContent="space-between">
            <TextField {...(isModified ? modifiedTextFieldProps : textFieldProps)} />
            <Typography variant="caption">기존 값을 보려면 여기를 클릭해주세요.</Typography>
          </Stack>
        </AccordionSummary>
        <AccordionDetails>
          <TextField {...originalTextFieldProps} value={originalDataset[name] || "(값 없음)"} />
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export const PreviewMarkdownField: React.FC<SharedPreviewFieldProps> = ({ originalDataset, previewDataset, name, label }) => {
  return originalDataset[name] === previewDataset[name] ? (
    <Common.Components.Fieldset legend={label} style={{ width: "100%" }}>
      <Box sx={{ width: "100%", color: "black", "& .markdown-body": { width: "100%" } }}>
        <Common.Components.MDXRenderer format="md" text={(previewDataset[name] as string) || "(값 없음)"} />
      </Box>
    </Common.Components.Fieldset>
  ) : (
    <Box sx={{ my: 1 }}>
      <Accordion>
        <AccordionSummary>
          <Stack sx={{ width: "100%" }} direction="column" alignItems="flex-start" justifyContent="space-between">
            <Common.Components.Fieldset legend={label} style={{ width: "100%", backgroundColor: "rgba(255, 255, 0, 0.1)" }}>
              <Box sx={{ width: "100%", color: "black", "& .markdown-body": { width: "100%" } }}>
                <Common.Components.MDXRenderer format="md" text={(previewDataset[name] as string) || "(값 없음)"} />
              </Box>
            </Common.Components.Fieldset>
            <Typography variant="caption">기존 값을 보려면 여기를 클릭해주세요.</Typography>
          </Stack>
        </AccordionSummary>
        <AccordionDetails>
          <Common.Components.Fieldset legend={label} style={{ backgroundColor: "rgba(0, 64, 64, 0.1)" }}>
            <Box sx={{ flexGrow: 1, color: "black", "& .markdown-body": { width: "100%" } }}>
              <Common.Components.MDXRenderer format="md" text={(originalDataset[name] as string) || "(값 없음)"} />
            </Box>
          </Common.Components.Fieldset>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

const ImageFallback: React.FC = () => (
  <Stack sx={{ width: "100%", height: "100%", alignItems: "center", justifyContent: "center" }}>
    <Typography variant="caption" color="textSecondary" children="이미지를 불러오는 중 문제가 발생했습니다." />
  </Stack>
);

const WidthSpecifiedFallbackImage = styled(Common.Components.FallbackImage)({
  maxWidth: "20rem",
  objectFit: "cover",
});

export const PreviewImageField: React.FC<SharedPreviewFieldProps> = ({ originalDataset, previewDataset, name, label }) => {
  const originalImage = originalDataset[name] as string;
  const previewImage = previewDataset[name] as string;

  return originalImage === previewImage ? (
    <Common.Components.Fieldset legend={label} style={{ width: "100%" }}>
      <WidthSpecifiedFallbackImage src={previewImage} alt={label} errorFallback={<ImageFallback />} />
    </Common.Components.Fieldset>
  ) : (
    <Box sx={{ my: 1 }}>
      <Accordion>
        <AccordionSummary>
          <Stack sx={{ width: "100%" }} direction="column" alignItems="flex-start" justifyContent="space-between">
            <Common.Components.Fieldset legend={label} style={{ width: "100%", backgroundColor: "rgba(255, 255, 0, 0.1)" }}>
              <WidthSpecifiedFallbackImage src={previewImage} alt={label} errorFallback={<ImageFallback />} />
            </Common.Components.Fieldset>
            <Typography variant="caption">기존 이미지를 보려면 여기를 클릭해주세요.</Typography>
          </Stack>
        </AccordionSummary>
        <AccordionDetails>
          <Common.Components.Fieldset legend={label} style={{ backgroundColor: "rgba(0, 64, 64, 0.1)" }}>
            <WidthSpecifiedFallbackImage src={originalImage} alt={label} errorFallback={<ImageFallback />} />
          </Common.Components.Fieldset>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

type SimplifiedModificationAudit = {
  id: string;
  created_at: string;
  created_by: string;
  status: string;
};

export const ModificationAuditProperties: React.FC<{ audit: SimplifiedModificationAudit }> = ({ audit }) => (
  <Table>
    <TableHead>
      <TableRow>
        <TableCell>속성</TableCell>
        <TableCell>값</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      <TableRow>
        <TableCell>심사 ID</TableCell>
        <TableCell>{audit.id}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell>심사 요청 시간</TableCell>
        <TableCell>{new Date(audit.created_at).toLocaleString()}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell>심사 요청자</TableCell>
        <TableCell>{audit.created_by}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell>심사 상태</TableCell>
        <TableCell>{audit.status}</TableCell>
      </TableRow>
    </TableBody>
  </Table>
);
