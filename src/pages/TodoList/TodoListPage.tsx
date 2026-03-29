import { useCallback, useEffect, useState } from "react";
import { AddTaskForm } from "../../components/AddTaskIForm/AddTaskForm";
import { TasksList } from "../../components/TasksList/TasksList";
import type { StatusFilter, Todo, TodoInfo } from "../../types/todo";
import styles from "./styles.module.css";
import { getTodos } from "../../api/todosApi";

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
  }, [filter, fetchTodos])

  const onTaskUpdated = useCallback(() => fetchTodos(filter), [filter, fetchTodos])
  const onTaskCreated = useCallback(() => fetchTodos(filter), [filter, fetchTodos])

  return (
    <main className={styles.main}>
      <AddTaskForm onTaskCreated={onTaskCreated} />
      <TasksList
        info={info}
        todos={todos}
        filter={filter}
        onFilterChange={setFilter}
        onTaskUpdated={onTaskUpdated}
      />
    </main>
  )
}
