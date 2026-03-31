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

export const addTodo = async (todoRequest: TodoRequest): Promise<void> => {
  await api.post('/todos', todoRequest)
}

export const updateTodos = async (id: number, todoRequest: TodoRequest): Promise<void> => {
  await api.put(`/todos/${id}`, todoRequest)
}

export const deleteTodo = async (id: number): Promise<void> => {
  await api.delete(`/todos/${id}`)
}