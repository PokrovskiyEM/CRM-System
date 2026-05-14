import { api } from "@/shared/api/base"
import type { Profile } from "../model/types"

export const getUserProfile = async (): Promise<Profile> => {
  const response = await api.get<Profile>('/user/profile')
  return response.data
}

export const logoutProfile = async () => {
  await api.post('/user/logout')
}