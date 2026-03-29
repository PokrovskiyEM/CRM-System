import type { MetaResponse, Todo, TodoInfo, TodoRequest } from "../types/todo";

const BASE_URL = 'https://easydev.club/api/v1/todos'

export const todosApi = {
  getTasks: async (filter?: 'all' | 'completed' | 'inWork'): Promise<MetaResponse<Todo, TodoInfo>> => {
    const url = filter ? `${BASE_URL}?filter=${filter}` : BASE_URL

    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`Error status: ${response.status}`);
    }

    return response.json()
  },

  addTask: async (data: TodoRequest) => {
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
  },

  updateTask: async (id: number, data: TodoRequest) => {
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
  },

  deleteTask: async (id: number) => {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'DELETE'
    })

    if (!response.ok) {
      throw new Error(`Error status: ${response.status}`);
    }
  }
}