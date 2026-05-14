import type { StatusFilter, TodoInfo } from "@/entities/todo/model/types";
import { notification, Tabs, type TabsProps } from "antd";
import styles from "./styles.module.css";

interface Props {
  info?: TodoInfo
  onFilterChange: (filter: StatusFilter) => void
  filter: StatusFilter
}

const isStatusFilter = (key: string): key is StatusFilter => {
  return (
    key === 'all' || key === 'inWork' || key === 'completed'
  )
}

export const TodosFilters = ({ info, onFilterChange, filter }: Props) => {
  const handleChangeFilter = (key: string): void => {
    if (isStatusFilter(key)) {
      onFilterChange(key)
    }
    else notification.error({
      message: `Неверный тип фильтра`
    })
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
      className={styles.todosTabs}
      centered
      size="large"
      activeKey={filter}
      items={items}
      onChange={handleChangeFilter}
    />
  )
}