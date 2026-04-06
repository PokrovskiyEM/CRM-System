import { message, Tabs, type TabsProps } from "antd";
import type { StatusFilter, TodoInfo } from "../../types/todo";
import styles from "./styles.module.css";

interface Props {
  info?: TodoInfo
  onFilterChange: (filter: StatusFilter) => void
  filter: StatusFilter
}

export const TasksFilters = ({ info, onFilterChange, filter }: Props) => {
  function isStatusFilter(key: string): key is StatusFilter {
    return (
      key === 'all' || key === 'inWork' || key === 'completed'
    )
  }

  const handleChange = (key: string) => {
    if (isStatusFilter(key)) {
      onFilterChange(key)
    }
    else message.error('Неверный тип фильтра')
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