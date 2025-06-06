import { Button } from "@mui/material";

import { useAppContext } from "../../../contexts/app_context";

export default function LoginButton() {
  const { language } = useAppContext();

  return (
    <Button variant="text" sx={(theme) => ({ color: theme.palette.primary.dark })}>
      {language === "ko" ? "로그인" : "LOG IN"}
    </Button>
  );
}
