import { Flex, Space } from "antd";
import type { StatusFilter, Todo, TodoInfo } from "../../types/todo";
import { TodoItem } from "../TodoItem/TodoItem";
import { TodosFilters } from "../TodosFilters/TodosFilters";

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