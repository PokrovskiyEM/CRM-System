import type { Profile } from "../types/auth"
import { api } from "./api"

export const getUserProfile = async (): Promise<Profile> => {
  const response = await api.get<Profile>('/user/profile')
  return response.data
}

export const logout = async () => {
  await api.post('/user/logout')
}