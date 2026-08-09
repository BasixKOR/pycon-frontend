import {
  useBackendAdminClient,
  useListAllQuery,
  usePreviewOrderNotificationMutation,
  useRenderOrderNotificationMutation,
  useSendOrderNotificationMutation,
} from "@frontend/common/hooks/useAdminAPI";
import {
  NotificationChannelValue,
  NotificationTemplateSchema,
  OrderNotificationRequestSchema,
  OrderNotificationTarget,
} from "@frontend/common/schemas/backendAdminAPI";
import { Send, Visibility } from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Checkbox,
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
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { ErrorBoundary, Suspense } from "@suspensive/react";
import { FC, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { ChoicePicker } from "@apps/pyconkr-admin/components/elements/choice_picker";
import { ErrorFallback } from "@apps/pyconkr-admin/components/elements/error_fallback";
import { CHANNEL_BY_VALUE, NOTIFICATION_CHANNELS, NotificationChannel } from "@apps/pyconkr-admin/components/pages/notification/channels";
import { ORDER_PRODUCT_STATUS_LABEL } from "@apps/pyconkr-admin/components/pages/shop/_common/status_labels";
import { OrderProductStatus } from "@apps/pyconkr-admin/components/pages/shop/order/types";
import { addErrorSnackbar, addSnackbar } from "@apps/pyconkr-admin/utils/snackbar";

const PREVIEW_ROW_LIMIT = 20;

type SendMode = {
  target: OrderNotificationTarget;
  label: string;
  description: string;
};

const SEND_MODES: SendMode[] = [
  {
    target: "order-notifications",
    label: "주문 단위",
    description: "주문 1건당 알림 1건. 수신자는 주문자이고 QR 은 주문 QR 입니다. 구매/결제/환불 안내에 씁니다.",
  },
  {
    target: "order-product-notifications",
    label: "상품 단위",
    description: "상품(티켓) 1건당 알림 1건. 수신자는 참가자(티켓 정보 우선, 없으면 주문자)이고 QR 은 상품 QR 입니다.",
  },
];

// 백엔드 queryset 이 PURCHASED_OR_REFUNDED_STATUS 로 미리 좁히므로 pending 은 애초에 대상이 아니다.
const SELECTABLE_OPR_STATUSES: OrderProductStatus[] = ["paid", "used", "refunded"];

// 상품 단위 filterset(OrderProductRelationAdminFilterSet)은 주문 filterset 과 키가 다르다.
// `status` 는 양쪽에 다 있지만 의미가 다르다 — 주문에선 결제 상태, 상품에선 상품 상태(pending/paid/used/refunded).
// django-filter 는 모르는 키를 조용히 무시하므로, 넘길 키를 명시한 allowlist 로 둔다.
// 주문 목록에 필터가 새로 생겨도 여기 없으면 자동으로 dropped 에 잡혀 경고로 노출된다 (대상이 몰래 넓어지지 않음).
const ORDER_PRODUCT_PARAM_BY_ORDER_PARAM: Record<string, string> = {
  id: "order_id",
  user_id: "user_id",
  user_unique_id: "user_unique_id",
  name: "name",
  email: "email",
  imp_id: "imp_id",
  status: "order_status",
  first_paid_at_after: "first_paid_at_after",
  first_paid_at_before: "first_paid_at_before",
  product_id: "product_id",
  category_id: "category_id",
  category_group_id: "category_group_id",
  event_id: "event_id",
  // price_min/max 는 의도적으로 제외 — 주문에선 주문 총액, 상품에선 상품 단가라 뜻이 달라 그대로 넘기면 안 된다.
};

type ProductFilterState = {
  productIds: (string | number)[];
  statuses: OrderProductStatus[];
  ticketOnly: boolean;
};

const EMPTY_PRODUCT_FILTER: ProductFilterState = { productIds: [], statuses: [], ticketOnly: false };

/** 발송 대상 범위. 호출 위치(목록 / 주문 상세 / 주문 상품 행)마다 지정할 수 있는 범위가 다르다. */
export type OrderNotificationScope =
  | { kind: "orderFilter"; params: Record<string, string> }
  | { kind: "order"; orderId: string }
  | { kind: "orderProduct"; orderProductId: string };

const SCOPE_TITLE: Record<OrderNotificationScope["kind"], string> = {
  orderFilter: "필터된 주문에 알림 발송",
  order: "이 주문에 알림 발송",
  orderProduct: "이 주문 상품에 알림 발송",
};

// 특정 상품 1건을 지목한 경우엔 주문 단위 발송이 의미가 없다 (수신자가 주문자로 바뀌어 버린다).
const modesForScope = (kind: OrderNotificationScope["kind"]): SendMode[] => (kind === "orderProduct" ? [SEND_MODES[1]] : SEND_MODES);

const productFilterParams = (productFilter: ProductFilterState): Record<string, string> => ({
  ...(productFilter.productIds.length ? { product_id: productFilter.productIds.join(",") } : {}),
  ...(productFilter.statuses.length ? { status: productFilter.statuses.join(",") } : {}),
  ...(productFilter.ticketOnly ? { is_ticket: "true" } : {}),
});

/** scope + 발송 단위 → 실제로 보낼 query params. `dropped` 는 상품 filterset 이 지원하지 않아 무시된 주문 필터 키. */
const buildRequestParams = (
  scope: OrderNotificationScope,
  target: OrderNotificationTarget,
  productFilter: ProductFilterState
): { params: Record<string, string>; dropped: string[] } => {
  const isProductTarget = target === "order-product-notifications";

  switch (scope.kind) {
    case "orderProduct":
      return { params: { id: scope.orderProductId }, dropped: [] };
    case "order":
      return {
        params: isProductTarget ? { order_id: scope.orderId, ...productFilterParams(productFilter) } : { id: scope.orderId },
        dropped: [],
      };
    case "orderFilter": {
      if (!isProductTarget) return { params: scope.params, dropped: [] };
      const params: Record<string, string> = {};
      const dropped: string[] = [];
      for (const [key, value] of Object.entries(scope.params)) {
        const mappedKey = ORDER_PRODUCT_PARAM_BY_ORDER_PARAM[key];
        if (mappedKey) params[mappedKey] = value;
        else dropped.push(key);
      }
      return { params: { ...params, ...productFilterParams(productFilter) }, dropped };
    }
  }
};

type NotificationDialogBodyProps = {
  scope: OrderNotificationScope;
  onClose: () => void;
};

const TargetSummary: FC<{ params: Record<string, string>; dropped: string[]; description: string }> = ({ params, dropped, description }) => {
  const entries = Object.entries(params);
  return (
    <Stack spacing={1}>
      <Typography variant="body2" color="text.secondary">
        {description} 결제까지 간 주문만 대상이며 <strong>환불된 주문도 포함</strong>됩니다 (환불 안내 발송용). 미결제/장바구니 주문은 제외됩니다.
      </Typography>
      <Stack direction="row" flexWrap="wrap" sx={{ gap: 0.5 }}>
        {entries.length === 0 ? (
          <Chip size="small" color="warning" label="필터 없음 — 발송 가능한 전체 대상" />
        ) : (
          entries.map(([key, value]) => <Chip key={key} size="small" label={`${key}: ${value}`} />)
        )}
      </Stack>
      {dropped.length > 0 && (
        <Alert severity="warning">
          상품 단위 발송은 다음 필터를 지원하지 않아 무시됩니다: {dropped.join(", ")}. 그만큼 대상이 넓어지니 미리보기로 꼭 확인해주세요.
        </Alert>
      )}
    </Stack>
  );
};

type ProductFilterFieldsProps = {
  value: ProductFilterState;
  onChange: (next: ProductFilterState) => void;
};

// ChoicePicker 는 caption 라벨을 컨트롤 위에 그리고 Select 는 라벨을 테두리에 얹기 때문에 두 컨트롤의 높이가 다르다.
// 아래쪽 기준(flex-end)으로 맞추고 체크박스도 컨트롤 높이(small = 40px)에 고정해 세 필드의 밑선을 일치시킨다.
const FILTER_CONTROL_HEIGHT = 40;

const ProductFilterFields: FC<ProductFilterFieldsProps> = ({ value, onChange }) => (
  <Stack spacing={1}>
    <Typography variant="caption" color="text.secondary">
      주문 목록에서 적용한 필터에 더해 상품 조건으로 좁힙니다.
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
        <InputLabel id="order-noti-opr-status">상품 상태</InputLabel>
        <Select
          labelId="order-noti-opr-status"
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

// ErrorBoundary.with() 대신 명명 컴포넌트 + 인라인 경계 — HMR 시 입력 필드가 detach 되는 것을 막는다.
const NotificationDialogBody: FC<NotificationDialogBodyProps> = ({ scope, onClose }) => {
  const client = useBackendAdminClient();
  const navigate = useNavigate();

  const [modeIndex, setModeIndex] = useState(0);
  const [channel, setChannel] = useState<NotificationChannel>(NOTIFICATION_CHANNELS[0]);
  const [templateId, setTemplateId] = useState<string>("");
  const [contextOverride, setContextOverride] = useState<Record<string, string>>({});
  const [productFilter, setProductFilter] = useState<ProductFilterState>(EMPTY_PRODUCT_FILTER);

  const modes = modesForScope(scope.kind);
  const mode = modes[modeIndex];
  // 이미 상품 1건을 지목한 scope 에서는 상품 하위 필터가 의미 없다.
  const showProductFilter = mode.target === "order-product-notifications" && scope.kind !== "orderProduct";

  const previewMutation = usePreviewOrderNotificationMutation(client, mode.target);
  const renderMutation = useRenderOrderNotificationMutation(client, mode.target);
  const sendMutation = useSendOrderNotificationMutation(client, mode.target);

  // 페이지네이션 없이 전부 — page_size 를 고정하면 그 수를 넘긴 템플릿이 조용히 목록에서 빠진다.
  const templates = useListAllQuery<NotificationTemplateSchema>(client, channel.app, channel.templateResource).data;
  const selectedTemplate = templates.find((t) => t.id === templateId) ?? null;

  const { params: requestParams, dropped } = buildRequestParams(scope, mode.target, productFilter);

  const preview = previewMutation.data;

  // 미리보기 결과에서 변수별 누락 건수를 집계 — 어떤 변수를 추가로 채워야 하는지 한눈에 보여준다.
  const missingCountByVariable = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const r of preview?.recipients ?? []) for (const v of r.missing_variables) counts[v] = (counts[v] ?? 0) + 1;
    return counts;
  }, [preview]);

  const hasMissing = Object.keys(missingCountByVariable).length > 0;
  const recipientCount = preview?.recipients.length ?? 0;

  const buildPayload = (): OrderNotificationRequestSchema => ({
    channel: channel.value,
    template_id: templateId,
    // 빈 값은 보내지 않는다 — 주문에서 자동으로 채워지는 값을 빈 문자열로 덮어쓰지 않기 위함.
    context_override: Object.fromEntries(Object.entries(contextOverride).filter(([, v]) => v.trim())),
  });

  // 조건이 바뀌면 이전 미리보기 결과는 무효 — 발송 전 재확인을 강제한다.
  const resetResults = () => {
    previewMutation.reset();
    renderMutation.reset();
  };

  const handleModeChange = (index: number) => {
    setModeIndex(index);
    setProductFilter(EMPTY_PRODUCT_FILTER);
    resetResults();
  };

  const handleProductFilterChange = (next: ProductFilterState) => {
    setProductFilter(next);
    resetResults();
  };

  const handleTemplateChange = (value: string) => {
    setTemplateId(value);
    setContextOverride({});
    resetResults();
  };

  const handleChannelChange = (value: NotificationChannelValue) => {
    setChannel(CHANNEL_BY_VALUE[value]);
    handleTemplateChange("");
  };

  const handlePreview = () => {
    const args = { params: requestParams, data: buildPayload() };
    previewMutation.mutate(args, { onError: addErrorSnackbar });
    // 렌더 미리보기는 첫 대상 기준이라 실패해도 발송 판단에는 영향이 없다 — 스낵바 대신 조용히 실패시킨다.
    renderMutation.mutate(args);
  };

  const handleSend = () =>
    sendMutation.mutate(
      { params: requestParams, data: buildPayload() },
      {
        onSuccess: (result) => {
          addSnackbar(`${recipientCount}건의 발송을 요청했습니다.`, "success");
          onClose();
          navigate(`/${channel.app}/${channel.historyResource}/${result.id}`);
        },
        onError: addErrorSnackbar,
      }
    );

  const sendBlockMessage = ((): string | null => {
    if (!templateId) return "템플릿을 선택해주세요";
    if (!preview) return "먼저 미리보기로 대상을 확인해주세요";
    if (recipientCount === 0) return "발송 대상이 0건입니다";
    if (hasMissing) return "채워지지 않은 템플릿 변수가 있습니다";
    return null;
  })();

  return (
    <>
      {/* 발송 단위가 하나뿐인 scope 에서는 탭을 감춘다. */}
      {modes.length > 1 && (
        <Tabs value={modeIndex} onChange={(_, v) => handleModeChange(v)} sx={{ px: 3, borderBottom: 1, borderColor: "divider" }}>
          {modes.map((m) => (
            <Tab key={m.target} label={m.label} />
          ))}
        </Tabs>
      )}
      <DialogContent dividers>
        <Stack spacing={2}>
          <TargetSummary params={requestParams} dropped={dropped} description={mode.description} />

          {showProductFilter && <ProductFilterFields value={productFilter} onChange={handleProductFilterChange} />}

          <Divider />

          <Stack direction="row" spacing={2}>
            <FormControl size="small" sx={{ minWidth: 160 }}>
              <InputLabel id="order-noti-channel">채널</InputLabel>
              <Select labelId="order-noti-channel" label="채널" value={channel.value} onChange={(e) => handleChannelChange(e.target.value)}>
                {NOTIFICATION_CHANNELS.map((c) => (
                  <MenuItem key={c.value} value={c.value}>
                    {c.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl size="small" fullWidth>
              <InputLabel id="order-noti-template">템플릿</InputLabel>
              <Select labelId="order-noti-template" label="템플릿" value={templateId} onChange={(e) => handleTemplateChange(e.target.value)}>
                {templates.map((t) => (
                  <MenuItem key={t.id} value={t.id}>
                    {t.str_repr}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>

          {/* 좌: 템플릿 변수 입력 / 우: 렌더 미리보기 */}
          <Stack direction="row" spacing={2} alignItems="stretch">
            <Stack spacing={1} sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="subtitle2">템플릿 변수</Typography>
              {!selectedTemplate ? (
                <Typography variant="body2" color="text.secondary">
                  템플릿을 선택해주세요.
                </Typography>
              ) : selectedTemplate.template_variables.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  이 템플릿은 변수가 없습니다.
                </Typography>
              ) : (
                <>
                  <Typography variant="body2" color="text.secondary">
                    비워두면 주문·상품 데이터에서 수신자별로 자동으로 채워집니다. 값을 입력하면 모든 수신자가 그 값을 받습니다.
                  </Typography>
                  {selectedTemplate.template_variables.map((name) => {
                    const missing = missingCountByVariable[name];
                    const overridden = !!contextOverride[name]?.trim();
                    return (
                      <TextField
                        key={name}
                        size="small"
                        label={name}
                        value={contextOverride[name] ?? ""}
                        onChange={(e) => setContextOverride((p) => ({ ...p, [name]: e.target.value }))}
                        error={!!missing}
                        color={overridden ? "warning" : undefined}
                        focused={overridden || undefined}
                        helperText={
                          missing
                            ? `${missing}건에서 이 변수를 채우지 못했습니다 — 값을 직접 입력해주세요.`
                            : overridden
                              ? "모든 수신자에게 이 값이 동일하게 적용됩니다."
                              : undefined
                        }
                        fullWidth
                      />
                    );
                  })}
                </>
              )}
            </Stack>

            <Stack spacing={1} sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="subtitle2">템플릿 미리보기</Typography>
              {renderMutation.isPending ? (
                <CircularProgress size={20} />
              ) : renderMutation.data ? (
                <iframe
                  srcDoc={renderMutation.data}
                  style={{ width: "100%", height: "100%", minHeight: 480, border: "1px solid #ccc", borderRadius: 4 }}
                  title="알림 렌더 미리보기"
                />
              ) : (
                <Typography variant="body2" color="text.secondary">
                  {renderMutation.isError ? "렌더 미리보기를 불러오지 못했습니다." : "미리보기를 누르면 첫 대상 기준으로 렌더한 결과가 표시됩니다."}
                </Typography>
              )}
            </Stack>
          </Stack>

          {preview && (
            <>
              <Divider />
              {recipientCount === 0 ? (
                <Alert severity="warning">발송 대상이 없습니다. 필터 조건 또는 수신자 연락처 유무를 확인해주세요.</Alert>
              ) : (
                <Box>
                  <Alert severity={hasMissing ? "error" : "success"}>
                    수신자 {recipientCount}건{hasMissing ? " — 아래 변수가 비어 있어 발송할 수 없습니다." : " — 발송할 수 있습니다."}
                  </Alert>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    상위 {Math.min(recipientCount, PREVIEW_ROW_LIMIT)}건 미리보기
                  </Typography>
                  <TableContainer sx={{ maxHeight: 320 }}>
                    <Table stickyHeader size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ width: "25%" }}>수신자</TableCell>
                          <TableCell>context</TableCell>
                          <TableCell sx={{ width: "15%" }}>누락 변수</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {/* 상품 단위는 같은 수신자가 여러 번 나오므로 dedupe_key(OPR id) 를 우선 사용. */}
                        {preview.recipients.slice(0, PREVIEW_ROW_LIMIT).map((r) => (
                          <TableRow key={r.dedupe_key || r.recipient}>
                            <TableCell>{r.recipient}</TableCell>
                            <TableCell sx={{ wordBreak: "break-all" }}>
                              <Typography variant="caption" component="code">
                                {JSON.stringify(r.context)}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              {r.missing_variables.length === 0
                                ? "—"
                                : r.missing_variables.map((v) => <Chip key={v} size="small" color="error" label={v} />)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              )}
            </>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          취소
        </Button>
        <Button variant="outlined" startIcon={<Visibility />} onClick={handlePreview} disabled={!templateId || previewMutation.isPending}>
          {previewMutation.isPending ? "확인 중…" : "미리보기"}
        </Button>
        <Tooltip title={sendBlockMessage ?? ""}>
          <span>
            <Button variant="contained" startIcon={<Send />} onClick={handleSend} disabled={!!sendBlockMessage || sendMutation.isPending}>
              {sendMutation.isPending ? "발송 중…" : `발송${recipientCount ? ` (${recipientCount})` : ""}`}
            </Button>
          </span>
        </Tooltip>
      </DialogActions>
    </>
  );
};

// 호출부가 열릴 때만 마운트한다 (매번 폼 상태를 새로 시작) — 그래서 open 은 항상 true.
export const OrderNotificationDialog: FC<{ scope: OrderNotificationScope; onClose: () => void }> = ({ scope, onClose }) => (
  <Dialog open onClose={onClose} maxWidth={false} fullWidth>
    <DialogTitle>{SCOPE_TITLE[scope.kind]}</DialogTitle>
    <ErrorBoundary fallback={ErrorFallback}>
      <Suspense fallback={<CircularProgress sx={{ m: 4, alignSelf: "center" }} />}>
        <NotificationDialogBody scope={scope} onClose={onClose} />
      </Suspense>
    </ErrorBoundary>
  </Dialog>
);
