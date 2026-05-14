import { refresh } from "@/entities/session/api/auth-api";
import { logout } from "@/entities/session/model/auth-slice";
import { api } from "@/shared/api/base";
import { tokenManager } from "@/shared/lib/token-manager";
import { AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from "axios";
import { store } from "../store/store";

interface RetryConfig extends InternalAxiosRequestConfig {
  _retry?: boolean
}

const handleLogout = () => {
  tokenManager.clearToken()
  localStorage.removeItem('refreshToken')
  store.dispatch(logout())
}

export const setupApiInterceptors = (): void => {
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
        const refreshResponse = await refresh({ refreshToken })

        const newAccessToken = refreshResponse.accessToken
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
}
