import React from "react";

import { Box, Stack } from "@mui/material";

import * as Common from "@frontend/common";

const HalfWidthStyle: React.CSSProperties = { width: "50%", maxWidth: "50%" };

export const MdiTestPage: React.FC = () => {
  const inputRef = React.useRef<HTMLTextAreaElement>(null);
  const [state, setState] = React.useState<{ text: string, resetKey: number }>({ text: "", resetKey: Math.random() });
  const setMDXInput = (text: string) => setState({ text, resetKey: Math.random() });
  const onLoad = (text: string) => {
    setState((prev) => ({ ...prev, text }));
    if (inputRef.current) inputRef.current.value = text;
  }

  return (
    <Stack direction="row" spacing={2} sx={{ width: "100%", height: "100%", minHeight: "100%", maxHeight: "100%", flexGrow: 1, py: 2 }}>
      <Box sx={HalfWidthStyle}><Common.Components.MDXEditor inputRef={inputRef} defaultValue={state.text} onLoad={onLoad} onSave={setMDXInput} ctrlSMode="save" /></Box>
      <Box sx={HalfWidthStyle}><Common.Components.MDXRenderer {...state} /></Box>
    </Stack>
  );
};
