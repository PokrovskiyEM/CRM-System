import type { Role } from "@/entities/session/model/types"
import { type BlockStatus, type MetaResponse, type User, type UserFilters, type UserRequest } from "@/entities/user/model/types"
import { api } from "@/shared/api/base"

export const getUsers = async (queryParams?: UserFilters): Promise<MetaResponse<User>> => {
  const response = await api.get<MetaResponse<User>>('/admin/users', {
    params: queryParams
  })
  return response.data
}

export const getUserProfileByAdmin = async (id: number): Promise<User> => {
  const response = await api.get<User>(`/admin/users/${id}`)
  return response.data
}

export const updateUserProfile = async (id: number, newProfile: UserRequest): Promise<User> => {
  const response = await api.put<User>(`/admin/users/${id}`, newProfile)
  return response.data
}

export const deleteUser = async (id: number): Promise<void> => {
  await api.delete(`/admin/users/${id}`)
}

export const setUserBlockStatus = async (id: number, status: BlockStatus): Promise<User> => {
  const response = await api.post(`/admin/users/${id}/${status}`)
  return response.data
}

export const updateUserRoles = async (id: number, newRoles: Role[]): Promise<User> => {
  const response = await api.post(`/admin/users/${id}/rights`, { roles: newRoles })
  return response.data
}