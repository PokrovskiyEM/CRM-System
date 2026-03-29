import type { MetaResponse, Todo, TodoInfo, TodoRequest } from "../types/todo";

const BASE_URL = 'https://easydev.club/api/v1/todos'

export const getTodos = async (filter?: 'all' | 'completed' | 'inWork'): Promise<MetaResponse<Todo, TodoInfo>> => {
  const url = filter ? `${BASE_URL}?filter=${filter}` : BASE_URL

  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Error status: ${response.status}`);
  }

  return response.json()
}

export const addTodo = async (data: TodoRequest) => {
  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error(`Error status: ${response.status}`);
  }
}

export const updateTodos = async (id: number, data: TodoRequest) => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error(`Error status: ${response.status}`);
  }
}

export const deleteTodo = async (id: number) => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE'
  })

  if (!response.ok) {
    throw new Error(`Error status: ${response.status}`);
  }
}