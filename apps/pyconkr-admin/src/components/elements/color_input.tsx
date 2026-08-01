import { isHexColor } from "@frontend/common/utils";
import { Clear } from "@mui/icons-material";
import { IconButton, Stack, styled, TextField, Tooltip } from "@mui/material";
import { FC, FocusEventHandler } from "react";

/** 미지정 상태에서 색상 선택기를 열었을 때의 시작 색상. 값으로 저장되지는 않는다. */
const PICKER_START_COLOR = "#3498db";

/** 네이티브 색상 입력은 "값 없음"을 표현할 수 없어, 스와치를 직접 그리고 입력은 뒤에 숨긴다. */
const Swatch = styled("label", { shouldForwardProp: (prop) => prop !== "color" && prop !== "disabled" })<{ color?: string; disabled?: boolean }>(
  ({ theme, color, disabled }) => ({
    position: "relative",
    flexShrink: 0,
    width: "3.5rem",
    height: "3.5rem",
    borderRadius: theme.shape.borderRadius,
    border: `1px solid ${theme.palette.divider}`,
    cursor: disabled ? "default" : "pointer",
    opacity: disabled ? theme.palette.action.disabledOpacity : 1,
    overflow: "hidden",
    // 미지정은 대각선 사선으로 표시 — 검정을 고른 상태와 구분한다.
    background: color
      ? color
      : `linear-gradient(to top right, transparent calc(50% - 1px), ${theme.palette.text.disabled}, transparent calc(50% + 1px)), ${theme.palette.action.hover}`,

    "& input": {
      position: "absolute",
      width: 0,
      height: 0,
      opacity: 0,
      border: 0,
      padding: 0,
    },
  })
);

export type ColorInputProps = {
  id?: string;
  label?: string;
  value: string | null;
  required?: boolean;
  disabled?: boolean;
  error?: boolean;
  helperText?: string;
  autoFocus?: boolean;
  onChange: (value: string | null) => void;
  onBlur?: FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  onFocus?: FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>;
};

/** 스와치 색상 선택기 + #RRGGBB 직접 입력. 미지정은 빈 문자열이 아니라 null 로 전달한다. */
export const ColorInput: FC<ColorInputProps> = ({
  id,
  label,
  value,
  required,
  disabled,
  error,
  helperText,
  autoFocus,
  onChange,
  onBlur,
  onFocus,
}) => {
  const selectedColor = isHexColor(value) ? value : undefined;
  const handleChange = (newValue: string) => onChange(newValue === "" ? null : newValue);

  return (
    <Stack direction="row" spacing={1} alignItems="flex-start" sx={{ width: "100%" }}>
      <Tooltip title={selectedColor ?? "색상 미지정"}>
        <Swatch color={selectedColor} disabled={disabled}>
          <input
            type="color"
            value={selectedColor ?? PICKER_START_COLOR}
            disabled={disabled}
            onChange={(e) => handleChange(e.target.value)}
            aria-label={`${label ?? "색상"} 선택기`}
          />
        </Swatch>
      </Tooltip>
      <TextField
        id={id}
        label={label}
        value={value ?? ""}
        required={required}
        disabled={disabled}
        error={error}
        helperText={helperText}
        placeholder="#RRGGBB (비워두면 기본색)"
        autoFocus={autoFocus}
        onChange={(e) => handleChange(e.target.value)}
        onBlur={onBlur}
        onFocus={onFocus}
        slotProps={{ inputLabel: { shrink: true } }}
        sx={{ flexGrow: 1 }}
      />
      <Tooltip title="색상 비우기">
        <span>
          <IconButton onClick={() => onChange(null)} disabled={disabled || !value} sx={{ mt: 1 }}>
            <Clear />
          </IconButton>
        </span>
      </Tooltip>
    </Stack>
  );
};
