import * as Common from "@frontend/common";
import { Add } from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { ErrorBoundary, Suspense } from "@suspensive/react";
import * as React from "react";
import { Link, useNavigate } from "react-router-dom";

import { BackendAdminSignInGuard } from "../elements/admin_signin_guard";

type AdminListProps = {
  app: string;
  resource: string;
};

type ListRowType = {
  id: string;
  str_repr: string;
  created_at: string;
  updated_at: string;
};

const InnerAdminList: React.FC<AdminListProps> = ErrorBoundary.with(
  { fallback: Common.Components.ErrorFallback },
  Suspense.with({ fallback: <CircularProgress /> }, ({ app, resource }) => {
    const navigate = useNavigate();
    const backendAdminClient =
      Common.Hooks.BackendAdminAPI.useBackendAdminClient();
    const listQuery = Common.Hooks.BackendAdminAPI.useListQuery<ListRowType>(
      backendAdminClient,
      app,
      resource
    );

    return (
      <Stack sx={{ flexGrow: 1, width: "100%", minHeight: "100%" }}>
        <Typography variant="h5">
          {app.toUpperCase()} &gt; {resource.toUpperCase()} &gt; 목록
        </Typography>
        <br />
        <Box>
          <Button
            variant="contained"
            onClick={() => navigate(`/${app}/${resource}/create`)}
            startIcon={<Add />}
          >
            새 객체 추가
          </Button>
        </Box>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: "25%" }}>ID</TableCell>
              <TableCell sx={{ width: "40%" }}>이름</TableCell>
              <TableCell sx={{ width: "17.5%" }}>생성 시간</TableCell>
              <TableCell sx={{ width: "17.5%" }}>수정 시간</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {listQuery.data?.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <Link to={`/${app}/${resource}/${item.id}`}>{item.id}</Link>
                </TableCell>
                <TableCell>
                  <Link to={`/${app}/${resource}/${item.id}`}>
                    {item.str_repr}
                  </Link>
                </TableCell>
                <TableCell>
                  {new Date(item.created_at).toLocaleString()}
                </TableCell>
                <TableCell>
                  {new Date(item.updated_at).toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Stack>
    );
  })
);

export const AdminList: React.FC<AdminListProps> = (props) => (
  <BackendAdminSignInGuard>
    <InnerAdminList {...props} />
  </BackendAdminSignInGuard>
);
