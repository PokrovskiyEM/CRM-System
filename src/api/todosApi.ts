import type { GetTodosQueryParams, MetaResponse, Todo, TodoInfo, TodoRequest } from "../types/todo";

const BASE_URL = 'https://easydev.club/api/v1/todos'

export const getTodos = async (queryParams?: GetTodosQueryParams): Promise<MetaResponse<Todo, TodoInfo>> => {
  let query = null

  if (queryParams) {
    const searchParams = new URLSearchParams()
    Object.entries(queryParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value))
      }
    })
    query = searchParams.toString()
  }

  const url = query ? BASE_URL + '?' + query : BASE_URL
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