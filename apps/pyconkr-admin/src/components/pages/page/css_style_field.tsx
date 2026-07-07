import { Add, Delete } from "@mui/icons-material";
import { Autocomplete, Box, Button, IconButton, Stack, TextField, Typography } from "@mui/material";
import { ChangeEvent, CSSProperties, FC, KeyboardEvent, ReactNode, useMemo } from "react";

// 이 필드는 일반 CSS가 아니라 dynamic_route에서 parseCss(JSON.parse)로 파싱되어 MUI sx로 적용되는
// "React 스타일 객체(JSON 문자열)"임. 따라서 키는 camelCase CSS 프로퍼티(또는 중첩 셀렉터/@media)여야 함.

type SectionCssEditorPropType = {
  disabled?: boolean;
  defaultValue?: string | null;
  onInsertNewSection: () => void;
  onChange: (value: string) => void;
  onDelete: () => void;
};

// ---- B) MUI sx 키 제안 / 검증 ----------------------------------------------

// MUI sx에서만 유효한(순수 CSS 프로퍼티가 아닌) spacing/색상 단축키.
const MUI_SX_SHORTHANDS = ["m", "mt", "mr", "mb", "ml", "mx", "my", "p", "pt", "pr", "pb", "pl", "px", "py", "bgcolor"];

// 브라우저가 실제로 지원하는 camelCase CSS 프로퍼티 목록을 런타임에서 추출 (의존성 불필요).
const buildCssPropertyOptions = (): string[] => {
  const options = new Set<string>(MUI_SX_SHORTHANDS);
  if (typeof document !== "undefined") {
    const style = document.createElement("span").style as unknown as Record<string, unknown>;
    for (const key in style) {
      // camelCase 접근자만 수집: 값이 문자열이고 이름이 순수 알파벳인 것 (메서드/인덱스/dashed 제외).
      if (typeof style[key] === "string" && /^[a-zA-Z]+$/.test(key)) options.add(key);
    }
  }
  ["cssText", "cssFloat", "length", "parentRule"].forEach((k) => options.delete(k));
  return Array.from(options).sort();
};

const CSS_PROPERTY_OPTIONS = buildCssPropertyOptions();
const KNOWN_CSS_KEYS = new Set(CSS_PROPERTY_OPTIONS);

// 소문자로 시작하는 순수 알파벳 키만 "CSS 프로퍼티 후보"로 봄.
// 셀렉터(`& .x`, `:hover`, `@media ...`)나 벤더 프리픽스(`WebkitBoxShadow`)는 검증에서 제외해 오탐을 줄임.
const isPlainCssIdentifier = (key: string): boolean => /^[a-z][a-zA-Z]*$/.test(key);

const collectUnknownKeys = (node: unknown, acc: Set<string>): void => {
  if (!node || typeof node !== "object" || Array.isArray(node)) return;
  for (const [key, child] of Object.entries(node)) {
    if (isPlainCssIdentifier(key) && !KNOWN_CSS_KEYS.has(key)) acc.add(key);
    collectUnknownKeys(child, acc);
  }
};

// 한 번의 JSON 파싱으로 파싱 에러 메시지와 알 수 없는(오타 의심) CSS 속성 키를 함께 계산.
const validateCss = (value: string): { error: string | null; unknownKeys: string[] } => {
  if (!value.trim()) return { error: null, unknownKeys: [] };
  let parsed: unknown;
  try {
    parsed = JSON.parse(value);
  } catch (e) {
    return { error: (e as Error).message, unknownKeys: [] };
  }
  // 최상위는 스타일 객체여야 함 — 배열/원시값은 parseCss에서 {}로 무시되어 적용되지 않음.
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    return { error: "최상위 값은 객체({ ... }) 형식이어야 합니다.", unknownKeys: [] };
  }
  const acc = new Set<string>();
  collectUnknownKeys(parsed, acc);
  return { error: null, unknownKeys: Array.from(acc) };
};

// ---- A) JSON 신택스 하이라이팅 에디터 --------------------------------------

const COLORS = {
  key: "#0b7285",
  string: "#2b8a3e",
  number: "#1971c2",
  literal: "#ae3ec9",
  punctuation: "#868e96",
};

// 입력 문자열을 색상 span으로 변환. 어떤 입력이든(작성 중인 불완전 JSON 포함) 글자를 누락하지 않도록
// 매칭되지 않은 구간(gap)은 그대로 출력해 textarea와 글자 단위로 정렬되게 함.
const highlightJson = (code: string): ReactNode[] => {
  const out: ReactNode[] = [];
  const re = /("(?:\\.|[^"\\])*")(\s*:)?|(-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)|\b(true|false|null)\b|([{}[\],:])/g;
  let last = 0;
  let i = 0;
  const push = (text: string, color?: string): void => {
    if (!text) return;
    out.push(
      <span key={i++} style={color ? { color } : undefined}>
        {text}
      </span>
    );
  };

  let m: RegExpExecArray | null;
  while ((m = re.exec(code)) !== null) {
    if (m.index > last) push(code.slice(last, m.index));
    if (m[1] !== undefined) {
      // 문자열: 뒤에 콜론(m[2])이 오면 키, 아니면 값.
      if (m[2] !== undefined) {
        push(m[1], COLORS.key);
        push(m[2], COLORS.punctuation);
      } else {
        push(m[1], COLORS.string);
      }
    } else if (m[3] !== undefined) push(m[0], COLORS.number);
    else if (m[4] !== undefined) push(m[0], COLORS.literal);
    else if (m[5] !== undefined) push(m[0], COLORS.punctuation);
    last = re.lastIndex;
  }
  if (last < code.length) push(code.slice(last));
  return out;
};

