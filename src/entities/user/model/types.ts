import type { Role } from "@/entities/session/model/types";

export type ApiSortOrder = 'asc' | 'desc'

export interface UserFilters {
  search?: string;
  sortBy?: string;
  sortOrder?: ApiSortOrder;
  isBlocked?: boolean;
  limit?: number;  // сколько на странице
  page?: number;  // страницу
}

export interface User {
  id: number;
  username: string;
  email: string;
  date: string; // ISO date string 
  isBlocked: boolean;
  roles: Role[];
  phoneNumber: string;
}

export interface MetaResponse<T> {
  data: T[]
  meta: {
    totalAmount: number;
    sortBy: string;
    sortOrder: ApiSortOrder;
  }
}

export interface UserRolesRequest {
  roles: Role[]  // при вызове этой апи роли будут обновлены к тому массиву который будет передан
  // например если у вас была roles: ['ADMIN'] а вы хотите добавить ['MODERATOR'] то нужно передавать
  // старые + новые - roles: ['ADMIN', 'MODERATOR']
}

export interface UserRequest {
  username?: string;
  email?: string;
  phoneNumber?: string;
}

export type BlockStatus = 'block' | 'unblock'