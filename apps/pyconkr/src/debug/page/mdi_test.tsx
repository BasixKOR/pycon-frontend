import React from "react";

import { Box, Button, Stack } from "@mui/material";

import { MDX_HELP_TEXT } from "@apps/pyconkr/consts/mdx_help_text";
import * as Common from "@frontend/common";

const LOCAL_STEORAGE_KEY = "mdi_test_input";

const getMdxInputFromLocalStorage: () => string = () => {
  const input = localStorage.getItem(LOCAL_STEORAGE_KEY);
  return input ? input : "";
}

const setMdxInputToLocalStorage: (input: string) => string = (input) => {
  localStorage.setItem(LOCAL_STEORAGE_KEY, input);
  return input;
}

export const MdiTestPage: React.FC = () => {
  const inputRef = React.useRef<HTMLTextAreaElement>(null);
  const [state, setState] = React.useState<{ text: string, resetKey: string }>({
    text: getMdxInputFromLocalStorage(),
    resetKey: window.crypto.randomUUID()
  });

  const setMDXInput = (text: string) => setState({ text: setMdxInputToLocalStorage(text), resetKey: window.crypto.randomUUID() });

  return (
    <Stack direction="row" spacing={2} sx={{ width: "100%", flexGrow: 1, p: 2 }}>
      <Stack direction="column" spacing={2} sx={{ width: "50%", maxWidth: "50%" }}>
        <textarea ref={inputRef} defaultValue={state.text} style={{ flexGrow: 1 }} />
        <Stack direction="column" spacing={2} sx={{ mb: 2 }}>
          <Button variant="contained" sx={{ flexGrow: 1 }} onClick={() => inputRef.current && setMDXInput(inputRef.current.value)}>변환</Button>
          <Button variant="contained" sx={{ flexGrow: 1 }} onClick={() => setMDXInput(MDX_HELP_TEXT)}>Help Text 로딩</Button>
        </Stack>
      </Stack>
      <Box sx={{ width: "50%", maxWidth: "50%", overflowY: "scroll" }}>
        <Common.Components.MDXRenderer {...state} />
      </Box>
    </Stack>
  );
};
