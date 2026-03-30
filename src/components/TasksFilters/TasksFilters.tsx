import type { StatusFilter, TodoInfo } from "../../types/todo";
import { Tab } from "../../ui-kit/Tab/Tab";
import styles from "./styles.module.css";

interface Props {
  info: TodoInfo | undefined
  onFilterChange: (filter: StatusFilter) => void
  filter: StatusFilter
}

export const TasksFilters = ({ info, onFilterChange, filter }: Props) => {
  const changeFilter = (filter: StatusFilter) => {
    onFilterChange(filter)
  }

  return (
    <div className={styles.todoInfo}>
      <Tab
        isActive={filter === 'all'}
        onClick={() => changeFilter('all')}
      >
        Все({info?.all})
      </Tab>
      <Tab
        isActive={filter === 'inWork'}
        onClick={() => changeFilter('inWork')}
      >
        В работе({info?.inWork})
      </Tab>
      <Tab
        isActive={filter === 'completed'}
        onClick={() => changeFilter('completed')}
      >
        Сделано({info?.completed})
      </Tab>
    </div >
  )
}