const EDITOR_TYPOGRAPHY: CSSProperties = {
  margin: 0,
  padding: 12,
  fontFamily: "'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace",
  fontSize: 13,
  lineHeight: 1.6,
  letterSpacing: "normal",
  tabSize: 2,
  whiteSpace: "pre-wrap",
  wordBreak: "break-word",
  boxSizing: "border-box",
  border: 0,
};

type JsonCodeEditorProps = {
  value: string;
  disabled?: boolean;
  error?: boolean;
  onChange: (value: string) => void;
};

const JsonCodeEditor: FC<JsonCodeEditorProps> = ({ value, disabled, error, onChange }) => {
  // 부모가 매 렌더 새 onChange/section을 내려보내 컴포넌트 memo는 효과가 없으므로,
  // 비싼 토큰화만 value 기준으로 캐시해 변경되지 않은 섹션의 재하이라이트를 피함.
  const highlighted = useMemo(() => highlightJson(`${value}\n`), [value]);

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>): void => {
    if (e.key !== "Tab") return;
    e.preventDefault();
    const target = e.currentTarget;
    const { selectionStart: start, selectionEnd: end } = target;
    onChange(`${value.slice(0, start)}  ${value.slice(end)}`);
    requestAnimationFrame(() => target.setSelectionRange(start + 2, start + 2));
  };

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        bgcolor: "#fff",
        border: 1,
        borderColor: error ? "error.main" : "divider",
        borderRadius: 1,
        overflow: "hidden",
        opacity: disabled ? 0.6 : 1,
      }}
    >
      <pre aria-hidden style={{ ...EDITOR_TYPOGRAPHY, minHeight: 180, color: "#212529", pointerEvents: "none" }}>
        {/* textarea가 color:transparent라 placeholder 속성이 안 보이므로, 빈 값일 때 보이는 pre에 힌트를 렌더. */}
        {value ? highlighted : <span style={{ color: "#adb5bd" }}>{'{ "backgroundColor": "#ffffff" }'}</span>}
      </pre>
      <textarea
        value={value}
        disabled={disabled}
        spellCheck={false}
        aria-label="섹션 CSS"
        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        style={{
          ...EDITOR_TYPOGRAPHY,
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          resize: "none",
          overflow: "hidden",
          background: "transparent",
          color: "transparent",
          caretColor: "#212529",
          outline: "none",
        }}
      />
    </Box>
  );
};

// ---- 섹션 CSS 에디터 (A + B 조합) ------------------------------------------

export const SectionCssEditor: FC<SectionCssEditorPropType> = ({ disabled, defaultValue, onInsertNewSection, onChange, onDelete }) => {
  const value = defaultValue ?? "";
  const { error: jsonError, unknownKeys } = validateCss(value);

  // 선택한 프로퍼티를 현재 JSON 객체에 `"prop": ""`로 추가. 유효한 객체이거나 빈 값일 때만 동작.
  const insertProperty = (prop: string | null): void => {
    if (!prop) return;
    let obj: Record<string, unknown> = {};
    if (value.trim()) {
      try {
        const parsed = JSON.parse(value);
        if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return;
        obj = parsed as Record<string, unknown>;
      } catch {
        return;
      }
    }
    if (prop in obj) return;
    onChange(JSON.stringify({ ...obj, [prop]: "" }, null, 2));
  };

  return (
    <Stack spacing={1} sx={{ flexGrow: 1, width: "100%", maxWidth: "100%" }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
        <Typography variant="subtitle2" color="text.secondary">
          섹션 CSS (React 스타일 객체 · JSON)
        </Typography>
        <IconButton size="small" onClick={onDelete} disabled={disabled} aria-label="Delete">
          <Delete style={{ fontSize: 16 }} />
        </IconButton>
      </Stack>

      <Autocomplete
        options={CSS_PROPERTY_OPTIONS}
        disabled={disabled || jsonError !== null}
        value={null}
        blurOnSelect
        clearOnBlur
        size="small"
        onChange={(_, selected) => insertProperty(selected)}
        filterOptions={(opts, state) => {
          const q = state.inputValue.trim().toLowerCase();
          if (!q) return [];
          return opts.filter((o) => o.toLowerCase().includes(q)).slice(0, 50);
        }}
        renderInput={(params) => <TextField {...params} label="속성 추가 (CSS 프로퍼티 검색)" placeholder="예: backgroundColor" />}
      />

      <JsonCodeEditor value={value} disabled={disabled} error={jsonError !== null} onChange={onChange} />

      {jsonError ? (
        <Typography variant="caption" sx={{ color: "error.main" }}>
          JSON 파싱 오류: {jsonError}
        </Typography>
      ) : unknownKeys.length > 0 ? (
        <Typography variant="caption" sx={{ color: "warning.main" }}>
          알 수 없는 CSS 속성: {unknownKeys.join(", ")} — 오타이거나 셀렉터/벤더 프리픽스라면 무시해도 됩니다.
        </Typography>
      ) : (
        <Typography variant="caption" color="text.secondary">
          camelCase 프로퍼티를 입력하세요. 중첩 셀렉터(&quot;&amp; .markdown-body&quot;)나 &quot;@media …&quot;도 사용 가능합니다.
        </Typography>
      )}

      <Button size="small" onClick={onInsertNewSection} startIcon={<Add />}>
        여기에 섹션 추가
      </Button>
    </Stack>
  );
};
