import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import * as R from "remeda";

import BackendAPISchemas from "../schemas/backendAPI";
import { getCookie } from "../utils/cookie";

const DEFAULT_ERROR_MESSAGE = "알 수 없는 문제가 발생했습니다, 잠시 후 다시 시도해주세요.";
const DEFAULT_ERROR_RESPONSE = {
  type: "unknown",
  errors: [{ code: "unknown", detail: DEFAULT_ERROR_MESSAGE, attr: null }],
};

export class BackendAPIClientError extends Error {
  readonly name = "BackendAPIClientError";
  readonly status: number;
  readonly detail: BackendAPISchemas.ErrorResponseSchema;
  readonly originalError: unknown;

  constructor(error?: unknown) {
    let message: string = DEFAULT_ERROR_MESSAGE;
    let detail: BackendAPISchemas.ErrorResponseSchema = DEFAULT_ERROR_RESPONSE;
    let status = -1;

    if (axios.isAxiosError(error)) {
      const response = error.response;

      if (response) {
        status = response.status;
        detail = BackendAPISchemas.isObjectErrorResponseSchema(response.data)
          ? response.data
          : {
              type: "axios_error",
              errors: [
                {
                  code: "unknown",
                  detail: R.isString(response.data) ? response.data : DEFAULT_ERROR_MESSAGE,
                  attr: null,
                },
              ],
            };
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

type supportedLanguages = "ko" | "en";

type AxiosRequestWithoutPayload = <T = unknown, R = AxiosResponse<T>, D = unknown>(url: string, config?: AxiosRequestConfig<D>) => Promise<R>;
type AxiosRequestWithPayload = <T = unknown, R = AxiosResponse<T>, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig<D>) => Promise<R>;

export class BackendAPIClient {
  readonly language: supportedLanguages;
  readonly baseURL: string;
  protected readonly csrfCookieName: string;
  private readonly backendAPI: AxiosInstance;

  constructor(
    baseURL: string,
    timeout: number,
    csrfCookieName: string = "csrftoken",
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

  _safe_request_without_payload(requestFunc: AxiosRequestWithoutPayload): AxiosRequestWithoutPayload {
    return async <T = unknown, R = AxiosResponse<T>, D = unknown>(url: string, config?: AxiosRequestConfig<D>) => {
      try {
        return await requestFunc<T, R, D>(url, config);
      } catch (error) {
        throw new BackendAPIClientError(error);
      }
    };
  }

  _safe_request_with_payload(requestFunc: AxiosRequestWithPayload): AxiosRequestWithPayload {
    return async <T = unknown, R = AxiosResponse<T>, D = unknown>(url: string, data: D, config?: AxiosRequestConfig<D>) => {
      try {
        return await requestFunc<T, R, D>(url, data, config);
      } catch (error) {
        throw new BackendAPIClientError(error);
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
}
