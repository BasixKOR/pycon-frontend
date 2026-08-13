import { useAssignOrderProductTagMutation, useBackendAdminClient, useListAllQuery } from "@frontend/common/hooks/useAdminAPI";
import { OrderProductTagAssignAction, OrderProductTagSchema } from "@frontend/common/schemas/backendAdminAPI";
import { Add } from "@mui/icons-material";
import { Button, Chip, CircularProgress, Menu, MenuItem, Stack, Typography } from "@mui/material";
import { ErrorBoundary, Suspense } from "@suspensive/react";
import { FC, useState } from "react";

import { ErrorFallback } from "@apps/pyconkr-admin/components/elements/error_fallback";
import { SimpleOrderProductRelation } from "@apps/pyconkr-admin/components/pages/shop/order/types";
import { addErrorSnackbar, addSnackbar } from "@apps/pyconkr-admin/utils/snackbar";

const ACTION_LABEL: Record<OrderProductTagAssignAction, string> = { assign: "부착", unassign: "해제" };

const OrderProductTagsBody: FC<{ relation: SimpleOrderProductRelation }> = ({ relation }) => {
  const client = useBackendAdminClient();
  const assignMutation = useAssignOrderProductTagMutation(client);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  // 부착 가능한 태그 목록은 행마다 같으므로 react-query 가 같은 키로 한 번만 조회한다.
  const allTags = useListAllQuery<OrderProductTagSchema>(client, "shop", "orderproductrelationtag").data;
  const assignedIds = new Set(relation.tags.map((t) => t.id));
  const addableTags = allTags.filter((t) => !assignedIds.has(t.id));

  const run = (tag: { id: string; name: string }, action: OrderProductTagAssignAction) => {
    setAnchorEl(null);
    assignMutation.mutate(
      { tagId: tag.id, action, params: { id: relation.id } },
      {
        onSuccess: () => addSnackbar(`«${tag.name}» 태그를 ${ACTION_LABEL[action]}했습니다.`, "success"),
        onError: addErrorSnackbar,
      }
    );
  };

  return (
    <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
      {relation.tags.length === 0 && (
        <Typography variant="body2" color="text.secondary">
          태그 없음
        </Typography>
      )}
      {relation.tags.map((tag) => (
        <Chip
          key={tag.id}
          size="small"
          color="info"
          label={`${tag.name} (${tag.code})`}
          disabled={assignMutation.isPending}
          onDelete={() => run(tag, "unassign")}
        />
      ))}
      <Button
        size="small"
        startIcon={<Add />}
        disabled={addableTags.length === 0 || assignMutation.isPending}
        onClick={(e) => setAnchorEl(e.currentTarget)}
      >
        태그 부착
      </Button>
      <Menu open={!!anchorEl} anchorEl={anchorEl} onClose={() => setAnchorEl(null)}>
        {addableTags.map((tag) => (
          <MenuItem key={tag.id} onClick={() => run(tag, "assign")}>
            {tag.name} ({tag.code})
          </MenuItem>
        ))}
      </Menu>
    </Stack>
  );
};

/** 주문 상품 1건의 태그 부착/해제. 대상은 filterset 의 `id` 로 이 상품 하나만 지목한다. */
export const OrderProductTags: FC<{ relation: SimpleOrderProductRelation }> = ({ relation }) => (
  // 태그 목록 조회가 실패하거나 늦어도 환불/알림 등 나머지 주문 상세는 그대로 쓸 수 있어야 한다.
  <ErrorBoundary fallback={ErrorFallback}>
    <Suspense fallback={<CircularProgress size={20} />}>
      <OrderProductTagsBody relation={relation} />
    </Suspense>
  </ErrorBoundary>
);
