import { api } from "@/shared/api/base";
import type { AxiosResponse } from "axios";
import type { AuthData, RefreshToken, Tokens, UserRegistration } from "../model/types";

export const signIn = async ({ login, password }: AuthData): Promise<Tokens> => {
  const response = await api.post<Tokens>('/auth/signin', { login, password })
  return response.data
}

export const signUp = async ({
  login,
  username,
  password,
  email,
  phoneNumber = ''
}: UserRegistration): Promise<AxiosResponse> => {
  const response = await api.post('/auth/signup', {
    login,
    username,
    password,
    email,
    phoneNumber
  })
  return response
}

export const refresh = async (refreshToken: RefreshToken): Promise<Tokens> => {
  const response = await api.post<Tokens>('/auth/refresh', refreshToken)
  return response.data
}