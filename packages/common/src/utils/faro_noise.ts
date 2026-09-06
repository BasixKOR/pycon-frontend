import { TransportItemType, type ExceptionEvent, type Meta, type TransportItem } from "@grafana/faro-web-sdk";

/**
 * Faro 로 올라가는 예외(kind=exception) 중 우리가 손댈 수 없거나 이미 다른 경로로 관측되는 것을 걸러낸다.
 * Loki 의 exception 스트림이 곧 알림이므로, 여기서 버린 항목은 알림이 울리지 않는다.
 */

// Faro 콘솔 계측이 console.error 캡처에 붙이는 접두사.
const CONSOLE_ERROR_PREFIX = "console.error: ";

// 우리 코드가 절대 실행되지 않는 출처. 이 프레임이 하나라도 있으면 브라우저 확장/외부 비콘의 예외다.
const FOREIGN_FRAME_PATTERNS: RegExp[] = [
  /-extension:\/\//i, // chrome-extension://, moz-extension://, safari-web-extension://
  /^extensions:\/\//i, // Firefox 내부 스크립트
  /static\.cloudflareinsights\.com/i,
  /googletagmanager\.com|google-analytics\.com|doubleclick\.net/i,
  /connect\.facebook\.net/i,
];

// 메시지만으로 노이즈가 확정되는 항목.
const IGNORED_VALUE_PATTERNS: RegExp[] = [
  /^Script error\.?$/, // cross-origin 스크립트 — 메시지도 스택도 없어 조사 불가
  /Object Not Found Matching Id:\s*\d+/, // Outlook SafeLink 링크 스캐너
  /window\.ethereum/, // 암호화폐 지갑 확장
  /ResizeObserver loop/, // 브라우저 렌더링 경고, 사용자 영향 없음
  /\.at is not a function/, // Array.prototype.at 미지원 구형 브라우저
  /알 수 없는 이유로 스크립트 실행에 실패하였습니다/, // iamport 결제 SDK 내부 console.error
  /__reactFiber\$/, // React fiber 를 JSON.stringify 하려는 외부 주입 스크립트(확장·번역기). 우리 코드는 DOM 을 직렬화하지 않는다.
];

// JS 를 실행하는 크롤러·링크 스캐너. 실제 사용자 UA 에는 나타나지 않는 토큰만 사용한다.
const BOT_USER_AGENT_PATTERNS: RegExp[] = [
  /\+https?:\/\//i, // 크롤러가 관례적으로 UA 에 넣는 안내 URL (Googlebot/bingbot 등)
  /\b(bot|crawler|spider|scraper|slurp)\b/i,
  /HeadlessChrome|Chrome-Lighthouse|PhantomJS|Playwright|Puppeteer/i,
  /facebookexternalhit|Applebot|PetalBot|YandexBot|DuckDuckBot/i,
];

// React Router 가 같은 렌더 에러를 console.error 로 두 번 더 찍는다. 원본 1건만 남긴다.
const DUPLICATE_VALUE_PREFIXES = [
  `${CONSOLE_ERROR_PREFIX}Error handled by React Router default ErrorBoundary:`,
  `${CONSOLE_ERROR_PREFIX}React Router caught the following error during render`,
];

// 백엔드가 내려준 오류는 백엔드에서 관측한다. 5xx 만 client.ts 가 컨텍스트를 붙여 직접 보고한다.
const BACKEND_API_CLIENT_ERROR_TYPE = "BackendAPIClientError";

const hasForeignFrame = (payload: ExceptionEvent): boolean =>
  (payload.stacktrace?.frames ?? []).some(({ filename }) => !!filename && FOREIGN_FRAME_PATTERNS.some((re) => re.test(filename)));

const isBotUserAgent = (meta?: Meta): boolean => {
  const userAgent = meta?.browser?.userAgent;
  return !!userAgent && BOT_USER_AGENT_PATTERNS.some((re) => re.test(userAgent));
};

export const shouldDropFaroException = (payload: ExceptionEvent, meta?: Meta): boolean => {
  if (isBotUserAgent(meta)) return true;

  const value = payload.value ?? "";

  if (IGNORED_VALUE_PATTERNS.some((re) => re.test(value))) return true;
  if (DUPLICATE_VALUE_PREFIXES.some((prefix) => value.startsWith(prefix))) return true;
  if (payload.type === BACKEND_API_CLIENT_ERROR_TYPE) return true;

  return hasForeignFrame(payload);
};

export const filterNoisyFaroExceptions = (item: TransportItem): TransportItem | null => {
  if (item.type !== TransportItemType.EXCEPTION) return item;
  return shouldDropFaroException(item.payload as ExceptionEvent, item.meta) ? null : item;
};
