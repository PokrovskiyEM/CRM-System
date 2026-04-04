import { Space } from "antd";
import type { StatusFilter, Todo, TodoInfo } from "../../types/todo";
import { TaskItem } from "../TaskItem/TaskItem";
import { TasksFilters } from "../TasksFilters/TasksFilters";
import styles from "./styles.module.css";

interface Props {
  todos: Todo[]
  info?: TodoInfo
  filter: StatusFilter
  onFilterChange: (filter: StatusFilter) => void
  onTasksUpdated: () => Promise<void>
}

export const TasksList = ({ todos, info, onFilterChange, onTasksUpdated, filter }: Props) => {

  return (
    <section className={styles.container}>
      <div className={styles.wrapper}>
        <TasksFilters info={info} onFilterChange={onFilterChange} filter={filter} />
        <Space orientation="vertical">
          {todos.map((todo) =>
            <TaskItem key={todo.id} todo={todo} onTasksUpdated={onTasksUpdated} />
          )}
        </Space>
      </div>
    </section>
  )
}