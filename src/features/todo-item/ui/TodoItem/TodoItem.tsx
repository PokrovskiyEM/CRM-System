import { deleteTodo, updateTodo } from "@/entities/todo/api/todos-public-api";
import type { Todo } from "@/entities/todo/model/types";
import { TodoItemControls } from '@/features/todo-control/ui/TodoItemControls/TodoItemControls';
import { handleNotificationError } from '@/shared/lib/handle-notification-error';
import { zodResolver } from "@hookform/resolvers/zod";
import { Checkbox, Form, Input, Typography } from 'antd';
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import styles from "./styles.module.css";

interface Props {
  todo: Todo
  onTodosUpdated: () => Promise<void>
}

const schema = z.object({
  title: z
    .string()
    .trim()
    .nonempty('Это поле не может быть пустым')
    .min(2, 'Минимальная длина текста 2 символа')
    .max(64, 'Максимальная длина текста 64 символа')
})

type FormData = z.infer<typeof schema>;

export const TodoItem = ({ todo, onTodosUpdated }: Props) => {
  const [isEditing, setIsEditing] = useState<boolean>(false)

  const {
    control,
    handleSubmit,
    reset
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: todo.title
    },
    mode: "onBlur",
  });

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

  const handleUpdateTodoItem = async (values: FormData): Promise<void> => {
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
    setIsEditing(true)
    reset({
      title: todo.title
    })
  }

  const handleCancelEdit = (): void => {
    setIsEditing(false)
  }

  return (
    <div className={styles.item}>
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
          <form
            onSubmit={handleSubmit(handleUpdateTodoItem)}
            className={styles.form}
          >
            <Controller
              name="title"
              control={control}
              render={({ field, fieldState }) => (
                <Form.Item
                  className={styles.inputItem}
                  style={{ flex: 1 }}
                  help={fieldState.error?.message}
                  validateStatus={fieldState.error ? 'error' : ''}
                >
                  <Input
                    variant="outlined"
                    autoFocus
                    {...field}
                  />
                </Form.Item>
              )}
            />

            <TodoItemControls
              isEditing
              onStartEdit={handleStartEdit}
              onDelete={handleDelete}
              onCancelEdit={handleCancelEdit}
            />
          </form>
        )
      }
    </div >
  )
}