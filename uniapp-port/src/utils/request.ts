/**
 * 统一请求封装
 * - 泛型返回，调用处拿到的就是业务数据，不用再 res.data.data
 * - 绝对地址自动识别，方便接第三方接口（本项目用 dog.ceo 取封面图）
 * - 401、HTTP 错误、业务错误码、网络异常统一处理
 */

const DEFAULT_BASE_URL = 'https://jsonplaceholder.typicode.com'
const TOKEN_KEY = 'mini-blog:token'
const ABSOLUTE_URL = /^https?:\/\//i

/** 基础地址优先级：.env 里的 VITE_API_BASE > 代码里的默认值 */
export const BASE_URL = import.meta.env.VITE_API_BASE || DEFAULT_BASE_URL

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'

export type QueryParams = Record<string, string | number | boolean | undefined>

export interface RequestOptions {
  /** 相对路径（拼 BASE_URL）或完整 https 地址 */
  url: string
  method?: HttpMethod
  data?: unknown
  params?: QueryParams
  header?: Record<string, string>
  /** 超时毫秒数，默认 15 秒 */
  timeout?: number
  /** 出错时是否自动弹 toast，默认 true。静默场景传 false */
  showError?: boolean
}

/** 后端常见包装结构：{ code, message, data } */
export interface ApiEnvelope<T> {
  code: number
  message?: string
  data: T
}

export class HttpError extends Error {
  readonly statusCode: number

  constructor(message: string, statusCode = 0) {
    super(message)
    this.name = 'HttpError'
    this.statusCode = statusCode
  }
}

function toast(title: string): void {
  uni.showToast({ title, icon: 'none', duration: 2000 })
}

function withQuery(url: string, params?: QueryParams): string {
  if (!params) return url
  const query = Object.keys(params)
    .filter((key) => params[key] !== undefined)
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(String(params[key]))}`)
    .join('&')
  if (!query) return url
  return `${url}${url.includes('?') ? '&' : '?'}${query}`
}

function isEnvelope<T>(body: unknown): body is ApiEnvelope<T> {
  if (typeof body !== 'object' || body === null || Array.isArray(body)) return false
  return typeof (body as { code?: unknown }).code === 'number'
}

/** 登录态失效。项目还没有登录页，接入后改成 reLaunch 到登录页 */
function handleUnauthorized(): void {
  uni.removeStorageSync(TOKEN_KEY)
  toast('登录状态已失效')
}

export function request<T>(options: RequestOptions): Promise<T> {
  const {
    url,
    method = 'GET',
    data,
    params,
    header = {},
    timeout = 15000,
    showError = true
  } = options

  const target = ABSOLUTE_URL.test(url) ? url : `${BASE_URL}${url}`
  const fullUrl = withQuery(target, params)
  const token = uni.getStorageSync(TOKEN_KEY) as string

  return new Promise<T>((resolve, reject) => {
    uni.request({
      url: fullUrl,
      method,
      data: data as AnyObject | string | ArrayBuffer | undefined,
      timeout,
      header: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...header
      },
      success: (res) => {
        const statusCode = res.statusCode

        if (statusCode === 401) {
          handleUnauthorized()
          reject(new HttpError('登录状态已失效', 401))
          return
        }

        // 教程原文写作 statusCode = 300，是赋值不是比较，这里按语义修正为 >= 300
        if (statusCode >= 300) {
          const message = `请求失败（HTTP ${statusCode}）`
          if (showError) toast(message)
          reject(new HttpError(message, statusCode))
          return
        }

        const body: unknown = res.data

        if (isEnvelope<T>(body)) {
          if (body.code !== 0 && body.code !== 200) {
            const message = body.message || '业务处理失败'
            if (showError) toast(message)
            reject(new HttpError(message, statusCode))
            return
          }
          resolve(body.data)
          return
        }

        // 接口直接返回业务数据（jsonplaceholder 就是这种）
        resolve(body as T)
      },
      fail: (err) => {
        const message =
          err.errMsg && err.errMsg.includes('timeout')
            ? '请求超时，请稍后重试'
            : '网络异常，请检查网络后重试'
        if (showError) toast(message)
        reject(new HttpError(message, 0))
      }
    })
  })
}

export const http = {
  get<T>(url: string, params?: QueryParams, options: Partial<RequestOptions> = {}): Promise<T> {
    return request<T>({ url, params, ...options, method: 'GET' })
  },

  post<T>(url: string, data?: unknown, options: Partial<RequestOptions> = {}): Promise<T> {
    return request<T>({ url, data, ...options, method: 'POST' })
  },

  put<T>(url: string, data?: unknown, options: Partial<RequestOptions> = {}): Promise<T> {
    return request<T>({ url, data, ...options, method: 'PUT' })
  },

  del<T>(url: string, data?: unknown, options: Partial<RequestOptions> = {}): Promise<T> {
    return request<T>({ url, data, ...options, method: 'DELETE' })
  }
}
