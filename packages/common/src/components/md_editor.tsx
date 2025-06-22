import { Stack } from "@mui/material";
import MDEditor, { ICommand, commands } from "@uiw/react-md-editor";
import * as React from "react";

type MDEditorProps = {
  disabled?: boolean;
  defaultValue?: string;
  onChange?: (value?: string) => void;
  extraCommands?: ICommand[];
};

const TextEditorStyle: React.CSSProperties = {
  flexGrow: 1,
  width: "100%",
  maxWidth: "100%",

  wordBreak: "break-word",
  whiteSpace: "pre-wrap",
  overflowWrap: "break-word",

  fieldSizing: "content",
} as React.CSSProperties;

export const MarkdownEditor: React.FC<MDEditorProps> = ({ disabled, defaultValue, onChange, extraCommands }) => (
  <Stack direction="column" spacing={2} sx={{ width: "100%", height: "100%", maxWidth: "100%" }}>
    <MDEditor
      data-color-mode="light"
      textareaProps={{ disabled }}
      preview="edit"
      highlightEnable={true}
      height="none"
      minHeight={100}
      value={defaultValue}
      onChange={onChange}
      commands={[
        commands.group([commands.title1, commands.title2, commands.title3, commands.title4, commands.title5, commands.title6], {
          name: "title",
          groupName: "title",
          buttonProps: { "aria-label": "Insert title" },
        }),
        commands.bold,
        commands.italic,
        commands.strikethrough,
        commands.code,
        commands.link,
        commands.divider,
        commands.quote,
        commands.codeBlock,
        commands.table,
        commands.hr,
        commands.image,
        commands.divider,
        commands.unorderedListCommand,
        commands.orderedListCommand,
        commands.checkedListCommand,
        commands.divider,
        commands.help,
      ]}
      extraCommands={extraCommands}
      style={TextEditorStyle}
    />
  </Stack>
);
