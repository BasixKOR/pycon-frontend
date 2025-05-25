import * as React from "react";

import { Apps, Save } from "@mui/icons-material";
import { Button, ButtonProps, MenuItem, Select, Stack, Typography } from "@mui/material";
import MDEditor, { GroupOptions, RefMDEditor, commands } from '@uiw/react-md-editor';
import * as CryptoJS from "crypto-js";
import type { MDXComponents } from "mdx/types";

import Hooks from "../hooks";

const LOCAL_STORAGE_KEY = "mdx_editor_input_";

type CustomComponentInfoType = {
  k: string; // key
  n: string; // name
  v?: MDXComponents[string]; // value
}

type MDXEditorProps = {
  sectionId?: string;
  defaultValue?: string;
  inputRef?: React.RefObject<HTMLTextAreaElement | null>;
  onLoad?: (value: string) => void;
  onSave?: (value: string) => void;
  ctrlSMode?: "ignore" | "save";
  submitActions?: ButtonProps[];
};

const TextEditorStyle: React.CSSProperties = {
  flexGrow: 1,
  width: '100%',
  maxWidth: '100%',

  wordBreak: 'break-word',
  whiteSpace: 'pre-wrap',
  overflowWrap: 'break-word',

  fieldSizing: 'content',
} as React.CSSProperties;

const getDefaultValueFromLocalStorage = (sectionId?: string): string => localStorage.getItem(LOCAL_STORAGE_KEY + (sectionId || "unknown")) ?? "";

const calculateMD5FromFileBase64 = (fileBase64: string): string => CryptoJS.MD5(CryptoJS.enc.Base64.parse(fileBase64)).toString();

const onFileInEvent: React.DragEventHandler<HTMLDivElement> = (event) => {
  event.preventDefault();
  event.stopPropagation();

  if (!event.dataTransfer) { // Might be a drag event
    alert('이 브라우저는 해당 동작을 지원하지 않습니다.');
    return;
  }

  const images = Array.from(event.dataTransfer.files).filter(f => f.type.startsWith("image/"))
  if (images.length === 0) {
    alert('이미지 파일만 첨부할 수 있어요.');
    return;
  }

  images.forEach(
    (item) => {
      let reader = new FileReader();
      reader.onload = (e) => {
        if (!e.target || typeof e.target.result !== "string") return;
        console.log(`이미지 MD5 해시: ${calculateMD5FromFileBase64(e.target.result.split(',')[1])}`);
      }
      reader.onerror = (e) => {
        console.error('Error reading file:', e);
        alert('파일을 읽는 중 오류가 발생했습니다.');
      };
      reader.readAsDataURL(item);
    }
  );
}

const getCustomComponentSelector: (registeredComponentList: CustomComponentInfoType[]) => GroupOptions["children"] = (registeredComponentList) => ({ close, getState, textApi }) => {
  const componentSelectorRef = React.useRef<HTMLSelectElement>(null);

  const onInsertBtnClick = () => {
    if (!textApi || !getState || !registeredComponentList?.length || !componentSelectorRef.current) return undefined;

    const state = getState();
    if (!state) return undefined;

    const selectedComponentData = registeredComponentList.find(({ k }) => k === componentSelectorRef?.current?.value);
    if (!selectedComponentData) return undefined;

    let newText = `<${selectedComponentData.k} />`;
    if (state.selectedText) {
      newText += `\n${state.selectedText}`;
      if (state.selection.start - 1 !== -1 && state.text[state.selection.start - 1] !== "\n") newText = `\n${newText}`;
    } else {
      if (state.selection.start - 1 !== -1 && state.text[state.selection.start - 1] !== "\n") newText = `\n${newText}`;
      if (state.selection.end !== state.text.length && state.text[state.selection.end] !== "\n") newText += "\n";
    }

    textApi.replaceSelection(newText);
    close();
  }

  return <Stack spacing={1} sx={{ p: 1, flexGrow: 1, minWidth: 200 }}>
    <Typography variant="subtitle1" color="text.secondary">컴포넌트 삽입</Typography>
    <Select inputRef={componentSelectorRef} defaultValue="" size="small" fullWidth>
      {registeredComponentList.map(({ k, n }) => <MenuItem key={k} value={k}>{n}</MenuItem>)}
    </Select>
    <Button size="small" variant="contained" onClick={onInsertBtnClick}>삽입</Button>
    <Button size="small" variant="outlined" sx={{ flexGrow: 1 }} onClick={close}>닫기</Button>
  </Stack>;
}

