import { deleteTodo, updateTodo } from "@/entities/todo/api/todos-public-api";
import type { FormValues, Todo } from "@/entities/todo/model/types";
import { TodoItemControls } from '@/features/todo-control/ui/TodoItemControls/TodoItemControls';
import { handleNotificationError } from '@/shared/lib/handle-notification-error';
import { Checkbox, Form, Input, Typography } from 'antd';
import { useState } from "react";
import styles from "./styles.module.css";

interface Props {
  todo: Todo
  onTodosUpdated: () => Promise<void>
}

export const TodoItem = ({ todo, onTodosUpdated }: Props) => {
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [form] = Form.useForm<FormValues>()

  const handleToggle = async (): Promise<void> => {
    try {
      await updateTodo(todo.id, {
        isDone: !todo.isDone
      })
      await onTodosUpdated()
    } catch (error) {
      handleNotificationError(error)
    }
  }

  const handleDelete = async (): Promise<void> => {
    try {
      await deleteTodo(todo.id)
      await onTodosUpdated()
    } catch (error) {
      handleNotificationError(error)
    }
  }

  const handleUpdateTodoItem = async (values: FormValues): Promise<void> => {
    const trimmedTitle = values.title.trim()

    try {
      await updateTodo(todo.id, { title: trimmedTitle })
      setIsEditing(false)
      await onTodosUpdated()
    } catch (error) {
      handleNotificationError(error)
    }
  }

  const handleStartEdit = (): void => {
    form.setFieldsValue({ title: todo.title })
    setIsEditing(true)
  }

  const handleCancelEdit = (): void => {
    setIsEditing(false)
  }

  return (
    <div className={styles.item} data-testid='todo-item'>
      <Checkbox
        checked={todo.isDone}
        onChange={handleToggle}
      />
      {!isEditing
        ? (
          <>
            <Typography.Text className={`${styles.title} ${todo.isDone ? styles.checkedTitle : ''}`}>
              {todo.title}
            </Typography.Text>
            <TodoItemControls
              isEditing={false}
              onStartEdit={handleStartEdit}
              onCancelEdit={handleCancelEdit}
              onDelete={handleDelete}
            />
          </>
        )
        : (
          <Form
            form={form}
            onFinish={handleUpdateTodoItem}
            layout="inline"
            className={styles.form}
          >
            <Form.Item
              name={'title'}
              rules={[
                { required: true, message: 'Это поле не может быть пустым' },
                { min: 2, message: 'Минимальная длина текста 2 символа' },
                { max: 64, message: 'Максимальная длина текста 64 символа' },
              ]}
              className={styles.inputItem}
              style={{
                flex: 1
              }}
            >
              <Input
                variant="outlined"
                autoFocus
                data-testid='edit-input'
              />
            </Form.Item>
            <TodoItemControls
              isEditing
              onStartEdit={handleStartEdit}
              onDelete={handleDelete}
              onCancelEdit={handleCancelEdit}
            />
          </Form>
        )
      }
    </div >
  )
}