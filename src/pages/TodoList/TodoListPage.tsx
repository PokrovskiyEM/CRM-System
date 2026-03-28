import { useCallback, useEffect, useState } from "react";
import { AddTaskForm } from "../../components/AddTaskIForm/AddTaskForm";
import { TasksList } from "../../components/TasksList/TasksList";
import { useTodos } from "../../hooks/useTodos";
import type { StatusFilter } from "../../types/todo.types";
import styles from "./styles.module.css";

export function TodoListPage() {
  const [filter, setFilter] = useState<StatusFilter>('all')
  const { tasks, info, fetchTasks } = useTodos()

  useEffect(() => {
    fetchTasks(filter)
  }, [filter, fetchTasks])

  const onTaskUpdated = useCallback(() => fetchTasks(filter), [filter, fetchTasks])
  const onTaskCreated = useCallback(() => fetchTasks(filter), [filter, fetchTasks])

  return (
    <main className={styles.main}>
      <AddTaskForm onTaskCreated={onTaskCreated} />
      <TasksList
        info={info}
        tasks={tasks}
        filter={filter}
        onFilterChange={setFilter}
        onTaskUpdated={onTaskUpdated}
      />
    </main>
  )
}
