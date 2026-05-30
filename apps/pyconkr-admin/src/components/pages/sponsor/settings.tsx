import { Box, Stack, Tab, Tabs } from "@mui/material";
import { FC, useState } from "react";

import { InlineResourceSection } from "@apps/pyconkr-admin/components/elements/inline_resource_section";

type SponsorTab = "tier" | "tag";

export const SponsorSettingsTabs: FC<{ eventId: string }> = ({ eventId }) => {
  const [tab, setTab] = useState<SponsorTab>("tier");

  return (
    <Stack direction="row" spacing={2} sx={{ flexGrow: 1, width: "100%" }}>
      <Tabs
        orientation="vertical"
        value={tab}
        onChange={(_, v: SponsorTab) => setTab(v)}
        sx={{ borderRight: 1, borderColor: "divider", minWidth: 72, "& .MuiTab-root": { minWidth: 0, px: 2 } }}
      >
        <Tab value="tier" label="티어" />
        <Tab value="tag" label="태그" />
      </Tabs>
      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
        {tab === "tier" && (
          <InlineResourceSection
            app="event"
            resource="sponsortier"
            filter={{ key: "event", value: eventId }}
            label="티어"
            orderField="order"
            columns={[
              { name: "name", label: "이름", type: "translated" },
              {
                name: "order",
                label: "순서",
                type: "number",
                width: 80,
                defaultValue: (n) => String(n * 10),
                helperText: "낮은 값이 먼저 표시됩니다.",
              },
            ]}
          />
        )}
        {tab === "tag" && (
          <InlineResourceSection
            app="event"
            resource="sponsortag"
            filter={{ key: "event", value: eventId }}
            label="태그"
            columns={[{ name: "name", label: "이름", type: "translated" }]}
          />
        )}
      </Box>
    </Stack>
  );
};
