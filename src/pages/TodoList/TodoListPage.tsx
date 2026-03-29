import { useCallback, useEffect, useState } from "react";
import { AddTaskForm } from "../../components/AddTaskIForm/AddTaskForm";
import { TasksList } from "../../components/TasksList/TasksList";
import { useTodos } from "../../hooks/useTodos";
import type { StatusFilter } from "../../types/todo";
import styles from "./styles.module.css";

export function TodoListPage() {
  const [filter, setFilter] = useState<StatusFilter>('all')
  const { todos, info, fetchTodos } = useTodos()

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
