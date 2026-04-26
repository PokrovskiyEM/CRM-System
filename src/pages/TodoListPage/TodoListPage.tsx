import { notification } from "antd";
import { useCallback, useEffect, useState } from "react";
import { getTodos } from "../../api/todosApi";
import { AddTodoForm } from "../../components/AddTodoForm/AddTodoForm";
import { TodosList } from "../../components/TodosList/TodosList";
import type { StatusFilter, Todo, TodoInfo } from "../../types/todo";
import styles from "./styles.module.css";

export const TodoListPage = () => {
  const [filter, setFilter] = useState<StatusFilter>('all')
  const [todos, setTodos] = useState<Todo[]>([])
  const [info, setInfo] = useState<TodoInfo>()

  const fetchTodos = useCallback(async (filter?: StatusFilter) => {
    try {
      const response = await getTodos({ filter });
      setTodos(response.data);
      setInfo(response.info);

    } catch (error) {
      notification.error({
        message: `Ошибка - ${error}`
      })
    }
  }, []);

  useEffect(() => {
    fetchTodos(filter)

    const intervalId = setInterval(() => {
      fetchTodos(filter)
    }, 5000)

    return () => clearInterval(intervalId)
  }, [filter, fetchTodos])

  const onTodosUpdated = useCallback(() => fetchTodos(filter), [filter, fetchTodos])

  return (
    <main className={styles.main}>
      <AddTodoForm onTodosUpdated={onTodosUpdated} />
      <TodosList
        info={info}
        todos={todos}
        filter={filter}
        onFilterChange={setFilter}
        onTodosUpdated={onTodosUpdated}
      />
    </main>
  )
}
