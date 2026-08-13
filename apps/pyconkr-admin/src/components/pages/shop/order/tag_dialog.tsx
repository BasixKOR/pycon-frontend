import { useAssignOrderProductTagMutation, useBackendAdminClient, useListAllQuery } from "@frontend/common/hooks/useAdminAPI";
import { OrderProductTagAssignAction, OrderProductTagSchema } from "@frontend/common/schemas/backendAdminAPI";
import { LocalOffer } from "@mui/icons-material";
import {
  Alert,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { ErrorBoundary, Suspense } from "@suspensive/react";
import { FC, useState } from "react";

import { ErrorFallback } from "@apps/pyconkr-admin/components/elements/error_fallback";
import {
  EMPTY_PRODUCT_FILTER,
  ProductFilterState,
  productFilterParams,
  toOrderProductParams,
} from "@apps/pyconkr-admin/components/pages/shop/order/order_product_filters";
import { ProductFilterFields } from "@apps/pyconkr-admin/components/pages/shop/order/product_filter_fields";
import { addErrorSnackbar, addSnackbar } from "@apps/pyconkr-admin/utils/snackbar";

const ACTION_LABEL: Record<OrderProductTagAssignAction, string> = { assign: "부착", unassign: "해제" };

// ErrorBoundary.with() 대신 명명 컴포넌트 + 인라인 경계 — HMR 시 입력 필드가 detach 되는 것을 막는다.
const OrderProductTagDialogBody: FC<{ orderParams: Record<string, string>; onClose: () => void }> = ({ orderParams, onClose }) => {
  const client = useBackendAdminClient();
  const [tagId, setTagId] = useState("");
  const [action, setAction] = useState<OrderProductTagAssignAction>("assign");
  const [productFilter, setProductFilter] = useState<ProductFilterState>(EMPTY_PRODUCT_FILTER);

  const tags = useListAllQuery<OrderProductTagSchema>(client, "shop", "orderproductrelationtag").data;
  const assignMutation = useAssignOrderProductTagMutation(client);

  const { params: mappedParams, dropped } = toOrderProductParams(orderParams);
  const requestParams = { ...mappedParams, ...productFilterParams(productFilter) };
  const entries = Object.entries(requestParams);
  const selectedTag = tags.find((t) => t.id === tagId) ?? null;

  // 백엔드도 조건 없는 요청을 400 으로 막지만, 여기서 먼저 막아야 왜 안 되는지가 보인다.
  const blockMessage = !tagId ? "태그를 선택해주세요" : entries.length === 0 ? "대상을 좁힐 조회 조건이 하나 이상 필요합니다" : null;

  const handleSubmit = () => {
    if (!selectedTag) return;
    const summary = entries.map(([k, v]) => `  · ${k}: ${v}`).join("\n");
    if (!window.confirm(`아래 조건의 주문 상품에 «${selectedTag.name}» 태그를 ${ACTION_LABEL[action]}합니다.\n\n${summary}`)) return;

    assignMutation.mutate(
      { tagId: selectedTag.id, action, params: requestParams },
      {
        onSuccess: ({ affected }) => {
          addSnackbar(`${affected}건의 주문 상품에 태그를 ${ACTION_LABEL[action]}했습니다.`, "success");
          onClose();
        },
        onError: addErrorSnackbar,
      }
    );
  };

  return (
    <>
      <DialogContent dividers>
        <Stack spacing={2}>
          <Typography variant="body2" color="text.secondary">
            태그는 등록 데스크에서 어떤 배지·인쇄물을 낼지 고르는 기준입니다. 아래 조건에 걸린 주문 상품 전부가 한 번에 바뀝니다.
          </Typography>
          <Stack direction="row" flexWrap="wrap" sx={{ gap: 0.5 }}>
            {entries.length === 0 ? (
              <Chip size="small" color="warning" label="조건 없음 — 조건을 하나 이상 지정해주세요" />
            ) : (
              entries.map(([key, value]) => <Chip key={key} size="small" label={`${key}: ${value}`} />)
            )}
          </Stack>
          {dropped.length > 0 && (
            <Alert severity="warning">
              상품 단위 filterset 이 지원하지 않아 무시되는 주문 필터가 있습니다: {dropped.join(", ")}. 그만큼 대상이 넓어집니다.
            </Alert>
          )}

          <ProductFilterFields value={productFilter} onChange={setProductFilter} />

          <Divider />

          <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap" useFlexGap>
            <FormControl size="small" sx={{ minWidth: 260 }}>
              <InputLabel id="order-product-tag">태그</InputLabel>
              <Select labelId="order-product-tag" label="태그" value={tagId} onChange={(e) => setTagId(e.target.value)}>
                {tags.map((t) => (
                  <MenuItem key={t.id} value={t.id}>
                    {t.name} ({t.code})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <RadioGroup row value={action} onChange={(e) => setAction(e.target.value as OrderProductTagAssignAction)}>
              <FormControlLabel value="assign" control={<Radio size="small" />} label="부착" />
              <FormControlLabel value="unassign" control={<Radio size="small" />} label="해제" />
            </RadioGroup>
          </Stack>
          {tags.length === 0 && <Alert severity="info">등록된 주문상품 태그가 없습니다. 스토어 &gt; 주문상품 태그에서 먼저 만들어주세요.</Alert>}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          취소
        </Button>
        {/* disabled 버튼은 포인터 이벤트를 받지 않아 span 으로 감싸야 툴팁이 뜬다. */}
        <Tooltip title={blockMessage ?? ""}>
          <span>
            <Button variant="contained" startIcon={<LocalOffer />} onClick={handleSubmit} disabled={!!blockMessage || assignMutation.isPending}>
              {assignMutation.isPending ? "처리 중…" : `${ACTION_LABEL[action]} 실행`}
            </Button>
          </span>
        </Tooltip>
      </DialogActions>
    </>
  );
};

// 호출부가 열릴 때만 마운트한다 (매번 폼 상태를 새로 시작) — 그래서 open 은 항상 true.
export const OrderProductTagDialog: FC<{ orderParams: Record<string, string>; onClose: () => void }> = ({ orderParams, onClose }) => (
  <Dialog open onClose={onClose} maxWidth="md" fullWidth>
    <DialogTitle>필터된 주문 상품에 태그 부착 / 해제</DialogTitle>
    <ErrorBoundary fallback={ErrorFallback}>
      <Suspense fallback={<CircularProgress sx={{ m: 4, alignSelf: "center" }} />}>
        <OrderProductTagDialogBody orderParams={orderParams} onClose={onClose} />
      </Suspense>
    </ErrorBoundary>
  </Dialog>
);
