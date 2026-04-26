import axios from "axios";
import type { GetTodosQueryParams, MetaResponse, Todo, TodoInfo, TodoRequest } from "../types/todo";

const BASE_URL = 'https://easydev.club/api/v1'

const api = axios.create({
  baseURL: BASE_URL
})

export const getTodos = async (queryParams?: GetTodosQueryParams): Promise<MetaResponse<Todo, TodoInfo>> => {
  const response = await api.get<MetaResponse<Todo, TodoInfo>>('/todos', {
    params: queryParams
  })

  return response.data
}

export const addTodo = async (todoRequest: TodoRequest): Promise<Todo> => {
  const response = await api.post<Todo>('/todos', todoRequest)

  return response.data
}

export const updateTodo = async (id: number, todoRequest: TodoRequest): Promise<Todo> => {
  const response = await api.put<Todo>(`/todos/${id}`, todoRequest)

  return response.data
}

export const deleteTodo = async (id: number): Promise<Todo> => {
  const response = await api.delete<Todo>(`/todos/${id}`)

  return response.data
}