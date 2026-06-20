import type { StatusFilter, Todo, TodoInfo } from "@/entities/todo/model/types";
import { TodoItem } from "@/features/todo-item/ui/TodoItem/TodoItem";
import { TodosFilters } from "@/features/todos-filter/ui/TodosFilters/TodosFilters";
import { Flex, Space } from "antd";

interface Props {
  todos: Todo[]
  info?: TodoInfo
  filter: StatusFilter
  onFilterChange: (filter: StatusFilter) => void
  onTodosUpdated: () => Promise<void>
}

export const TodosList = ({ todos, info, onFilterChange, onTodosUpdated, filter }: Props) => {
  return (
    <Flex vertical gap='small'>
      <TodosFilters info={info} onFilterChange={onFilterChange} filter={filter} />
      <Space
        orientation="vertical"
        style={{ paddingInline: 5 }}
      >
        {todos.map((todo) =>
          <TodoItem key={todo.id} todo={todo} onTodosUpdated={onTodosUpdated} />
        )}
      </Space>
    </Flex>
  )
}