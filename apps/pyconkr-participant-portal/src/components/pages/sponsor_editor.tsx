import { FormControl, InputLabel, Select, Stack, Tab, Tabs, TextField, Typography } from "@mui/material";
import { ErrorBoundary, Suspense } from "@suspensive/react";
import { FC } from "react";

import { ErrorPage } from "@apps/pyconkr-participant-portal/components/elements/error_page";
import { LoadingPage } from "@apps/pyconkr-participant-portal/components/elements/loading_page";
import { SignInGuard } from "@apps/pyconkr-participant-portal/components/elements/signin_guard";
import { Page } from "@apps/pyconkr-participant-portal/components/page";

const InnerSponsorEditor: FC = () => {
  return (
    <SignInGuard>
      <Page>
        <Typography variant="h4" component="h1" gutterBottom children="후원사 정보 수정" />
        <form>
          <Stack>
            <Tabs>
              <Tab value="ko" label="한국어 (Korean)" />
              <Tab value="en" label="영어 (English)" />
            </Tabs>
            <TextField label="후원사명" />
            <TextField label="후원사 설명" multiline rows={4} />
            <FormControl fullWidth>
              <InputLabel children="로고 파일 선택 (Select logo files)" />
              <Select />
            </FormControl>
          </Stack>
        </form>
      </Page>
    </SignInGuard>
  );
};

export const SponsorEditor: FC = ErrorBoundary.with(
  { fallback: ErrorPage },
  Suspense.with({ fallback: <LoadingPage /> }, () => <SignInGuard children={<InnerSponsorEditor />} />)
);
