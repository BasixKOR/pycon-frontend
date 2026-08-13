import { Alert } from "@mui/material";
import { FC } from "react";
import { useParams } from "react-router-dom";

import { AdminEditor } from "@apps/pyconkr-admin/components/layouts/admin_editor";

export const ShopOrderProductTagEditorPage: FC = () => {
  const { id } = useParams<{ id?: string }>();
  return (
    <AdminEditor app="shop" resource="orderproductrelationtag" id={id}>
      <Alert severity="warning" sx={{ my: 2 }}>
        code 는 등록 데스크(ROSA) 인쇄 템플릿의 매핑 키입니다. 이미 쓰이고 있는 태그의 code 를 바꾸면 해당 템플릿 매핑이 끊어지니, 새 태그를 만들어
        쓰세요. priority 는 등록 데스크에서의 표시 순서입니다 (작을수록 먼저).
      </Alert>
    </AdminEditor>
  );
};
