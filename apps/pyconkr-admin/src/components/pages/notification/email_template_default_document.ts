import { type EmailDocument } from "@mu-software/mail-editor";

export const DEFAULT_INITIAL_DOCUMENT: EmailDocument = {
  version: 1,
  meta: {},
  styles: { width: 480 },
  rows: [
    {
      id: "r_3ddf1139",
      columns: [
        {
          id: "c_a695ad0b",
          width: 1,
          blocks: [
            {
              id: "b_f95ab413",
              type: "image",
              src: "https://placehold.co/50?text=Image",
              alt: "",
              width: 50,
              height: 50,
              styles: { textAlign: "center" },
            },
          ],
        },
        {
          id: "c_6aa69e48",
          width: 1,
          blocks: [
            { id: "b_1c330070", type: "heading", level: 2, content: "PyCon 한국 {{ year }}" },
            { id: "b_04e8a2aa", type: "text", content: "PyCon Korea {{ year }}", styles: { fontSize: 14, lineHeight: 1.5 } },
          ],
        },
      ],
      styles: { paddingY: 16, paddingX: 24 },
    },
    {
      id: "r_607ff09c",
      columns: [
        {
          id: "c_d1031624",
          width: 1,
          blocks: [{ id: "b_320bc51e", type: "hr" }],
          styles: { verticalAlign: "middle" },
        },
      ],
      styles: {},
    },
    {
      id: "r_3d6709f5",
      columns: [
        {
          id: "c_6f7fecc4",
          width: 1,
          blocks: [{ id: "b_6a24e1fe", type: "heading", level: 2, content: "본문 제목" }],
        },
      ],
      styles: { paddingY: 16, paddingX: 24 },
    },
    {
      id: "r_22657034",
      columns: [
        {
          id: "c_0d3a384a",
          width: 1,
          blocks: [{ id: "b_7e7d1363", type: "text", content: "여기에 내용을 입력하세요", styles: { fontSize: 14, lineHeight: 1.5 } }],
        },
      ],
      styles: { paddingY: 16, paddingX: 24 },
    },
    {
      id: "r_e4b1c3b7",
      columns: [
        {
          id: "c_3aa3d6a8",
          width: 1,
          blocks: [{ id: "b_d73a03e7", type: "hr" }],
        },
      ],
      styles: {},
    },
    {
      id: "r_76bf6162",
      columns: [
        {
          id: "c_90cc6a63",
          width: 1,
          blocks: [
            {
              id: "b_ff12aba8",
              type: "unorderedList",
              items: [
                "본 메일은 [파이콘 한국 {{ year }}] 참가등록을 완료하신 분들께 보내드리는 안내 메일입니다.<br>This is an information email sent to those who have completed the registration for.",
                "본 메일 주소는 발신 전용 메일로 회신이 되지 않습니다.<br>This email address is for sending only and cannot be replied to.",
                "등록 시 메일 주소 입력 착오로 인해 잘못된 메일로 발신이 될 수 있습니다.<br>본인이 아닌 경우 양해 부탁드리며, 본 메일을 삭제해주세요.<br>Due to an error in the email address entered during registration,<br>it may be sent to the wrong email address.<br>If it is not you, please ignore it and delete this email.",
              ],
              styles: { lineHeight: 1.5, fontSize: 10 },
            },
          ],
        },
      ],
      styles: { paddingY: 16, paddingX: 24 },
    },
  ],
  sampleValues: { year: "2026" },
};