export const MDXEditor: React.FC<MDXEditorProps> = ({ sectionId, defaultValue, inputRef, onLoad, onSave, ctrlSMode, submitActions }) => {
  const [value, setValue] = React.useState<string>(defaultValue || getDefaultValueFromLocalStorage(sectionId));
  const { mdxComponents } = Hooks.Common.useCommonContext();

  if (!inputRef) inputRef = React.useRef<HTMLTextAreaElement | null>(null);
  const setRef: React.RefAttributes<RefMDEditor>["ref"] = (n) => {
    if (n?.textarea) {
      !inputRef.current && onLoad?.(n.textarea.value);
      inputRef.current = n.textarea
    }
  }

  const registeredComponentList: CustomComponentInfoType[] = [
    { k: "", n: "", v: undefined },
    ...Object.entries(mdxComponents ?? {}).map(([k, v]) => {
      const splicedKey = k.replace(/__/g, '.').split('.');
      const n = [...splicedKey.slice(0, -1).map((word) => word.toLowerCase()), splicedKey[splicedKey.length - 1]].join('.');
      return { k, n, v };
    })
  ];

  const onSaveAction = () => {
    if (!inputRef.current) return;

    setValue(inputRef.current.value);
    onSave?.(inputRef.current.value);
    localStorage.setItem(LOCAL_STORAGE_KEY + (sectionId || "unknown"), inputRef.current.value);
    alert("저장했습니다.");
  }

  const handleCtrlSAction: (this: GlobalEventHandlers, ev: KeyboardEvent) => any = (event) => {
    if (event.key === "s" && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      event.stopPropagation();
      console.log(`Ctrl+S pressed, executing ${ctrlSMode} action`);
      ctrlSMode === "save" && onSaveAction();
    }
  }

  React.useEffect(
    ctrlSMode ? () => {
      document.addEventListener("keydown", handleCtrlSAction);
      return () => {
        console.log("Removing event listener for Ctrl+S action");
        document.removeEventListener("keydown", handleCtrlSAction);
      }
    } : () => { }, [inputRef.current]
  )

  return <Stack direction="column" spacing={2} sx={{ width: "100%", height: "100%", maxWidth: "100%" }}>
    <MDEditor
      preview="edit"
      highlightEnable={true}
      ref={setRef}
      value={value}
      onChange={(v, e, s) => setValue(v || "")}
      commands={[
        commands.group(
          [
            commands.title1,
            commands.title2,
            commands.title3,
            commands.title4,
            commands.title5,
            commands.title6,
          ],
          {
            name: 'title',
            groupName: 'title',
            buttonProps: { 'aria-label': 'Insert title' }
          }
        ),
        commands.bold,
        commands.italic,
        commands.code,
        commands.link,
        commands.divider,
        commands.quote,
        commands.codeBlock,
        commands.hr,
        commands.image,
        commands.divider,
        commands.unorderedListCommand,
        commands.orderedListCommand,
        commands.divider,
        commands.group([], {
          name: 'custom components',
          groupName: 'custom components',
          icon: <Apps style={{ fontSize: 12 }} />,
          children: getCustomComponentSelector(registeredComponentList),
          buttonProps: { 'aria-label': 'Insert custom component' }
        }),
      ]}
      extraCommands={[
        commands.group([], {
          name: 'save',
          groupName: 'save',
          icon: <Save style={{ fontSize: 12 }} />,
          execute: onSaveAction,
          buttonProps: { 'aria-label': 'Save' }
        })
      ]}
      style={TextEditorStyle}
    />
    <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
      {submitActions && submitActions.map((buttonProps, index) => <Button key={index} {...buttonProps} />)}
    </Stack>
  </Stack>;
};
