import { Roles, type MetaResponse, type User, type UserFilters } from "../types/users"
import { api } from "./api"

export const getUsers = async (queryParams?: UserFilters): Promise<MetaResponse<User>> => {
  const response = await api.get<MetaResponse<User>>('/admin/users', {
    params: queryParams
  })
  return response.data
}

export const mockData = [
  {
    date: "10.04.2026, 12:40:49",
    email: "yhb@b.com",
    id: 3655,
    isBlocked: false,
    phoneNumber: "+79511018729",
    roles: [
      Roles.USER
    ],
    username: "yhb",
  },
  {
    date: "10.04.2026, 12:40:49",
    email: "yhb@b.com",
    id: 3655,
    isBlocked: false,
    phoneNumber: "+79511018729",
    roles: [
      Roles.USER
    ],
    username: "yhb",
  },
  {
    date: "10.04.2026, 12:40:49",
    email: "yhb@b.com",
    id: 3655,
    isBlocked: false,
    phoneNumber: "+79511018729",
    roles: [
      Roles.USER
    ],
    username: "yhb",
  },
  {
    date: "10.04.2026, 12:40:49",
    email: "yhb@b.com",
    id: 3655,
    isBlocked: false,
    phoneNumber: "+79511018729",
    roles: [
      Roles.USER
    ],
    username: "yhb",
  },
  {
    date: "10.04.2026, 12:40:49",
    email: "yhb@b.com",
    id: 3655,
    isBlocked: false,
    phoneNumber: "",
    roles: [
      Roles.USER
    ],
    username: "yhb",
  },
  {
    date: "10.04.2026, 12:40:49",
    email: "yhb@b.com",
    id: 3655,
    isBlocked: false,
    phoneNumber: "",
    roles: [
      Roles.USER
    ],
    username: "yhb",
  },
  {
    date: "10.04.2026, 12:40:49",
    email: "yhb@b.com",
    id: 3655,
    isBlocked: false,
    phoneNumber: "",
    roles: [
      Roles.USER
    ],
    username: "yhb",
  },
  {
    date: "10.04.2026, 12:40:49",
    email: "yhb@b.com",
    id: 3655,
    isBlocked: false,
    phoneNumber: "",
    roles: [
      Roles.USER
    ],
    username: "yhb",
  },
  {
    date: "10.04.2026, 12:40:49",
    email: "yhb@b.com",
    id: 3655,
    isBlocked: false,
    phoneNumber: "",
    roles: [
      Roles.USER
    ],
    username: "yhb",
  },
  {
    date: "10.04.2026, 12:40:49",
    email: "yhb@b.com",
    id: 3655,
    isBlocked: false,
    phoneNumber: "",
    roles: [
      Roles.USER
    ],
    username: "yhb",
  },
  {
    date: "10.04.2026, 12:40:49",
    email: "yhb@b.com",
    id: 3655,
    isBlocked: false,
    phoneNumber: "",
    roles: [
      Roles.USER
    ],
    username: "yhb",
  },
  {
    date: "10.04.2026, 12:40:49",
    email: "yhb@b.com",
    id: 3655,
    isBlocked: false,
    phoneNumber: "",
    roles: [
      Roles.USER
    ],
    username: "yhb",
  },
  {
    date: "10.04.2026, 12:40:49",
    email: "yhb@b.com",
    id: 3655,
    isBlocked: false,
    phoneNumber: "",
    roles: [
      Roles.USER
    ],
    username: "yhb",
  },
  {
    date: "10.04.2026, 12:40:49",
    email: "yhb@b.com",
    id: 3655,
    isBlocked: false,
    phoneNumber: "",
    roles: [
      Roles.USER
    ],
    username: "yhb",
  },
  {
    date: "10.04.2026, 12:40:49",
    email: "yhb@b.com",
    id: 3655,
    isBlocked: false,
    phoneNumber: "",
    roles: [
      Roles.USER
    ],
    username: "yhb",
  },
  {
    date: "10.04.2026, 12:40:49",
    email: "yhb@b.com",
    id: 3655,
    isBlocked: false,
    phoneNumber: "",
    roles: [
      Roles.USER
    ],
    username: "yhb",
  },
  {
    date: "10.04.2026, 12:40:49",
    email: "yhb@b.com",
    id: 3655,
    isBlocked: false,
    phoneNumber: "",
    roles: [
      Roles.USER
    ],
    username: "yhb",
  },
  {
    date: "10.04.2026, 12:40:49",
    email: "yhb@b.com",
    id: 3655,
    isBlocked: false,
    phoneNumber: "",
    roles: [
      Roles.USER
    ],
    username: "yhb",
  },
  {
    date: "10.04.2026, 12:40:49",
    email: "yhb@b.com",
    id: 3655,
    isBlocked: false,
    phoneNumber: "",
    roles: [
      Roles.USER
    ],
    username: "yhb",
  },
  {
    date: "10.04.2026, 12:40:49",
    email: "yhb@b.com",
    id: 3655,
    isBlocked: false,
    phoneNumber: "",
    roles: [
      Roles.USER
    ],
    username: "yhb",
  },
  {
    date: "10.04.2026, 12:40:49",
    email: "yhb@b.com",
    id: 3655,
    isBlocked: false,
    phoneNumber: "",
    roles: [
      Roles.USER
    ],
    username: "yhb",
  },
  {
    date: "10.04.2026, 12:40:49",
    email: "yhb@b.com",
    id: 3655,
    isBlocked: false,
    phoneNumber: "",
    roles: [
      Roles.USER
    ],
    username: "yhb",
  },
  {
    date: "10.04.2026, 12:40:49",
    email: "yhb@b.com",
    id: 3655,
    isBlocked: false,
    phoneNumber: "",
    roles: [
      Roles.USER
    ],
    username: "yhb",
  },
  {
    date: "10.04.2026, 12:40:49",
    email: "yhb@b.com",
    id: 3655,
    isBlocked: false,
    phoneNumber: "",
    roles: [
      Roles.USER
    ],
    username: "yhb",
  },
  {
    date: "10.04.2026, 12:40:49",
    email: "yhb@b.com",
    id: 3655,
    isBlocked: false,
    phoneNumber: "",
    roles: [
      Roles.USER
    ],
    username: "yhb",
  },
  {
    date: "10.04.2026, 12:40:49",
    email: "yhb@b.com",
    id: 3655,
    isBlocked: false,
    phoneNumber: "",
    roles: [
      Roles.USER
    ],
    username: "yhb",
  },
  {
    date: "10.04.2026, 12:40:49",
    email: "yhb@b.com",
    id: 3655,
    isBlocked: false,
    phoneNumber: "",
    roles: [
      Roles.USER
    ],
    username: "yhb",
  },
  {
    date: "10.04.2026, 12:40:49",
    email: "yhb@b.com",
    id: 3655,
    isBlocked: false,
    phoneNumber: "",
    roles: [
      Roles.USER
    ],
    username: "yhb",
  },
  {
    date: "10.04.2026, 12:40:49",
    email: "yhb@b.com",
    id: 3655,
    isBlocked: false,
    phoneNumber: "",
    roles: [
      Roles.USER
    ],
    username: "yhb",
  },
  {
    date: "10.04.2026, 12:40:49",
    email: "yhb@b.com",
    id: 3655,
    isBlocked: false,
    phoneNumber: "",
    roles: [
      Roles.USER
    ],
    username: "yhb",
  },
  {
    date: "10.04.2026, 12:40:49",
    email: "yhb@b.com",
    id: 3655,
    isBlocked: false,
    phoneNumber: "",
    roles: [
      Roles.USER
    ],
    username: "yhb",
  },
  {
    date: "10.04.2026, 12:40:49",
    email: "yhb@b.com",
    id: 3655,
    isBlocked: false,
    phoneNumber: "",
    roles: [
      Roles.USER
    ],
    username: "yhb",
  },
  {
    date: "10.04.2026, 12:40:49",
    email: "yhb@b.com",
    id: 3655,
    isBlocked: false,
    phoneNumber: "",
    roles: [
      Roles.MODERATOR
    ],
    username: "yhb",
  },

]