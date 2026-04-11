import { type MetaResponse, type User, type UserFilters, type UserRequest } from "../types/users"
import { api } from "./api"

export const getUsers = async (queryParams?: UserFilters): Promise<MetaResponse<User>> => {
  const response = await api.get<MetaResponse<User>>('/admin/users', {
    params: queryParams
  })
  return response.data
}

export const getUserProfileByAdmin = async (id: string | number): Promise<User> => {
  const response = await api.get<User>(`/admin/users/${id}`)
  return response.data
}

export const updateUserProfile = async (id: string | number, newProfile: UserRequest): Promise<User> => {
  const response = await api.put<User>(`admin/users/${id}`, newProfile)
  return response.data
}