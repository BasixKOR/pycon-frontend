import { Components } from "@frontend/common";
import { useCommonContext } from "@frontend/common/src/hooks/useCommonContext";
import { Box, Stack } from "@mui/material";
import React from "react";

const HalfWidthStyle: React.CSSProperties = { width: "50%", maxWidth: "50%" };

export const MdiTestPage: React.FC = () => {
  const { baseUrl, mdxComponents } = useCommonContext();
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
        <Components.MDXEditor defaultValue={state.text} onChange={setMDXInput} />
      </Box>
      <Box sx={HalfWidthStyle}>
        <Components.MDXRenderer {...state} format="mdx" baseUrl={baseUrl} mdxComponents={mdxComponents} />
      </Box>
    </Stack>
  );
};
