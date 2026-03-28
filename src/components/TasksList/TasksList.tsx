import type { StatusFilter, Todo, TodoInfo } from "../../types/todo.types";
import { TaskItem } from "../TaskItem/TaskItem";
import { TasksInfo } from "../TasksInfo/TasksInfo";
import styles from "./styles.module.css";

interface Props {
  tasks: Todo[]
  info: TodoInfo | undefined
  filter: StatusFilter
  onFilterChange: (filter: StatusFilter) => void
  onTaskUpdated: () => Promise<void>
}

export const TasksList = ({ tasks, info, onFilterChange, onTaskUpdated, filter }: Props) => {

  return (
    <section className={styles.container}>
      <div className={styles.wrapper}>
        <TasksInfo info={info} onFilterChanged={onFilterChange} filter={filter} />
        <ul className={styles.list}>
          {tasks.map((task) =>
            <TaskItem key={task.id} task={task} onTaskUpdated={onTaskUpdated} />
          )}
        </ul>
      </div>
    </section>
  )
}