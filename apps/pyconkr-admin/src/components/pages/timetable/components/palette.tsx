import { useBackendAdminClient, useListAllQuery } from "@frontend/common/hooks/useAdminAPI";
import { PresentationSchema } from "@frontend/common/schemas/backendAdminAPI";
import { DragIndicator } from "@mui/icons-material";
import { Box, Chip, FormControl, InputLabel, MenuItem, Paper, Select, Stack, TextField, Typography } from "@mui/material";
import { DragEvent, FC, useMemo, useState } from "react";

import { resourceLabel } from "@apps/pyconkr-admin/utils/label";

import { APP, TIMETABLE_PALETTE_DROP_ATTR, TIMETABLE_PRESENTATION_DND_MIME } from "../const";
import { useTimetable } from "../contexts/use_timetable";

export const TimetablePalette: FC = () => {
  const { eventId, placedPresentationIds, presentationTypes, setDraggingPresentationId } = useTimetable();
  const client = useBackendAdminClient();
  const { data: presentations } = useListAllQuery<PresentationSchema>(client, APP, "presentation", { event: eventId });

  const [nameQuery, setNameQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  const unplaced = useMemo(() => {
    const typeIds = new Set(presentationTypes.map((t) => t.id));
    const query = nameQuery.trim().toLowerCase();
    return presentations
      .filter((p) => typeIds.has(p.type))
      .filter((p) => !placedPresentationIds.has(p.id))
      .filter((p) => (typeFilter ? p.type === typeFilter : true))
      .filter((p) => (query ? resourceLabel(p).toLowerCase().includes(query) : true))
      .sort((a, b) => resourceLabel(a).localeCompare(resourceLabel(b), "ko"));
  }, [presentations, presentationTypes, placedPresentationIds, typeFilter, nameQuery]);

  const handleDragStart = (presentationId: string) => (e: DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData(TIMETABLE_PRESENTATION_DND_MIME, presentationId);
    e.dataTransfer.setData("text/plain", presentationId);
    e.dataTransfer.effectAllowed = "copy";
    setDraggingPresentationId(presentationId);
  };

  return (
    <Paper
      variant="outlined"
      {...{ [TIMETABLE_PALETTE_DROP_ATTR]: "" }}
      sx={{ display: "flex", flexDirection: "column", minHeight: 0, height: "100%" }}
    >
      <Box sx={{ p: 1.5, borderBottom: 1, borderColor: "divider" }}>
        <Typography variant="subtitle2">미배치 일정 ({unplaced.length})</Typography>
        <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 1 }}>
          카드를 우측 시간표로 끌어다 놓으세요.
          <br />
          시간표의 카드를 여기로 끌어오면 미배치로 되돌립니다.
        </Typography>
        <Stack spacing={1}>
          <FormControl size="small" fullWidth>
            <InputLabel>타입</InputLabel>
            <Select label="타입" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
              <MenuItem value="" children={<em>전체</em>} />
              {presentationTypes.map((t) => (
                <MenuItem key={t.id} value={t.id} children={resourceLabel(t)} />
              ))}
            </Select>
          </FormControl>
          <TextField size="small" fullWidth placeholder="이름 검색" value={nameQuery} onChange={(e) => setNameQuery(e.target.value)} />
        </Stack>
      </Box>
      <Stack spacing={1} sx={{ p: 1.5, overflowY: "auto", flex: 1, minHeight: 0, overscrollBehavior: "none" }}>
        {unplaced.map((p) => (
          <Paper
            key={p.id}
            variant="outlined"
            draggable
            onDragStart={handleDragStart(p.id)}
            onDragEnd={() => setDraggingPresentationId(null)}
            sx={{
              p: 1,
              cursor: "grab",
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              "&:hover": { borderColor: "primary.main", bgcolor: "action.hover" },
              "&:active": { cursor: "grabbing" },
            }}
          >
            <DragIndicator fontSize="small" sx={{ color: "text.disabled", flexShrink: 0 }} />
            <Typography variant="body2" sx={{ minWidth: 0, wordBreak: "break-word" }} children={resourceLabel(p)} />
          </Paper>
        ))}
        {unplaced.length === 0 && (
          <Stack alignItems="center" sx={{ py: 4 }}>
            <Chip label={nameQuery || typeFilter ? "조건에 맞는 발표가 없습니다" : "모든 발표가 배치되었습니다"} size="small" variant="outlined" />
          </Stack>
        )}
      </Stack>
    </Paper>
  );
};
