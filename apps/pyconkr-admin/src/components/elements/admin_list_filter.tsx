import { ChoicesResponse, OpenAPIParameterSchema } from "@frontend/common/schemas/backendAdminAPI";
import { Add, Clear, FilterList, RestartAlt } from "@mui/icons-material";
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Chip,
  FormControl,
  FormControlLabel,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Switch,
  TextField,
} from "@mui/material";
import { FC, useEffect, useMemo, useState } from "react";

import { AdminFilterFieldset } from "@apps/pyconkr-admin/components/elements/admin_filter_fieldset";

// django-filter range/lookup suffixes — params sharing a root after stripping these belong together
// (e.g. date_joined_after + date_joined_before → "date_joined", price_min + price_max → "price").
const RANGE_SUFFIXES = ["_after", "_before", "_min", "_max", "_gte", "_lte"];
const SINGLETON_GROUP_LABEL = "기타";

const getGroupKey = (name: string): string => {
  for (const suffix of RANGE_SUFFIXES) {
    if (name.endsWith(suffix) && name.length > suffix.length) return name.slice(0, -suffix.length);
  }
  // Fall back to the first underscore segment — groups user/user_email/user_username under "user",
  // category/category_group/category_id under "category", etc.
  const firstUnderscore = name.indexOf("_");
  return firstUnderscore === -1 ? name : name.slice(0, firstUnderscore);
};

type FilterGroup = { label: string; params: OpenAPIParameterSchema[] };

const groupParameters = (parameters: OpenAPIParameterSchema[]): FilterGroup[] => {
  const groups = new Map<string, OpenAPIParameterSchema[]>();
  for (const param of parameters) {
    const key = getGroupKey(param.name);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(param);
  }

  const multi: FilterGroup[] = [];
  const singletons: OpenAPIParameterSchema[] = [];
  for (const [key, params] of groups) {
    if (params.length >= 2) multi.push({ label: key, params });
    else singletons.push(...params);
  }
  if (singletons.length > 0) multi.push({ label: SINGLETON_GROUP_LABEL, params: singletons });
  return multi;
};
type AdminListFilterProps = {
  parameters: OpenAPIParameterSchema[];
  values: Record<string, string>;
  choices?: ChoicesResponse;
  onApply: (values: Record<string, string>) => void;
};

