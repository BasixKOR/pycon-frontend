import {
  Box,
  Checkbox,
  CircularProgress,
  FormControl,
  FormControlLabel,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import { Suspense } from "@suspensive/react";
import { FC } from "react";

import { ChoicePicker } from "@apps/pyconkr-admin/components/elements/choice_picker";
import { ORDER_PRODUCT_STATUS_LABEL } from "@apps/pyconkr-admin/components/pages/shop/_common/status_labels";
import { ProductFilterState, SELECTABLE_OPR_STATUSES } from "@apps/pyconkr-admin/components/pages/shop/order/order_product_filters";
import { OrderProductStatus } from "@apps/pyconkr-admin/components/pages/shop/order/types";

// ChoicePicker 는 caption 라벨을 컨트롤 위에 그리고 Select 는 라벨을 테두리에 얹기 때문에 두 컨트롤의 높이가 다르다.
// 아래쪽 기준(flex-end)으로 맞추고 체크박스도 컨트롤 높이(small = 40px)에 고정해 세 필드의 밑선을 일치시킨다.
const FILTER_CONTROL_HEIGHT = 40;

type ProductFilterFieldsProps = {
  value: ProductFilterState;
  onChange: (next: ProductFilterState) => void;
  description?: string;
};

export const ProductFilterFields: FC<ProductFilterFieldsProps> = ({ value, onChange, description }) => (
  <Stack spacing={1}>
    <Typography variant="caption" color="text.secondary">
      {description ?? "주문 목록에서 적용한 필터에 더해 상품 조건으로 좁힙니다."}
    </Typography>
    <Stack direction="row" spacing={2} alignItems="flex-end" flexWrap="wrap" useFlexGap>
      <Box sx={{ flex: 1, minWidth: 280 }}>
        {/* selectables 를 suspense 로 조회하므로 자체 경계가 필요 — 없으면 다이얼로그 전체가 fallback 으로 교체된다.
            fallback 도 같은 높이를 차지해야 로딩 완료 시 옆 필드들이 밀리지 않는다. */}
        <Suspense
          fallback={
            <Box sx={{ height: FILTER_CONTROL_HEIGHT, display: "flex", alignItems: "center" }}>
              <CircularProgress size={20} />
            </Box>
          }
        >
          <ChoicePicker
            multiple
            label="상품"
            source={{ app: "shop", resource: "product" }}
            value={value.productIds}
            onChange={(productIds) => onChange({ ...value, productIds })}
          />
        </Suspense>
      </Box>
      <FormControl size="small" sx={{ minWidth: 200 }}>
        <InputLabel id="opr-filter-status">상품 상태</InputLabel>
        <Select
          labelId="opr-filter-status"
          multiple
          input={<OutlinedInput label="상품 상태" />}
          value={value.statuses}
          onChange={(e) => onChange({ ...value, statuses: e.target.value as OrderProductStatus[] })}
          renderValue={(selected) => selected.map((s) => ORDER_PRODUCT_STATUS_LABEL[s].label).join(", ") || "전체"}
        >
          {SELECTABLE_OPR_STATUSES.map((s) => (
            <MenuItem key={s} value={s}>
              <Checkbox size="small" checked={value.statuses.includes(s)} />
              <ListItemText primary={ORDER_PRODUCT_STATUS_LABEL[s].label} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControlLabel
        sx={{ height: FILTER_CONTROL_HEIGHT, mr: 0 }}
        control={<Checkbox size="small" checked={value.ticketOnly} onChange={(e) => onChange({ ...value, ticketOnly: e.target.checked })} />}
        label="티켓 상품만"
        slotProps={{ typography: { variant: "body2" } }}
      />
    </Stack>
  </Stack>
);
