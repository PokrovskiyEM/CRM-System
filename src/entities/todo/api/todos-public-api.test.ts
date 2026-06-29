import { describe, expect, test, vi, beforeEach } from "vitest";

const mockApi = vi.hoisted(() => ({
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  delete: vi.fn(),
}));

vi.mock("axios", () => ({
  default: {
    create: () => mockApi,
  },
}));

import {
  addTodo,
  getTodos,
  // updateTodo,
  // deleteTodo,
} from "./todos-public-api";

describe('todos-public-api', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });


  describe('getTodos', () => {
    const getTodosResponse = {
      todos: [],
      info: {
        all: 0,
        completed: 0,
        inWork: 0,
      },
    };

    test.each([
      ['all'],
      ['inWork'],
      ['completed']
    ])('передаем фильтр "%s" в параметрах', async (filter) => {
      mockApi.get.mockResolvedValue({
        data: getTodosResponse,
      })

      const res = await getTodos({ filter })

      expect(mockApi.get).toHaveBeenCalledWith('/todos', {
        params: { filter }
      })

      expect(mockApi.get).toHaveBeenCalledTimes(1);

      expect(res).toEqual(getTodosResponse)
    })
  })

  describe('addTodo', () => {
    test('передаем заголовок задачи в параметрах', async () => {
      const todo = {
        id: 29317,
        title: "TestTask",
        created: "2026-06-20T14:12:51.520886Z",
        isDone: false
      }

      mockApi.post.mockResolvedValue({
        data: todo
      })

      const res = await addTodo({
        title: "TestTask"
      })

      expect(mockApi.post).toHaveBeenCalledWith('/todos', {
        title: "TestTask"
      })

      expect(mockApi.post).toHaveBeenCalledTimes(1);

      expect(res).toEqual(todo)
    })
  })

})