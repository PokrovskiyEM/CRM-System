import axios, { AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from "axios";
import { logout } from "../app/store/Authentication/Slices/authSlice";
import { store } from "../app/store/store";
import { tokenManager } from "../helpers/tokenManager";

interface RetryConfig extends InternalAxiosRequestConfig {
  _retry?: boolean
}

interface RefreshResponse {
  accessToken: string
}

export const BASE_URL = 'https://easydev.club/api/v1'

export const api = axios.create({
  baseURL: BASE_URL
})

const handleLogout = () => {
  tokenManager.clearToken()
  localStorage.removeItem('refreshToken')
  store.dispatch(logout())
}

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = tokenManager.getToken()
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const status = error.response?.status
    const originalRequest: RetryConfig | undefined = error.config

    if (!status || !originalRequest || status !== 401 || originalRequest._retry) {
      return Promise.reject(error)
    }

    if (originalRequest.url === '/auth/refresh') {
      handleLogout()
      return Promise.reject(error)
    }

    originalRequest._retry = true

    const refreshToken: string | null = localStorage.getItem('refreshToken')
    if (!refreshToken) {
      handleLogout()
      return Promise.reject(error)
    }

    try {
      const refreshResponse = await api.post<RefreshResponse>('/auth/refresh', { refreshToken })

      const newAccessToken = refreshResponse.data.accessToken
      tokenManager.setToken(newAccessToken)

      originalRequest.headers = originalRequest.headers ?? {}
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`

      return api.request(originalRequest)
    } catch {
      handleLogout()
      return Promise.reject(error)
    }
  }
)