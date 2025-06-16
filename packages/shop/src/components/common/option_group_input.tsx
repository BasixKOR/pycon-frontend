import { CircularProgress, FormControl, InputLabel, MenuItem, Select, TextField, Tooltip } from "@mui/material";
import { Suspense } from "@suspensive/react";
import * as React from "react";
import { Control, Controller, FieldValues } from "react-hook-form";
import * as R from "remeda";

import { PriceDisplay } from "./price_display";
import ShopHooks from "../../hooks";
import ShopSchemas from "../../schemas";
import ShopAPIUtil from "../../utils";

type CommonOptionGroupType = {
  id: string;
  name: string;
};
type SelectableOptionGroupType = CommonOptionGroupType & {
  is_custom_response: false;
  custom_response_pattern: null;
};
type CustomResponseOptionGroupType = CommonOptionGroupType & {
  is_custom_response: true;
  custom_response_pattern: string;
};
type OptionGroupType = SelectableOptionGroupType | CustomResponseOptionGroupType;

type SimplifiedOption = Pick<ShopSchemas.Option, "id" | "name" | "additional_price" | "leftover_stock">;

const isFilledString = (str: unknown): str is string => R.isString(str) && !R.isEmpty(str);

const SelectableOptionGroupInput: React.FC<{
  language: "ko" | "en";
  optionGroup: SelectableOptionGroupType;
  options: SimplifiedOption[];
  defaultValue?: string;
  disabled?: boolean;
  disabledReason?: string;
  control: Control<FieldValues, unknown, FieldValues>;
}> = ({ language, optionGroup, options, defaultValue, disabled, disabledReason, control }) => {
  const optionElements = options.map((option) => {
    const isOptionOutOfStock = R.isNumber(option.leftover_stock) && option.leftover_stock <= 0;

    return (
      <MenuItem key={option.id} value={option.id} disabled={disabled || isOptionOutOfStock}>
        {option.name}
        {option.additional_price > 0 && (
          <>
            {" "}
            [ +<PriceDisplay price={option.additional_price} /> ]
          </>
        )}
        {isOptionOutOfStock && <> ({language === "ko" ? "품절" : "Out of stock"})</>}
      </MenuItem>
    );
  });

  const selectElement = (
    <FormControl fullWidth>
      <InputLabel id={`${optionGroup.id}label`}>{optionGroup.name}</InputLabel>
      <Controller
        control={control}
        name={optionGroup.id}
        rules={{ required: true }}
        disabled={disabled}
        defaultValue={defaultValue || ""}
        render={({ field }) => <Select label={`${optionGroup.id}label`} {...field} children={optionElements} />}
      />
    </FormControl>
  );

  return isFilledString(disabledReason) ? <Tooltip title={disabledReason}>{selectElement}</Tooltip> : selectElement;
};

const CustomResponseOptionGroupInput: React.FC<{
  optionGroup: CustomResponseOptionGroupType;
  defaultValue?: string;
  disabled?: boolean;
  disabledReason?: string;
  control: Control<FieldValues, unknown, FieldValues>;
}> = ({ optionGroup, defaultValue, disabled, disabledReason, control }) => {
  const textFieldElement = (
    <Controller
      control={control}
      name={optionGroup.id}
      rules={{ pattern: ShopAPIUtil.getCustomResponsePattern(optionGroup), required: true }}
      disabled={disabled}
      defaultValue={defaultValue || ""}
      render={({ field, formState: { errors } }) => {
        const errorMessage: string | undefined = errors?.[optionGroup.id]?.message?.toString();
        return <TextField label={optionGroup.name} {...field} error={!!errors[optionGroup.id]} helperText={errorMessage} />;
      }}
    />
  );

  return isFilledString(disabledReason) ? <Tooltip title={disabledReason}>{textFieldElement}</Tooltip> : textFieldElement;
};

export const OptionGroupInput: React.FC<{
  language?: "ko" | "en";
  optionGroup: OptionGroupType;
  options: SimplifiedOption[];

  defaultValue?: string;
  disabled?: boolean;
  disabledReason?: string;

  control: Control<FieldValues, unknown, FieldValues>;
}> = ({ language, optionGroup, options, defaultValue, disabled, disabledReason, control }) =>
  optionGroup.is_custom_response ? (
    <CustomResponseOptionGroupInput
      optionGroup={optionGroup}
      defaultValue={defaultValue}
      disabled={disabled}
      disabledReason={disabledReason}
      control={control}
    />
  ) : (
    <SelectableOptionGroupInput
      language={language || "ko"}
      optionGroup={optionGroup}
      options={options}
      defaultValue={defaultValue}
      disabled={disabled}
      disabledReason={disabledReason}
      control={control}
    />
  );

export const OrderProductRelationOptionInput: React.FC<{
  optionRel: ShopSchemas.OrderProductItem["options"][number];
  disabled?: boolean;
  disabledReason?: string;
  control: Control<FieldValues, unknown, FieldValues>;
}> = Suspense.with({ fallback: <CircularProgress /> }, ({ optionRel, disabled, disabledReason, control }) => {
  const { language } = ShopHooks.useShopContext();
  let defaultValue: string | null = null;
  let guessedDisabledReason: string | undefined = undefined;
  let dummyOptions: {
    id: string;
    name: string;
    additional_price: number;
    leftover_stock: number | null;
  }[] = [];

  // type hinting을 위해 if문을 사용함
  if (optionRel.product_option_group.is_custom_response === false && R.isNonNull(optionRel.product_option)) {
    defaultValue = optionRel.product_option.id;
    guessedDisabledReason =
      language === "ko" ? "추가 비용이 발생하는 옵션은 수정할 수 없어요." : "You cannot modify options that incur additional costs.";
    dummyOptions = [
      {
        id: optionRel.product_option.id,
        name: optionRel.product_option.name,
        additional_price: optionRel.product_option.additional_price || 0,
        leftover_stock: null,
      },
    ];
  } else {
    defaultValue = optionRel.custom_response;
  }

  return (
    <OptionGroupInput
      key={optionRel.product_option_group.id}
      optionGroup={optionRel.product_option_group}
      options={dummyOptions}
      defaultValue={defaultValue || undefined}
      disabled={disabled || !ShopAPIUtil.isOrderProductOptionModifiable(optionRel)}
      disabledReason={disabledReason || guessedDisabledReason}
      control={control}
    />
  );
});
