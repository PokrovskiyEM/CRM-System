import type { StatusFilter, TodoInfo } from "../../types/todo";
import styles from "./styles.module.css";

interface Props {
  info: TodoInfo | undefined
  onFilterChanged: (filter: StatusFilter) => void
  filter: StatusFilter
}

export const TasksInfo = ({ info, onFilterChanged, filter }: Props) => {
  const changeFilter = (filter: StatusFilter) => {
    onFilterChanged(filter)
  }

  return (
    <div className={styles.todoInfo}>
      <button
        className={`${styles.button} ${filter === 'all' ? styles.active : ''}`}
        onClick={() => changeFilter('all')}
      >
        Все({info?.all})
      </button>
      <button
        className={`${styles.button} ${filter === 'inWork' ? styles.active : ''}`}
        onClick={() => changeFilter('inWork')}
      >
        в работе({info?.inWork})
      </button>
      <button
        className={`${styles.button} ${filter === 'completed' ? styles.active : ''}`}
        onClick={() => changeFilter('completed')}
      >
        сделано({info?.completed})
      </button>
    </div >
  )
}