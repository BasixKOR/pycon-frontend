import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { isString } from "remeda";

import { ErrorResponseSchema, isObjectErrorResponseSchema } from "@frontend/common/schemas/backendAPI";
import { getCookie } from "@frontend/common/utils/cookie";
import { getFaro } from "@frontend/common/utils/faro";

const DEFAULT_ERROR_MESSAGE = "알 수 없는 문제가 발생했습니다, 잠시 후 다시 시도해주세요.";
const DEFAULT_ERROR_RESPONSE = {
  type: "unknown",
  errors: [{ code: "unknown", detail: DEFAULT_ERROR_MESSAGE, attr: null }],
};
// API 가 JSON 대신 HTML 을 돌려주는 경우가 있다. 본문을 그대로 message 로 쓰면 수 KB 짜리 에러/로그가 되므로
// 사용자에겐 기본 문구를 보여주고 원인은 detail.type 에만 남긴다.
const HTML_RESPONSE_PATTERN = /^\s*<(!doctype|html)\b/i;
// 그중 Cloudflare 봇 차단 인터스티셜("Just a moment...")은 링크 스캐너·크롤러에게만 뜨는 정상 동작이라 보고하지 않는다.
const CLOUDFLARE_CHALLENGE_PATTERN = /cdn-cgi\/challenge-platform|_cf_chl_opt/i;
const MAX_ERROR_DETAIL_LENGTH = 500;

export class BackendAPIClientError extends Error {
  readonly name = "BackendAPIClientError";
  readonly status: number;
  readonly detail: ErrorResponseSchema;
  readonly originalError: unknown;

  constructor(error?: unknown) {
    let message: string = DEFAULT_ERROR_MESSAGE;
    let detail: ErrorResponseSchema = DEFAULT_ERROR_RESPONSE;
    let status = -1;

    if (axios.isAxiosError(error)) {
      const response = error.response;

      if (response) {
        status = response.status;
        detail = isObjectErrorResponseSchema(response.data) ? response.data : buildNonSchemaErrorDetail(response.data);
        message = detail.errors[0].detail || DEFAULT_ERROR_MESSAGE;
      }
    } else if (error instanceof Error) {
      message = error.message;
      detail = {
        type: error.name || typeof error || "unknown",
        errors: [{ code: "unknown", detail: error.message, attr: null }],
      };
    }

    super(message);
    this.originalError = error || null;
    this.status = status;
    this.detail = detail;
  }

  isRequiredAuth(): boolean {
    return this.status === 401 || this.status === 403;
  }
}

const detectNonSchemaErrorType = (data: unknown): "cloudflare_challenge" | "html_response" | "axios_error" => {
  if (!isString(data) || !HTML_RESPONSE_PATTERN.test(data)) return "axios_error";
  return CLOUDFLARE_CHALLENGE_PATTERN.test(data) ? "cloudflare_challenge" : "html_response";
};

const buildNonSchemaErrorDetail = (data: unknown): ErrorResponseSchema => {
  const type = detectNonSchemaErrorType(data);
  return {
    type,
    errors: [
      {
        code: "unknown",
        detail: isString(data) && type === "axios_error" ? data.slice(0, MAX_ERROR_DETAIL_LENGTH) : DEFAULT_ERROR_MESSAGE,
        attr: null,
      },
    ],
  };
};

// BackendAPIClientError 는 Faro 노이즈 필터에서 일괄 제외된다(4xx·네트워크 오류는 알림 가치가 없음).
// 실제로 확인이 필요한 서버 오류만 상태·엔드포인트 컨텍스트를 붙여 여기서 직접 보고한다.
const reportServerError = (error: BackendAPIClientError): void => {
  if (error.detail.type === "cloudflare_challenge") return;
  if (error.status < 500 && error.detail.type !== "html_response") return;

  const config = axios.isAxiosError(error.originalError) ? error.originalError.config : undefined;
  getFaro()?.api.pushError(error, {
    type: "BackendServerError",
    context: {
      status: String(error.status),
      response_type: error.detail.type,
      method: config?.method?.toUpperCase() ?? "UNKNOWN",
      url: config?.url ?? "unknown",
    },
  });
};

export const formatBackendErrorMessage = (error: unknown, fallback: string): string => {
  if (error instanceof BackendAPIClientError) {
    const seen = new Set<string>();
    const messages: string[] = [];
    for (const detailedError of error.detail.errors) {
      const detail = detailedError.detail;
      if (detail && !seen.has(detail)) {
        seen.add(detail);
        messages.push(detail);
      }
    }
    if (messages.length > 0) return messages.join("\n");
  }
  if (error instanceof Error && error.message) return error.message;
  return fallback;
};

type supportedLanguages = "ko" | "en";

