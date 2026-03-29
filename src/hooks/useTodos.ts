import { useCallback, useState } from "react"
import { getTodos } from "../api/todosApi"
import type { StatusFilter, Todo, TodoInfo } from "../types/todo"

export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([])
  const [info, setInfo] = useState<TodoInfo>()

  const fetchTodos = useCallback(async (filter?: StatusFilter) => {
    try {
      const response = await getTodos({ filter });
      setTodos(response.data);
      setInfo(response.info);

    } catch (error) {
      console.log(`Ошибка - ${error}`);
    }
  }, []);

  return { todos, info, fetchTodos }
}