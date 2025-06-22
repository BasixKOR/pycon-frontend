import * as Common from "@frontend/common";
import { Box, Stack } from "@mui/material";
import React from "react";

const HalfWidthStyle: React.CSSProperties = { width: "50%", maxWidth: "50%" };

export const MdiTestPage: React.FC = () => {
  const [state, setState] = React.useState<{ text: string; resetKey: number }>({
    text: "",
    resetKey: Math.random(),
  });
  const setMDXInput = (input?: string) => setState({ text: input || "", resetKey: Math.random() });

  return (
    <Stack
      direction="row"
      spacing={2}
      sx={{
        width: "100%",
        height: "100%",
        minHeight: "100%",
        maxHeight: "100%",
        flexGrow: 1,
        py: 2,
      }}
    >
      <Box sx={HalfWidthStyle}>
        <Common.Components.MDXEditor defaultValue={state.text} onChange={setMDXInput} />
      </Box>
      <Box sx={HalfWidthStyle}>
        <Common.Components.MDXRenderer {...state} format="mdx" />
      </Box>
    </Stack>
  );
};