type AxiosRequestWithoutPayload = <T = unknown, Resp = AxiosResponse<T>, D = unknown>(url: string, config?: AxiosRequestConfig<D>) => Promise<Resp>;
type AxiosRequestWithPayload = <T = unknown, Resp = AxiosResponse<T>, D = unknown>(
  url: string,
  data?: D,
  config?: AxiosRequestConfig<D>
) => Promise<Resp>;

export class BackendAPIClient {
  readonly language: supportedLanguages;
  readonly baseURL: string;
  protected readonly csrfCookieName: string;
  protected readonly sessionCookieName: string;
  private readonly backendAPI: AxiosInstance;

  constructor(
    baseURL: string,
    timeout: number,
    csrfCookieName: string = "csrftoken",
    sessionCookieName: string = "sessionid",
    withCredentials: boolean = false,
    language: supportedLanguages = "ko"
  ) {
    const headers = {
      "Content-Type": "application/json",
      "Accept-Language": language,
    };
    this.language = language;
    this.baseURL = baseURL;
    this.csrfCookieName = csrfCookieName;
    this.sessionCookieName = sessionCookieName;
    this.backendAPI = axios.create({
      baseURL,
      timeout,
      headers,
      withCredentials,
    });

    if (withCredentials) {
      this.backendAPI.interceptors.request.use(
        (config) => {
          config.headers["x-csrftoken"] = this.getCSRFToken();
          return config;
        },
        (error) => Promise.reject(error)
      );
    }
  }

  getCSRFToken(): string | undefined {
    return getCookie(this.csrfCookieName);
  }

  getSessionId(): string | undefined {
    return getCookie(this.sessionCookieName);
  }

  _safe_request_without_payload(requestFunc: AxiosRequestWithoutPayload): AxiosRequestWithoutPayload {
    return async <T = unknown, Resp = AxiosResponse<T>, D = unknown>(url: string, config?: AxiosRequestConfig<D>) => {
      try {
        return await requestFunc<T, Resp, D>(url, config);
      } catch (error) {
        const clientError = new BackendAPIClientError(error);
        reportServerError(clientError);
        throw clientError;
      }
    };
  }

  _safe_request_with_payload(requestFunc: AxiosRequestWithPayload): AxiosRequestWithPayload {
    return async <T = unknown, Resp = AxiosResponse<T>, D = unknown>(url: string, data: D, config?: AxiosRequestConfig<D>) => {
      try {
        return await requestFunc<T, Resp, D>(url, data, config);
      } catch (error) {
        const clientError = new BackendAPIClientError(error);
        reportServerError(clientError);
        throw clientError;
      }
    };
  }

  async get<T, D = unknown>(url: string, config?: AxiosRequestConfig<D>): Promise<T> {
    return (await this._safe_request_without_payload(this.backendAPI.get)<T, AxiosResponse<T>, D>(url, config)).data;
  }
  async post<T, D>(url: string, data: D, config?: AxiosRequestConfig<D>): Promise<T> {
    return (await this._safe_request_with_payload(this.backendAPI.post)<T, AxiosResponse<T>, D>(url, data, config)).data;
  }
  async put<T, D>(url: string, data: D, config?: AxiosRequestConfig<D>): Promise<T> {
    return (await this._safe_request_with_payload(this.backendAPI.put)<T, AxiosResponse<T>, D>(url, data, config)).data;
  }
  async patch<T, D>(url: string, data: D, config?: AxiosRequestConfig<D>): Promise<T> {
    return (await this._safe_request_with_payload(this.backendAPI.patch)<T, AxiosResponse<T>, D>(url, data, config)).data;
  }
  async delete<T, D = unknown>(url: string, config?: AxiosRequestConfig<D>): Promise<T> {
    return (await this._safe_request_without_payload(this.backendAPI.delete)<T, AxiosResponse<T>, D>(url, config)).data;
  }
  // get/put 과 달리 전체 AxiosResponse(헤더·status) 를 반환.
  async getResponse<T, D = unknown>(url: string, config?: AxiosRequestConfig<D>): Promise<AxiosResponse<T>> {
    return this._safe_request_without_payload(this.backendAPI.get)<T, AxiosResponse<T>, D>(url, config);
  }
  async putResponse<T, D = unknown>(url: string, data: D, config?: AxiosRequestConfig<D>): Promise<AxiosResponse<T>> {
    return this._safe_request_with_payload(this.backendAPI.put)<T, AxiosResponse<T>, D>(url, data, config);
  }
  async headResponse<D = unknown>(url: string, config?: AxiosRequestConfig<D>): Promise<AxiosResponse<void>> {
    return this._safe_request_without_payload(this.backendAPI.head)<void, AxiosResponse<void>, D>(url, config);
  }
}
