import { useCallback, useState } from "react"
import type { Todo, TodoInfo } from "../types/todo.types"
import { todosApi } from "../api/todosApi"

export const useTodos = () => {
  const [tasks, setTasks] = useState<Todo[]>([])
  const [info, setInfo] = useState<TodoInfo>()

  const fetchTasks = useCallback(async (filter?: 'all' | 'completed' | 'inWork') => {
    try {
      const response = await todosApi.getTasks(filter);
      setTasks(response.data);
      setInfo(response.info);

    } catch (error) {
      console.log(`Ошибка - ${error}`);
    }
  }, []);

  return { tasks, info, fetchTasks }
}