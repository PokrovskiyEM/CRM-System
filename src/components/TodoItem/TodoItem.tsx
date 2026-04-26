import { Checkbox, Form, Input, notification, Typography } from 'antd';
import { useState } from "react";
import { deleteTodo, updateTodo } from "../../api/todosApi";
import type { FormValues, Todo } from "../../types/todo";
import { TodoItemControls } from '../TodoItemControls/TodoItemControls';
import styles from "./styles.module.css";

interface Props {
  todo: Todo
  onTodosUpdated: () => Promise<void>
}

export const TodoItem = ({ todo, onTodosUpdated }: Props) => {
  const [isEdit, setIsEdit] = useState<boolean>(false)
  const [form] = Form.useForm<FormValues>()

  const handleToggle = async () => {
    try {
      await updateTodo(todo.id, {
        isDone: !todo.isDone
      })
      await onTodosUpdated()
    } catch (error) {
      notification.error({
        title: `Ошибка - ${error}`
      })
    }
  }

  const handleDelete = async () => {
    try {
      await deleteTodo(todo.id)
      await onTodosUpdated()
    } catch (error) {
      notification.error({
        title: `Ошибка - ${error}`
      })
    }
  }

  const handleFinish = async (values: FormValues) => {
    const trimmedTitle = values.title.trim()

    try {
      await updateTodo(todo.id, { title: trimmedTitle })
      setIsEdit(false)
      await onTodosUpdated()
    } catch (error) {
      notification.error({
        title: `Ошибка - ${error}`
      })
    }
  }

  const handleStartEdit = () => {
    form.setFieldsValue({ title: todo.title })
    setIsEdit(true)
  }

  const handleCancelEdit = () => {
    setIsEdit(false)
  }

  return (
    <div className={styles.item}>
      <Checkbox
        checked={todo.isDone}
        onChange={handleToggle}
      />
      {!isEdit
        ? (
          <>
            <Typography.Text className={`${styles.title} ${todo.isDone ? styles.checkedTitle : ''}`}>
              {todo.title}
            </Typography.Text>
            <TodoItemControls
              isEdit={false}
              onStartEdit={handleStartEdit}
              onCancelEdit={handleCancelEdit}
              onDelete={handleDelete}
            />
          </>
        )
        : (
          <Form
            form={form}
            onFinish={handleFinish}
            layout="inline"
            style={{
              gap: '10px'
            }}
          >
            <Form.Item
              name={'title'}
              rules={[
                { required: true, message: 'Это поле не может быть пустым' },
                { min: 2, message: 'Минимальная длина текста 2 символа' },
                { max: 64, message: 'Максимальная длина текста 64 символа' },
              ]}
              style={{
                flex: 1,
                margin: 0,
                alignContent: 'center'
              }}
            >
              <Input
                variant="outlined"
                autoFocus
              />
            </Form.Item>
            <TodoItemControls
              isEdit
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