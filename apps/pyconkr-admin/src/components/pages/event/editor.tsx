import { Stack, Tab, Tabs } from "@mui/material";
import { FC, useState } from "react";
import { useParams } from "react-router-dom";

import { AdminEditor } from "@apps/pyconkr-admin/components/layouts/admin_editor";
import { PresentationSettingsTabs } from "@apps/pyconkr-admin/components/pages/presentation/settings";
import { SponsorSettingsTabs } from "@apps/pyconkr-admin/components/pages/sponsor/settings";

type SettingsTab = "sponsor" | "presentation";

export const AdminEventEditor: FC = () => {
  const { id } = useParams<{ id?: string }>();
  const [tab, setTab] = useState<SettingsTab>("sponsor");

  return (
    <AdminEditor app="event" resource="event" id={id}>
      {id && (
        <Stack spacing={2} sx={{ mt: 3, mb: 3 }}>
          <Tabs value={tab} onChange={(_, v: SettingsTab) => setTab(v)}>
            <Tab value="sponsor" label="후원사 설정" />
            <Tab value="presentation" label="발표 설정" />
          </Tabs>
          {tab === "sponsor" && <SponsorSettingsTabs eventId={id} />}
          {tab === "presentation" && <PresentationSettingsTabs eventId={id} />}
        </Stack>
      )}
    </AdminEditor>
  );
};
