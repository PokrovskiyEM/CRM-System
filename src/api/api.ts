import axios, { AxiosError, type AxiosRequestConfig } from "axios";
import { logout } from "../app/store/Authentification/Slices/authSlice";
import { store } from "../app/store/store";
import { tokenManager } from "../helpers/tokenManager";

interface RetryConfig extends AxiosRequestConfig {
  _retry?: boolean
}

export const BASE_URL = 'https://easydev.club/api/v1'

export const api = axios.create({
  baseURL: BASE_URL
})

api.interceptors.request.use((config) => {
  const token = tokenManager.getToken()
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  res => res,
  async (error: AxiosError) => {
    const status = error.response?.status
    const originalRequest: RetryConfig | undefined = error.config

    if (!status || !originalRequest) {
      return Promise.reject(error)
    }

    if (status !== 401) {
      return Promise.reject(error)
    }

    if (originalRequest._retry) {
      return Promise.reject(error)
    }

    if (originalRequest.url === '/auth/refresh') {
      tokenManager.clearToken()
      localStorage.removeItem('refreshToken')
      store.dispatch(logout())
      return Promise.reject(error)
    }

    originalRequest._retry = true

    const refreshToken = localStorage.getItem('refreshToken')
    if (!refreshToken) {
      tokenManager.clearToken()
      localStorage.removeItem('refreshToken')
      store.dispatch(logout())
      return Promise.reject(error)
    }

    try {
      const refreshResponse = await api.post('/auth/refresh', { refreshToken })

      const newAccessToken = refreshResponse.data.accessToken
      tokenManager.setToken(newAccessToken)
      // store.dispatch(setAuth(true))

      originalRequest.headers = originalRequest.headers ?? {}
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`

      return api.request(originalRequest)
    } catch {
      tokenManager.clearToken()
      localStorage.removeItem('refreshToken')
      store.dispatch(logout())
      return Promise.reject(error)
    }
  }
)