import { useBackendAdminClient, useChoicesQuery, useListQuery, useOpenApiSchemaQuery } from "@frontend/common/src/hooks/useAdminAPI";
import { extractQueryParameters } from "@frontend/common/src/utils";
import { Add } from "@mui/icons-material";
import { Box, Button, CircularProgress, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import { ErrorBoundary, Suspense } from "@suspensive/react";
import * as React from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

import { AdminListFilter } from "../elements/admin_list_filter";
import { BackendAdminSignInGuard } from "../elements/admin_signin_guard";
import { ErrorFallback } from "../elements/error_fallback";

type AdminListProps = {
  app: string;
  resource: string;
  hideCreatedAt?: boolean;
  hideUpdatedAt?: boolean;
  hideCreateNew?: boolean;
};

type ListRowType = {
  id: string;
  str_repr: string;
  created_at: string;
  updated_at: string;
};

const InnerAdminList: React.FC<AdminListProps> = ErrorBoundary.with(
  { fallback: ErrorFallback },
  Suspense.with({ fallback: <CircularProgress /> }, ({ app, resource, hideCreatedAt, hideUpdatedAt, hideCreateNew }) => {
    const navigate = useNavigate();

    const [searchParams, setSearchParams] = useSearchParams();
    const backendAdminClient = useBackendAdminClient();

    const filterParams: Record<string, string> = Object.fromEntries(searchParams.entries());
    const listQuery = useListQuery<ListRowType>(backendAdminClient, app, resource, filterParams);

    const openApiSchemaQuery = useOpenApiSchemaQuery(backendAdminClient);
    const queryParameters = React.useMemo(
      () => extractQueryParameters(openApiSchemaQuery.data, app, resource),
      [openApiSchemaQuery.data, app, resource]
    );

    const choicesQuery = useChoicesQuery(backendAdminClient, app, resource);

    const handleFilterApply = (newParams: Record<string, string>) => setSearchParams(newParams, { replace: true });

    return (
      <Stack sx={{ flexGrow: 1, width: "100%", minHeight: "100%" }}>
        <Typography variant="h5">
          {app.toUpperCase()} &gt; {resource.toUpperCase()} &gt; 목록
        </Typography>
        <br />
        <AdminListFilter parameters={queryParameters} values={filterParams} choices={choicesQuery.data} onApply={handleFilterApply} />
        <Box>
          {!hideCreateNew && (
            <Button variant="contained" onClick={() => navigate(`/${app}/${resource}/create`)} startIcon={<Add />}>
              새 객체 추가
            </Button>
          )}
        </Box>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: "25%" }}>ID</TableCell>
              <TableCell sx={{ width: "40%" }}>이름</TableCell>
              {hideCreatedAt === true && <TableCell sx={{ width: "17.5%" }}>생성 시간</TableCell>}
              {hideUpdatedAt === true && <TableCell sx={{ width: "17.5%" }}>수정 시간</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {listQuery.data?.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <Link to={`/${app}/${resource}/${item.id}`}>{item.id}</Link>
                </TableCell>
                <TableCell>
                  <Link to={`/${app}/${resource}/${item.id}`}>{item.str_repr}</Link>
                </TableCell>
                {!hideCreatedAt && <TableCell>{new Date(item.created_at).toLocaleString()}</TableCell>}
                {!hideUpdatedAt && <TableCell>{new Date(item.updated_at).toLocaleString()}</TableCell>}
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
