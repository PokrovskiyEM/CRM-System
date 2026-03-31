import { useCallback, useEffect, useState } from "react";
import { getTodos } from "../../api/todosApi";
import { AddTaskForm } from "../../components/AddTaskIForm/AddTaskForm";
import { TasksList } from "../../components/TasksList/TasksList";
import type { StatusFilter, Todo, TodoInfo } from "../../types/todo";
import styles from "./styles.module.css";

export function TodoListPage() {
  const [filter, setFilter] = useState<StatusFilter>('all')
  const [todos, setTodos] = useState<Todo[]>([])
  const [info, setInfo] = useState<TodoInfo>()

  const fetchTodos = useCallback(async (filter?: StatusFilter) => {
    try {
      const response = await getTodos({ filter });
      setTodos(response.data);
      setInfo(response.info);

    } catch (error) {
      alert(`Ошибка - ${error}`);
    }
  }, []);

  useEffect(() => {
    fetchTodos(filter)

    const intervalId = setInterval(() => {
      fetchTodos(filter)
    }, 5000)

    return () => clearInterval(intervalId)
  }, [filter, fetchTodos])

  const onTasksUpdated = useCallback(() => fetchTodos(filter), [filter, fetchTodos])

  return (
    <main className={styles.main}>
      <AddTaskForm onTasksUpdated={onTasksUpdated} />
      <TasksList
        info={info}
        todos={todos}
        filter={filter}
        onFilterChange={setFilter}
        onTasksUpdated={onTasksUpdated}
      />
    </main>
  )
}
