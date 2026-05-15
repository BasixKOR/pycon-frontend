import { FormControl, InputLabel, MenuItem, Pagination, Select, Stack, Typography } from "@mui/material";
import * as React from "react";

type Props = {
  count: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  pageSizeOptions?: number[];
  scrollToTopOnChange?: boolean;
};

const DEFAULT_PAGE_SIZE_OPTIONS = [25, 50, 100, 200];

const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

export const AdminPagination: React.FC<Props> = ({
  count,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
  scrollToTopOnChange = true,
}) => {
  const pageCount = Math.max(1, Math.ceil(count / pageSize));
  const startIdx = count === 0 ? 0 : (page - 1) * pageSize + 1;
  const endIdx = Math.min(page * pageSize, count);

  const handlePageChange = (newPage: number) => {
    onPageChange(newPage);
    if (scrollToTopOnChange) scrollToTop();
  };

  const handlePageSizeChange = (newSize: number) => {
    onPageSizeChange(newSize);
    if (scrollToTopOnChange) scrollToTop();
  };

  return (
    <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between" sx={{ flexWrap: "wrap", py: 1 }}>
      <Typography variant="body2" color="text.secondary">
        {count.toLocaleString()}건 중 {startIdx.toLocaleString()}–{endIdx.toLocaleString()}
      </Typography>
      <Stack direction="row" spacing={2} alignItems="center">
        <Pagination
          count={pageCount}
          page={Math.min(page, pageCount)}
          onChange={(_, p) => handlePageChange(p)}
          showFirstButton
          showLastButton
          size="small"
        />
        <FormControl size="small" sx={{ minWidth: 110 }}>
          <InputLabel id="admin-page-size-label">페이지당</InputLabel>
          <Select labelId="admin-page-size-label" label="페이지당" value={pageSize} onChange={(e) => handlePageSizeChange(Number(e.target.value))}>
            {pageSizeOptions.map((size) => (
              <MenuItem key={size} value={size}>
                {size}개
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>
    </Stack>
  );
};
