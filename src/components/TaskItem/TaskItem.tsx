import { DeleteOutlined, EditOutlined, SaveOutlined, UndoOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input, notification, Typography } from 'antd';
import { useState } from "react";
import { deleteTodo, updateTodo } from "../../api/todosApi";
import type { FormValues, Todo } from "../../types/todo";
import styles from "./styles.module.css";

interface Props {
  todo: Todo
  onTasksUpdated: () => Promise<void>
}

export const TaskItem = ({ todo, onTasksUpdated }: Props) => {
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [form] = Form.useForm<FormValues>()

  const handleToggle = async (): Promise<void> => {
    try {
      await updateTodo(todo.id, {
        isDone: !todo.isDone
      })
      await onTasksUpdated()
    } catch (error) {
      notification.error({
        message: `Ошибка - ${error}`
      })
    }
  }

  const handleDelete = async (): Promise<void> => {
    try {
      await deleteTodo(todo.id)
      await onTasksUpdated()
    } catch (error) {
      notification.error({
        message: `Ошибка - ${error}`
      })
    }
  }

  const handleUpdateTodoItem = async (values: FormValues): Promise<void> => {
    const trimTitle = values.title.trim()

    try {
      await updateTodo(todo.id, { title: trimTitle })
      setIsEditing(false)
      await onTasksUpdated()
    } catch (error) {
      notification.error({
        message: `Ошибка - ${error}`
      })
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
            <div className={styles.controls}>
              <Button
                size="large"
                type="primary"
                icon={<EditOutlined />}
                onClick={handleStartEdit}
              />
              <Button
                size="large"
                type="primary"
                danger
                icon={<DeleteOutlined />}
                onClick={handleDelete}
              />
            </div>
          </>
        )
        : (
          <Form
            form={form}
            onFinish={handleUpdateTodoItem}
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
            <div className={styles.controls}>
              <Button
                type="primary"
                size="large"
                htmlType="submit"
                icon={<SaveOutlined />}
              />
              <Button
                variant="solid"
                color="magenta"
                danger
                size="large"
                htmlType="button"
                icon={<UndoOutlined />}
                onClick={handleCancelEdit}
              />
            </div>
          </Form>
        )
      }
    </div >
  )
}