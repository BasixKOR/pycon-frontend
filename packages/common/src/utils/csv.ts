import Papa from "papaparse";

export type ParsedCsv = { header: string[]; rows: string[][] };

// 백엔드(core.util.fileutil.CSV_ENCODINGS)와 같은 폴백 — 한국어 Windows Excel 은 CSV 를 CP949 로 저장한다.
// 순서 중요: utf-8 을 fatal 로 먼저 시도해야 euc-kr(CP949) 이 UTF-8 본문을 깨진 글자로 잘못 읽는 것을 막는다.
// TextDecoder 는 기본적으로 BOM 을 제거하므로 백엔드의 utf-8-sig 와 동작이 같다.
const UTF16_BOMS = [
  [0xff, 0xfe],
  [0xfe, 0xff],
];

const decodeCsv = (buffer: ArrayBuffer): string => {
  const bytes = new Uint8Array(buffer);
  // euc-kr 디코딩은 어떤 바이트든 통과시켜 깨진 글자를 만들어내므로, 백엔드가 거부하는 UTF-16
  // (Excel 의 "유니코드 텍스트" 저장) 만은 BOM 으로 먼저 걸러 깨진 미리보기를 막는다.
  if (UTF16_BOMS.some(([first, second]) => bytes[0] === first && bytes[1] === second)) {
    throw new Error("UTF-16 로 저장된 파일은 지원하지 않습니다. Excel 에서 'CSV UTF-8' 또는 'CSV (쉼표로 분리)' 로 저장해주세요.");
  }

  try {
    return new TextDecoder("utf-8", { fatal: true }).decode(buffer);
  } catch {
    return new TextDecoder("euc-kr").decode(buffer);
  }
};

export const parseCsvFile = async (file: File): Promise<ParsedCsv> => {
  const text = decodeCsv(await file.arrayBuffer());
  const { data } = Papa.parse<string[]>(text, { skipEmptyLines: "greedy" });
  const [header = [], ...rows] = data;
  return { header, rows };
};
