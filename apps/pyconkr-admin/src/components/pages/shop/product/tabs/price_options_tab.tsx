import { Checkbox, Divider, FormControlLabel, Stack, TextField } from "@mui/material";
import * as React from "react";

import { ProductFormValues, SetField } from "../form";

type Props = {
  values: ProductFormValues;
  setField: SetField;
};

export const PriceOptionsTab: React.FC<Props> = ({ values, setField }) => (
  <Stack spacing={2}>
    <Stack direction="row" spacing={2}>
      <TextField label="가격 (₩)" type="number" required value={values.price} onChange={(e) => setField("price", e.target.value)} fullWidth />
      <TextField
        label="재고 (0 = 무한대)"
        type="number"
        required
        value={values.stock}
        onChange={(e) => setField("stock", e.target.value)}
        fullWidth
      />
      <TextField
        label="사용자당 최대 수량 (0 = 제한 없음)"
        type="number"
        value={values.max_quantity_per_user}
        onChange={(e) => setField("max_quantity_per_user", e.target.value)}
        fullWidth
      />
      <TextField label="우선순위" type="number" value={values.priority} onChange={(e) => setField("priority", e.target.value)} fullWidth />
    </Stack>
    <Divider />
    <FormControlLabel
      control={<Checkbox checked={values.donation_allowed} onChange={(e) => setField("donation_allowed", e.target.checked)} />}
      label="기부 허용"
    />
    {values.donation_allowed && (
      <Stack direction="row" spacing={2}>
        <TextField
          label="기부 최소 금액"
          type="number"
          value={values.donation_min_price}
          onChange={(e) => setField("donation_min_price", e.target.value)}
          fullWidth
        />
        <TextField
          label="기부 최대 금액"
          type="number"
          value={values.donation_max_price}
          onChange={(e) => setField("donation_max_price", e.target.value)}
          fullWidth
        />
      </Stack>
    )}
  </Stack>
);
