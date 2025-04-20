import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import * as R from 'remeda';

import { getCookie } from '@pyconkr-common/utils/cookie';
import ShopAPISchema, { isObjectErrorResponseSchema } from "@pyconkr-shop/schemas";

const DEFAULT_TIMEOUT = 10000
const DEFAULT_ERROR_MESSAGE = '알 수 없는 문제가 발생했습니다, 잠시 후 다시 시도해주세요.'
const DEFAULT_ERROR_RESPONSE = { type: 'unknown', errors: [{ code: 'unknown', detail: DEFAULT_ERROR_MESSAGE, attr: null }] }

export class ShopAPIClientError extends Error {
  readonly name = 'ShopAPIError'
  readonly status: number
  readonly detail: ShopAPISchema.ErrorResponseSchema
  readonly originalError: unknown

  constructor(error?: unknown) {
    let message: string = DEFAULT_ERROR_MESSAGE
    let detail: ShopAPISchema.ErrorResponseSchema = DEFAULT_ERROR_RESPONSE
    let status = -1

    if (axios.isAxiosError(error)) {
      const response = error.response

      if (response) {
        status = response.status
        detail = isObjectErrorResponseSchema(response.data) ? response.data : {
          type: 'axios_error',
          errors: [{ code: 'unknown', detail: R.isString(response.data) ? response.data : DEFAULT_ERROR_MESSAGE, attr: null }]
        }
      }
    } else if (error instanceof Error) {
      message = error.message
      detail = {
        type: error.name || typeof error || 'unknown',
        errors: [{ code: 'unknown', detail: error.message, attr: null }],
      }
    }

    super(message)
    this.originalError = error || null
    this.status = status
    this.detail = detail
  }

  isRequiredAuth(): boolean {
    return this.status === 401 || this.status === 403
  }
}

type AxiosRequestWithoutPayload = <T = any, R = AxiosResponse<T>, D = any>(url: string, config?: AxiosRequestConfig<D>) => Promise<R>
type AxiosRequestWithPayload = <T = any, R = AxiosResponse<T>, D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>) => Promise<R>

class ShopAPIClient {
  readonly baseURL: string
  protected readonly csrfCookieName: string
  private readonly shopAPI: AxiosInstance

  constructor(
    baseURL: string = import.meta.env.VITE_PYCONKR_SHOP_API_DOMAIN,
    csrfCookieName: string = import.meta.env.VITE_PYCONKR_SHOP_CSRF_COOKIE_NAME,
    timeout: number = DEFAULT_TIMEOUT,
  ) {
    this.baseURL = baseURL
    this.csrfCookieName = csrfCookieName
    this.shopAPI = axios.create({ baseURL, timeout, headers: { 'Content-Type': 'application/json' } })
  }

  _safe_request_without_payload(requestFunc: AxiosRequestWithoutPayload): AxiosRequestWithoutPayload {
    return async <T = any, R = AxiosResponse<T>, D = any>(url: string, config?: AxiosRequestConfig<D>) => {
      try {
        return await requestFunc<T, R, D>(url, config)
      } catch (error) {
        throw new ShopAPIClientError(error)
      }
    }
  }

  _safe_request_with_payload(requestFunc: AxiosRequestWithPayload): AxiosRequestWithPayload {
    return async <T = any, R = AxiosResponse<T>, D = any>(url: string, data: D, config?: AxiosRequestConfig<D>) => {
      try {
        return await requestFunc<T, R, D>(url, data, config)
      } catch (error) {
        throw new ShopAPIClientError(error)
      }
    }
  }

  getCSRFToken(): string | undefined { return getCookie(this.csrfCookieName) }

  async get<T, D=any>(url: string, config?: AxiosRequestConfig<D>): Promise<T> {
    return (await this._safe_request_without_payload(this.shopAPI.get)<T, AxiosResponse<T>, D>(url, config)).data
  }
  async post<T, D>(url: string, data: D, config?: AxiosRequestConfig<D>): Promise<T> {
    return (await this._safe_request_with_payload(this.shopAPI.post)<T, AxiosResponse<T>, D>(url, data, config)).data
  }
  async put<T, D>(url: string, data: D, config?: AxiosRequestConfig<D>): Promise<T> {
    return (await this._safe_request_with_payload(this.shopAPI.put)<T, AxiosResponse<T>, D>(url, data, config)).data
  }
  async patch<T, D>(url: string, data: D, config?: AxiosRequestConfig<D>): Promise<T> {
    return (await this._safe_request_with_payload(this.shopAPI.patch)<T, AxiosResponse<T>, D>(url, data, config)).data
  }
  async delete<T, D=any>(url: string, config?: AxiosRequestConfig<D>): Promise<T> {
    return (await this._safe_request_without_payload(this.shopAPI.delete)<T, AxiosResponse<T>, D>(url, config)).data
  }
}

export const shopAPIClient = new ShopAPIClient(import.meta.env.VITE_SHOP_URL)
