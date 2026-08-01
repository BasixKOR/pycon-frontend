import { WidgetProps } from "@rjsf/utils";
import { FC } from "react";

import { ColorInput } from "@apps/pyconkr-admin/components/elements/color_input";

export const ColorPickerWidget: FC<WidgetProps> = (props) => {
  const { id, value, label, schema, required, disabled, readonly, rawErrors, onChange, onBlur, onFocus } = props;

  return (
    <ColorInput
      id={id}
      label={label || schema.title}
      value={value ?? null}
      required={required}
      disabled={disabled || readonly}
      error={(rawErrors?.length ?? 0) > 0}
      onChange={onChange}
      onBlur={(e) => onBlur(id, e.target.value)}
      onFocus={(e) => onFocus(id, e.target.value)}
    />
  );
};
