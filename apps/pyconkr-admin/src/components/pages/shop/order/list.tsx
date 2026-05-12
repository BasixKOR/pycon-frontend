import { useBackendAdminClient, useListPaginatedQuery } from "@frontend/common/src/hooks/useAdminAPI";
import {
  Chip,
  CircularProgress,
  MenuItem,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { ErrorBoundary, Suspense } from "@suspensive/react";
import * as React from "react";
import { Link, useSearchParams } from "react-router-dom";

import { OrderAdmin, PaymentStatus } from "./types";
import { AdminPagination } from "../../../elements/admin_pagination";
import { BackendAdminSignInGuard } from "../../../elements/admin_signin_guard";
import { ErrorFallback } from "../../../elements/error_fallback";
import { PAYMENT_STATUS_LABEL } from "../_common/status_labels";

const formatPrice = (price: number) => `₩${price.toLocaleString()}`;

type StatusFilter = "all" | PaymentStatus;

const InnerOrderList: React.FC = ErrorBoundary.with(
  { fallback: ErrorFallback },
  Suspense.with({ fallback: <CircularProgress /> }, () => {
    const client = useBackendAdminClient();
    const [searchParams, setSearchParams] = useSearchParams();

    const nameQuery = searchParams.get("name") ?? "";
    const emailQuery = searchParams.get("email") ?? "";
    const impIdQuery = searchParams.get("imp_id") ?? "";
    const statusQuery = (searchParams.get("status") ?? "all") as StatusFilter;
    const page = Number(searchParams.get("page") ?? 1);
    const pageSize = Number(searchParams.get("page_size") ?? 50);

    const apiParams: Record<string, string> = { page: String(page), page_size: String(pageSize) };
    if (nameQuery.trim()) apiParams.name = nameQuery.trim();
    if (emailQuery.trim()) apiParams.email = emailQuery.trim();
    if (impIdQuery.trim()) apiParams.imp_id = impIdQuery.trim();
    if (statusQuery !== "all") apiParams.status = statusQuery;

    const ordersQuery = useListPaginatedQuery<OrderAdmin>(client, "shop", "orders", apiParams);
    const { count = 0, results: orders = [] } = ordersQuery.data ?? {};

    const updateFilterParam = (key: string, value: string) => {
      const next = new URLSearchParams(searchParams);
      if (value) next.set(key, value);
      else next.delete(key);
      next.delete("page");
      setSearchParams(next, { replace: true });
    };

    const setPage = (p: number) => {
      const next = new URLSearchParams(searchParams);
      if (p <= 1) next.delete("page");
      else next.set("page", String(p));
      setSearchParams(next, { replace: true });
    };

    const setPageSize = (size: number) => {
      const next = new URLSearchParams(searchParams);
      next.set("page_size", String(size));
      next.delete("page");
      setSearchParams(next, { replace: true });
    };

    return (
      <Stack sx={{ flexGrow: 1, width: "100%", minHeight: "100%" }} spacing={2}>
        <Typography variant="h5">SHOP &gt; ORDERS &gt; 목록</Typography>

        <Stack direction="row" spacing={2} flexWrap="wrap" alignItems="center">
          <TextField
            size="small"
            label="이름 검색 (사용자/고객)"
            value={nameQuery}
            onChange={(e) => updateFilterParam("name", e.target.value)}
            sx={{ minWidth: 220 }}
          />
          <TextField
            size="small"
            label="이메일 검색"
            value={emailQuery}
            onChange={(e) => updateFilterParam("email", e.target.value)}
            sx={{ minWidth: 220 }}
          />
          <TextField
            size="small"
            label="PortOne imp_id"
            value={impIdQuery}
            onChange={(e) => updateFilterParam("imp_id", e.target.value)}
            sx={{ minWidth: 200 }}
          />
          <Select
            size="small"
            value={statusQuery}
            onChange={(e) => updateFilterParam("status", e.target.value === "all" ? "" : (e.target.value as string))}
            sx={{ minWidth: 140 }}
          >
            <MenuItem value="all">전체 상태</MenuItem>
            <MenuItem value="pending">대기</MenuItem>
            <MenuItem value="completed">완료</MenuItem>
            <MenuItem value="partial_refunded">부분환불</MenuItem>
            <MenuItem value="refunded">환불</MenuItem>
          </Select>
        </Stack>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: "12%" }}>주문 ID</TableCell>
              <TableCell>사용자</TableCell>
              <TableCell>이름</TableCell>
              <TableCell>상태</TableCell>
              <TableCell align="right">결제액</TableCell>
              <TableCell>결제일</TableCell>
              <TableCell>생성일</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ color: "text.secondary" }}>
                  조건에 맞는 주문이 없습니다.
                </TableCell>
              </TableRow>
            )}
            {orders.map((order) => {
              const status = PAYMENT_STATUS_LABEL[order.current_status] ?? { label: order.current_status, color: "default" as const };
              return (
                <TableRow key={order.id} hover>
                  <TableCell>
                    <Link to={`/shop/orders/${order.id}`}>
                      <code>{order.id.slice(0, 8)}</code>
                    </Link>
                  </TableCell>
                  <TableCell>{order.user?.email ?? "—"}</TableCell>
                  <TableCell>{order.name_ko || order.str_repr}</TableCell>
                  <TableCell>
                    <Chip label={status.label} size="small" color={status.color} />
                  </TableCell>
                  <TableCell align="right">{formatPrice(order.current_paid_price)}</TableCell>
                  <TableCell>{order.first_paid_at ? new Date(order.first_paid_at).toLocaleString() : "—"}</TableCell>
                  <TableCell>{new Date(order.created_at).toLocaleString()}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        <AdminPagination count={count} page={page} pageSize={pageSize} onPageChange={setPage} onPageSizeChange={setPageSize} />
      </Stack>
    );
  })
);

export const ShopOrderListPage: React.FC = () => (
  <BackendAdminSignInGuard>
    <InnerOrderList />
  </BackendAdminSignInGuard>
);
