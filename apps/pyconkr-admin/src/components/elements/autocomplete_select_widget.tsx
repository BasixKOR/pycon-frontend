import { Autocomplete, TextField } from "@mui/material";
import { EnumOptionsType, WidgetProps } from "@rjsf/utils";
import { FC, useMemo } from "react";

type FormContextWithChoices = {
  choicesData?: Record<string, { const: string; title?: string }[]>;
};

export const AutocompleteSelectWidget: FC<WidgetProps> = (props) => {
  const { id, value, label, schema, required, disabled, readonly, autofocus, placeholder, options, onChange, onBlur, onFocus, formContext } = props;

  // RJSF strips uiSchema enumOptions when the schema has no enum/oneOf, so we read choices from
  // formContext and rebuild enumOptions here. fieldName is derived from the RJSF id (root_<fieldName>).
  const enumOptions = useMemo<EnumOptionsType[]>(() => {
    const fromRjsf = options.enumOptions as EnumOptionsType[] | undefined;
    if (fromRjsf && fromRjsf.length > 0) return fromRjsf;
    const fieldName = id.replace(/^root_/, "");
    const items = (formContext as FormContextWithChoices | undefined)?.choicesData?.[fieldName];
    if (!items) return [];
    const coerceToNumber = schema.type === "integer" || schema.type === "number";
    return items.map((i) => ({ value: coerceToNumber ? Number(i.const) : i.const, label: i.title || String(i.const) }));
  }, [options.enumOptions, formContext, id, schema.type]);

  const currentOption = enumOptions.find((opt) => opt.value === value) ?? null;

  return (
    <Autocomplete
      id={id}
      value={currentOption}
      options={enumOptions}
      getOptionLabel={(opt) => opt.label || String(opt.value)}
      isOptionEqualToValue={(opt, val) => opt.value === val.value}
      onChange={(_, newOption) => onChange(newOption?.value ?? undefined)}
      onBlur={() => onBlur(id, value)}
      onFocus={() => onFocus(id, value)}
      disabled={disabled || readonly}
      disableClearable={required}
      autoHighlight
      fullWidth
      renderInput={(params) => (
        <TextField {...params} label={label || schema.title} required={required} placeholder={placeholder} autoFocus={autofocus} />
      )}
    />
  );
};
