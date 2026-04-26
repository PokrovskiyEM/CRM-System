import type { AxiosResponse } from "axios";
import type { AuthData, RefreshToken, Token, UserRegistration } from "../types/auth";
import { api } from "./api";

export const signIn = async ({ login, password }: AuthData): Promise<Token> => {
  const response = await api.post<Token>('/auth/signin', { login, password })
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

export const refresh = async (refreshToken: RefreshToken): Promise<Token> => {
  const response = await api.post<Token>('/auth/refresh', refreshToken)
  return response.data
}