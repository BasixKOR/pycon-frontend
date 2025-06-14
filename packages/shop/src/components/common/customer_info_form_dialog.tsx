import * as Common from "@frontend/common";
import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField } from "@mui/material";
import { Suspense } from "@suspensive/react";
import * as React from "react";

import ShopHooks from "../../hooks";
import ShopSchemas from "../../schemas";

type CustomerInfoFormDialogPropsType = {
  open: boolean;
  closeFunc: () => void;
  onSubmit?: (formData: ShopSchemas.CustomerInfo) => void;
  defaultValue?: ShopSchemas.CustomerInfo | null;
};

export const CustomerInfoFormDialog: React.FC<CustomerInfoFormDialogPropsType> = Suspense.with(
  { fallback: <CircularProgress /> },
  ({ open, closeFunc, onSubmit, defaultValue }) => {
    const formRef = React.useRef<HTMLFormElement | null>(null);

    const { language } = ShopHooks.useShopContext();
    const shopAPIClient = ShopHooks.useShopClient();
    const { data: userInfo } = ShopHooks.useUserStatus(shopAPIClient);

    const onSubmitFunc: React.MouseEventHandler<HTMLButtonElement> = (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (Common.Utils.isFormValid(formRef?.current)) onSubmit?.(Common.Utils.getFormValue<ShopSchemas.CustomerInfo>({ form: formRef.current }));
    };

    const titleStr = language === "ko" ? "고객 정보 입력" : "Customer Information";
    const cancelButtonText = language === "ko" ? "취소" : "Cancel";
    const submitButtonText = language === "ko" ? "결제" : "Proceed to Payment";
    const nameLabelStr = language === "ko" ? "성명" : "Name";
    const organizationLabelStr = language === "ko" ? "소속" : "Organization";
    const emailLabelStr = language === "ko" ? "이메일 주소" : "Email Address";
    const phoneLabelStr =
      language === "ko" ? "전화번호 (예: 010-1234-5678 또는 +821012345678)" : "Phone Number (e.g., 010-1234-5678 or +821012345678)";
    const phoneValidationFailedStr =
      language === "ko"
        ? "전화번호 형식이 올바르지 않습니다. 예: 010-1234-5678 또는 +821012345678"
        : "Invalid phone number format. e.g., 010-1234-5678 or +821012345678";

    return (
      <Dialog open={open} onClose={closeFunc} fullWidth maxWidth="sm">
        <DialogTitle>{titleStr}</DialogTitle>
        <DialogContent>
          <form ref={formRef}>
            <Stack spacing={2} sx={{ py: 2 }}>
              <TextField name="name" label={nameLabelStr} defaultValue={defaultValue?.name} required fullWidth />
              <TextField name="organization" label={organizationLabelStr} defaultValue={defaultValue?.organization} fullWidth />
              <TextField
                name="email"
                label={emailLabelStr}
                defaultValue={defaultValue?.email || userInfo?.data.user.email}
                type="email"
                required
                fullWidth
              />
              <TextField
                name="phone"
                label={phoneLabelStr}
                defaultValue={defaultValue?.phone}
                slotProps={{
                  htmlInput: {
                    pattern: new RegExp(/^(010-\d{4}-\d{4}|(\+82)10\d{7,8})$/, "i").source,
                    title: phoneValidationFailedStr,
                  },
                }}
                fullWidth
                required
              />
            </Stack>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeFunc} color="error" children={cancelButtonText} />
          <Button onClick={onSubmitFunc} children={submitButtonText} />
        </DialogActions>
      </Dialog>
    );
  }
);
