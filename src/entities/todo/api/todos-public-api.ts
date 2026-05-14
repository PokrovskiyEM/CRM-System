import type { GetTodosQueryParams, MetaResponse, Todo, TodoInfo, TodoRequest } from "@/entities/todo/model/types";
import { BASE_URL } from "@/shared/config/base-api";
import axios from "axios";

const publicApi = axios.create({
  baseURL: BASE_URL
})

export const getTodos = async (queryParams?: GetTodosQueryParams): Promise<MetaResponse<Todo, TodoInfo>> => {
  const response = await publicApi.get<MetaResponse<Todo, TodoInfo>>('/todos', {
    params: queryParams
  })

  return response.data
}

export const addTodo = async (todoRequest: TodoRequest): Promise<Todo> => {
  const response = await publicApi.post<Todo>('/todos', todoRequest)

  return response.data
}

export const updateTodo = async (id: number, todoRequest: TodoRequest): Promise<Todo> => {
  const response = await publicApi.put<Todo>(`/todos/${id}`, todoRequest)

  return response.data
}

export const deleteTodo = async (id: number): Promise<Todo> => {
  const response = await publicApi.delete<Todo>(`/todos/${id}`)

  return response.data
}