export const AdminListFilter: FC<AdminListFilterProps> = ({ parameters, values, choices, onApply }) => {
  const [localValues, setLocalValues] = useState<Record<string, string>>(values);
  const groupedParameters = useMemo(() => groupParameters(parameters), [parameters]);

  useEffect(() => {
    setLocalValues(values);
  }, [values]);

  const handleChange = (name: string, value: string) => {
    setLocalValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleApply = () => {
    const cleaned = Object.fromEntries(Object.entries(localValues).filter(([, v]) => v !== ""));
    onApply(cleaned);
  };

  const handleClear = () => {
    setLocalValues({});
    onApply({});
  };

  if (parameters.length === 0) return null;

  return (
    <Box sx={{ mb: 2 }}>
      <Stack spacing={2} sx={{ p: 2, border: 1, borderColor: "divider", borderRadius: 1 }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <FilterList fontSize="small" />
          <span>필터</span>
        </Stack>
        <Stack direction="row" flexWrap="wrap" sx={{ gap: 2, alignItems: "flex-start" }}>
          {groupedParameters.map((group) => (
            <AdminFilterFieldset key={group.label} label={group.label}>
              {group.params.map((param) => (
                <FilterField
                  key={param.name}
                  param={param}
                  value={localValues[param.name] || ""}
                  choices={choices?.[param.name]}
                  onChange={handleChange}
                />
              ))}
            </AdminFilterFieldset>
          ))}
        </Stack>
        <Stack direction="row" spacing={1}>
          <Button variant="outlined" onClick={handleApply} size="small">
            적용
          </Button>
          <Button variant="text" onClick={handleClear} size="small" startIcon={<RestartAlt />}>
            초기화
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};

type ChoiceItem = { const: string | null; title: string };

type FilterFieldProps = {
  param: OpenAPIParameterSchema;
  value: string;
  choices?: ChoiceItem[];
  onChange: (name: string, value: string) => void;
};

const FilterField: FC<FilterFieldProps> = ({ param, value, choices, onChange }) => {
  const { name, schema, description } = param;

  if (schema?.type === "array") return <ArrayFilterField name={name} items={schema.items} value={value} onChange={onChange} />;
  if (schema?.enum) return <EnumFilterField name={name} options={schema.enum} value={value} onChange={onChange} />;
  if (schema?.type === "boolean") return <BooleanFilterField name={name} value={value} onChange={onChange} />;
  if (schema?.type === "string" && (schema?.format === "date-time" || schema?.format === "date")) {
    return <DateFilterField name={name} format={schema.format} value={value} onChange={onChange} />;
  }

  if (choices && choices.length > 0) {
    const options = choices.map((c) => ({ value: c.const ?? "", label: c.title }));
    const currentOption = options.find((opt) => opt.value === value) ?? null;
    return (
      <Autocomplete
        size="small"
        sx={{ minWidth: 200 }}
        options={options}
        value={currentOption}
        onChange={(_, newOption) => onChange(name, newOption?.value ?? "")}
        getOptionLabel={(opt) => opt.label || String(opt.value)}
        isOptionEqualToValue={(opt, val) => opt.value === val.value}
        renderInput={(params) => <TextField {...params} label={name} placeholder="전체" />}
      />
    );
  }

  const inputType = schema?.type === "integer" || schema?.type === "number" ? "number" : "text";
  const helperText = schema?.format === "uuid" ? "UUID" : description || undefined;

  return (
    <TextField
      label={name}
      value={value}
      onChange={(e) => onChange(name, e.target.value)}
      size="small"
      type={inputType}
      helperText={helperText}
      sx={{ minWidth: 200 }}
    />
  );
};

type DateFilterFieldProps = {
  name: string;
  format: "date" | "date-time";
  value: string;
  onChange: (name: string, value: string) => void;
};

// HTML5 datetime-local / date inputs expect specific local formats. Backend values may include seconds
// or a timezone (e.g. "2024-01-15T10:30:00Z") — trim to the first 16 chars so the input still displays.
const normalizeDateValue = (value: string, format: "date" | "date-time"): string => {
  if (!value) return "";
  if (format === "date") return value.slice(0, 10);
  const m = value.match(/^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2})/);
  return m ? m[1] : value;
};

const DateFilterField: FC<DateFilterFieldProps> = ({ name, format, value, onChange }) => (
  <TextField
    label={name}
    type={format === "date" ? "date" : "datetime-local"}
    value={normalizeDateValue(value, format)}
    onChange={(e) => onChange(name, e.target.value)}
    size="small"
    slotProps={{ inputLabel: { shrink: true } }}
    sx={{ minWidth: 200 }}
  />
);

type BooleanFilterFieldProps = {
  name: string;
  value: string;
  onChange: (name: string, value: string) => void;
};

const BooleanFilterField: FC<BooleanFilterFieldProps> = ({ name, value, onChange }) => {
  const active = value === "true" || value === "false";
  const isTrue = value === "true";
  return (
    <Stack direction="row" alignItems="center" spacing={1}>
      <FormControlLabel
        control={<Checkbox size="small" checked={active} onChange={(e) => onChange(name, e.target.checked ? "true" : "")} />}
        label={name}
      />
      {active && (
        <FormControlLabel
          control={<Switch size="small" checked={isTrue} onChange={(e) => onChange(name, e.target.checked ? "true" : "false")} />}
          label={isTrue ? "true" : "false"}
        />
      )}
    </Stack>
  );
};

type EnumFilterFieldProps = {
  name: string;
  options: string[];
  value: string;
  onChange: (name: string, value: string) => void;
};

const EnumFilterField: FC<EnumFilterFieldProps> = ({ name, options, value, onChange }) => {
  const selectedValues = value ? value.split(",") : [];

  const handleChange = (newValues: string | string[]) => {
    const arr = typeof newValues === "string" ? newValues.split(",") : newValues;
    onChange(name, arr.filter((v) => v !== "").join(","));
  };

  return (
    <FormControl size="small" sx={{ minWidth: 200 }}>
      <InputLabel>{name}</InputLabel>
      <Select
        multiple
        value={selectedValues}
        label={name}
        onChange={(e) => handleChange(e.target.value)}
        renderValue={(selected) => (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
            {selected.map((v) => (
              <Chip key={v} label={v} size="small" />
            ))}
          </Box>
        )}
      >
        {options.map((opt) => (
          <MenuItem key={opt} value={opt}>
            {opt}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

type ArrayFilterFieldProps = {
  name: string;
  items?: { type?: string; enum?: string[] };
  value: string;
  onChange: (name: string, value: string) => void;
};

const ArrayFilterField: FC<ArrayFilterFieldProps> = ({ name, items, value, onChange }) => {
  const [values, setValues] = useState<string[]>(value ? value.split(",") : []);
  useEffect(() => {
    setValues((prev) => {
      const prevNonEmpty = prev.filter((v) => v !== "").join(",");
      // Ignore re-emissions of our own non-empty subset; only resync on external changes (clear, etc.)
      if (prevNonEmpty === (value ?? "")) return prev;
      return value ? value.split(",") : [];
    });
  }, [value]);

  const update = (newValues: string[]) => {
    setValues(newValues);
    onChange(name, newValues.filter((v) => v !== "").join(","));
  };
  const handleAdd = () => update([...values, ""]);
  const handleRemove = (index: number) => update(values.filter((_, i) => i !== index));

  const handleItemChange = (index: number, newValue: string) => {
    const newValues = [...values];
    newValues[index] = newValue;
    update(newValues);
  };

  const inputType = items?.type === "integer" || items?.type === "number" ? "number" : "text";

  return (
    <Box sx={{ minWidth: 200 }}>
      <Stack spacing={1}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <InputLabel sx={{ fontSize: "0.875rem" }}>{name}</InputLabel>
          <IconButton size="small" onClick={handleAdd}>
            <Add fontSize="small" />
          </IconButton>
        </Stack>
        {values.map((v, index) => (
          <Stack key={index} direction="row" spacing={0.5} alignItems="center">
            {items?.enum ? (
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <Select value={v} onChange={(e) => handleItemChange(index, e.target.value as string)} displayEmpty>
                  <MenuItem value="">
                    <em>선택</em>
                  </MenuItem>
                  {items.enum.map((opt) => (
                    <MenuItem key={opt} value={opt}>
                      {opt}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ) : (
              <TextField value={v} onChange={(e) => handleItemChange(index, e.target.value)} size="small" type={inputType} sx={{ minWidth: 150 }} />
            )}
            <IconButton size="small" onClick={() => handleRemove(index)}>
              <Clear fontSize="small" />
            </IconButton>
          </Stack>
        ))}
      </Stack>
    </Box>
  );
};
