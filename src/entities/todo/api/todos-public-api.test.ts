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
  // getTodos,
  // updateTodo,
  // deleteTodo,
} from "./todos-public-api";

// {
//     id: number;
//     title: string;
//     created: string;
//     isDone: boolean;
// }[]


describe('todos-public-api', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('добавляем задачу', async () => {
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

    expect(res).toEqual(todo)
  })
})