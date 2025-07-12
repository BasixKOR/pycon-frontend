import * as Common from "@frontend/common";
import { CircularProgress, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import { ErrorBoundary, Suspense } from "@suspensive/react";
import * as React from "react";
import { Link } from "react-router-dom";

import { BackendAdminSignInGuard } from "../../elements/admin_signin_guard";

type ListRowType = {
  id: string;
  status: "approved" | "rejected" | "requested" | "cancelled";
  str_repr: string;
  created_at: string;
  updated_at: string;
};

const InnerAdminModificationAuditList: React.FC = ErrorBoundary.with(
  { fallback: Common.Components.ErrorFallback },
  Suspense.with({ fallback: <CircularProgress /> }, () => {
    const backendAdminClient = Common.Hooks.BackendAdminAPI.useBackendAdminClient();
    const listQuery = Common.Hooks.BackendAdminAPI.useListQuery<ListRowType>(backendAdminClient, "modification-audit", "modification-audit");

    return (
      <Stack sx={{ flexGrow: 1, width: "100%", minHeight: "100%" }}>
        <Typography variant="h5" children="수정 심사 목록" />
        <br />
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: "25%" }}>ID</TableCell>
              <TableCell sx={{ width: "17.5%" }}>상태</TableCell>
              <TableCell sx={{ width: "40%" }}>이름</TableCell>
              <TableCell sx={{ width: "17.5%" }}>요청 시각</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {listQuery.data?.map((item) => {
              const link = `/modification-audit/modification-audit/${item.id}`;
              const isRequested = item.status === "requested";
              return (
                <TableRow key={item.id}>
                  <TableCell children={<Link to={link} children={item.id} />} />
                  <TableCell>
                    <Typography variant="body2" fontWeight={isRequested ? 700 : 400} color={isRequested ? "primary" : "textSecondary"}>
                      {item.status}
                    </Typography>
                  </TableCell>
                  <TableCell children={<Link to={link} children={item.str_repr} />} />
                  <TableCell>{new Date(item.created_at).toLocaleString()}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Stack>
    );
  })
);

export const AdminModificationAuditList: React.FC = () => (
  <BackendAdminSignInGuard>
    <InnerAdminModificationAuditList />
  </BackendAdminSignInGuard>
);
