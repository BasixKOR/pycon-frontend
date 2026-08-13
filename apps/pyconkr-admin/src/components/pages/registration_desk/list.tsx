import { FC } from "react";

import { AdminList, AdminListColumn } from "@apps/pyconkr-admin/components/layouts/admin_list";

// 백엔드 RegistrationDeskConfig 의 기본값(무제한) 센티널. 그대로 노출하면 오해를 부른다.
const OPEN_START = "0001-01-01";
const OPEN_END = "9999-12-31";

const formatPeriod = (row: Record<string, unknown>) => {
  const start = String(row.start_date ?? "");
  const end = String(row.end_date ?? "");
  return `${start === OPEN_START ? "제한 없음" : start} ~ ${end === OPEN_END ? "제한 없음" : end}`;
};

const columns: AdminListColumn[] = [
  { field: "name", header: "이름", width: "30%" },
  { field: "start_date", header: "적용 기간", width: "25%", render: formatPeriod },
  {
    field: "categories",
    header: "대상 카테고리",
    width: "15%",
    align: "right",
    render: (row) => `${Array.isArray(row.categories) ? row.categories.length : 0}개`,
  },
];

// 생성 시간까지 넣으면 컬럼이 좁아져 헤더가 줄바꿈된다 — 설정은 수정 시간만 있으면 충분하다.
export const RegistrationDeskConfigListPage: FC = () => (
  <AdminList
    app="internal_api"
    resource="registrationdeskconfig"
    title="등록 데스크 > 설정 > 목록"
    columns={columns}
    hideCreatedAt
    enableRowActions
  />
);
