import { Flex, Space } from "antd";
import type { StatusFilter, Todo, TodoInfo } from "../../types/todo";
import { TaskItem } from "../TaskItem/TaskItem";
import { TasksFilters } from "../TasksFilters/TasksFilters";

interface Props {
  todos: Todo[]
  info?: TodoInfo
  filter: StatusFilter
  onFilterChange: (filter: StatusFilter) => void
  onTasksUpdated: () => Promise<void>
}

export const TasksList = ({ todos, info, onFilterChange, onTasksUpdated, filter }: Props) => {

  return (
    <Flex vertical gap='small'>
      <TasksFilters info={info} onFilterChange={onFilterChange} filter={filter} />
      <Space orientation="vertical" style={{ paddingInline: 5 }}>
        {todos.map((todo) =>
          <TaskItem key={todo.id} todo={todo} onTasksUpdated={onTasksUpdated} />
        )}
      </Space>
    </Flex>
  )
}