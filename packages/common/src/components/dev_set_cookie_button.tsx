import { Button } from "@mui/material";
import { FC, PropsWithChildren } from "react";
import { flushSync } from "react-dom";
import { createRoot } from "react-dom/client";

export const DevSetCookieButton: FC<
  PropsWithChildren<{
    backendDomain: string;
    cookieName: string;
    cookieValue: string;
  }>
> = ({ backendDomain, cookieName, cookieValue, children }) => {
  const handleClick = () => {
    if (!backendDomain || !cookieName || !cookieValue) {
      alert(
        "dev cookie sync: backendDomain/cookieName/cookieValue 중 비어 있는 값이 있습니다. (페이지를 잠시 둘러본 뒤 다시 시도하면 cookie 값이 확보될 수 있습니다.)"
      );
      return;
    }
    const container = document.createElement("div");
    document.body.appendChild(container);
    const root = createRoot(container);
    flushSync(() =>
      root.render(
        <form method="POST" action={`${backendDomain}/dev/set-cookie/`} target="_blank">
          <input type="hidden" name="name" defaultValue={cookieName} />
          <input type="hidden" name="value" defaultValue={cookieValue} />
          <input type="hidden" name="domain" defaultValue=".pycon.kr" />
          <input type="hidden" name="secure" defaultValue="true" />
          <input type="hidden" name="samesite" defaultValue="None" />
          <input type="hidden" name="max_age" defaultValue="1209600" />
        </form>
      )
    );
    const form = container.querySelector("form");
    if (!form) throw new Error("DevSetCookieButton: form element not found after flushSync render");
    form.submit();
    root.unmount();
    container.remove();
  };

  return (
    <Button variant="outlined" color="warning" onClick={handleClick} sx={{ textTransform: "none" }}>
      {children}
    </Button>
  );
};
