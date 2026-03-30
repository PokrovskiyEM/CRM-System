import { Tabs, type TabsProps } from "antd";
import type { StatusFilter, TodoInfo } from "../../types/todo";
import styles from "./styles.module.css";

interface Props {
  info: TodoInfo | undefined
  onFilterChange: (filter: StatusFilter) => void
  filter: StatusFilter
}

export const TasksFilters = ({ info, onFilterChange, filter }: Props) => {
  const handleChange = (key: string) => {
    onFilterChange(key as StatusFilter)
  }

  const items: TabsProps['items'] = [
    {
      key: 'all',
      label: `Все(${info?.all ?? 0})`,
    },
    {
      key: 'inWork',
      label: `В работе(${info?.inWork ?? 0})`,
    },
    {
      key: 'completed',
      label: `Сделано(${info?.completed ?? 0})`,
    },
  ];

  return (
    <Tabs
      className={styles.tasksTabs}
      centered
      size="large"
      activeKey={filter}
      items={items}
      onChange={handleChange}
    />
  )
}