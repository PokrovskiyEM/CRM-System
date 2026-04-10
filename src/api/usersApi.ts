import { type MetaResponse, type User, type UserFilters } from "../types/users"
import { api } from "./api"

export const getUsers = async (queryParams?: UserFilters): Promise<MetaResponse<User>> => {
  const response = await api.get<MetaResponse<User>>('/admin/users', {
    params: queryParams
  })
  return response.data
}