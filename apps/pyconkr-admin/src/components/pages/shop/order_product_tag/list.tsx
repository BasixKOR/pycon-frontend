import { FC } from "react";

import { AdminList, AdminListColumn } from "@apps/pyconkr-admin/components/layouts/admin_list";

const columns: AdminListColumn[] = [
  { field: "code", header: "코드", width: "25%" },
  { field: "name", header: "이름", width: "40%" },
  { field: "priority", header: "정렬 순서", align: "right" },
];

export const ShopOrderProductTagListPage: FC = () => (
  <AdminList app="shop" resource="orderproductrelationtag" title="SHOP > 주문상품 태그 > 목록" columns={columns} enableRowActions />
);
