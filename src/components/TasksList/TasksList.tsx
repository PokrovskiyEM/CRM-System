import { memo } from "react";
import type { StatusFilter, Todo, TodoInfo } from "../../types/todo";
import { TaskItem } from "../TaskItem/TaskItem";
import { TasksInfo } from "../TasksInfo/TasksInfo";
import styles from "./styles.module.css";

interface Props {
  todos: Todo[]
  info: TodoInfo | undefined
  filter: StatusFilter
  onFilterChange: (filter: StatusFilter) => void
  onTaskUpdated: () => Promise<void>
}

export const TasksList = memo(({ todos, info, onFilterChange, onTaskUpdated, filter }: Props) => {

  return (
    <section className={styles.container}>
      <div className={styles.wrapper}>
        <TasksInfo info={info} onFilterChanged={onFilterChange} filter={filter} />
        <ul className={styles.list}>
          {todos.map((todo) =>
            <TaskItem key={todo.id} todo={todo} onTaskUpdated={onTaskUpdated} />
          )}
        </ul>
      </div>
    </section>
  )
})