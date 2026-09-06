export const IMAGE_FILE_EXTENSIONS = ["jpg", "jpeg", "png", "gif", "webp", "svg", "bmp", "avif"];
const SLIDESHOW_EXTENSIONS = ["pdf", "ppt", "pptx"];
const SLIDESHOW_MIMETYPES = [
  "application/pdf",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
];

export type UploadProfile = {
  accept: string;
  description: string;
  isAllowed: (file: File) => boolean;
};

const isImage = (file: File) => file.type.startsWith("image/");

export const UPLOAD_PROFILES = {
  image: {
    accept: "image/*",
    description: "이미지 파일만 업로드할 수 있습니다.",
    isAllowed: isImage,
  },
  slideshow: {
    accept: [...SLIDESHOW_MIMETYPES, ...SLIDESHOW_EXTENSIONS.map((ext) => `.${ext}`)].join(","),
    description: "PDF, PPT, PPTX 파일만 업로드할 수 있습니다.",
    isAllowed: (file: File) =>
      SLIDESHOW_MIMETYPES.includes(file.type) || SLIDESHOW_EXTENSIONS.some((ext) => file.name.toLowerCase().endsWith(`.${ext}`)),
  },
} satisfies Record<string, UploadProfile>;

export type UploadProfileName = keyof typeof UPLOAD_PROFILES;
export const DEFAULT_UPLOAD_PROFILE: UploadProfileName = "image";
