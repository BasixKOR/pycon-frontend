import { Stack, TextField, Typography } from "@mui/material";
import * as React from "react";

import { ProductFormValues, SetField } from "../form";

type Props = {
  values: ProductFormValues;
  setField: SetField;
};

type DateTimeFieldKey = "visible_starts_at" | "visible_ends_at" | "orderable_starts_at" | "orderable_ends_at" | "refundable_ends_at";

const dateTimeFieldProps = (values: ProductFormValues, setField: SetField, key: DateTimeFieldKey, label: string) => ({
  label,
  type: "datetime-local" as const,
  value: values[key]?.slice(0, 16) ?? "",
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => setField(key, e.target.value),
  fullWidth: true,
  slotProps: { inputLabel: { shrink: true } },
});

export const TimeSettingsTab: React.FC<Props> = ({ values, setField }) => (
  <Stack spacing={2}>
    <Typography variant="subtitle2" color="text.secondary">
      비워두면 항상 활성으로 처리됩니다.
    </Typography>
    <Stack direction="row" spacing={2}>
      <TextField {...dateTimeFieldProps(values, setField, "visible_starts_at", "노출 시작")} />
      <TextField {...dateTimeFieldProps(values, setField, "visible_ends_at", "노출 종료")} />
    </Stack>
    <Stack direction="row" spacing={2}>
      <TextField {...dateTimeFieldProps(values, setField, "orderable_starts_at", "주문 가능 시작")} />
      <TextField {...dateTimeFieldProps(values, setField, "orderable_ends_at", "주문 가능 종료")} />
    </Stack>
    <TextField {...dateTimeFieldProps(values, setField, "refundable_ends_at", "환불 가능 종료")} />
  </Stack>
);
