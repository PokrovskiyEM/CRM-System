import { DeleteOutlined, EditOutlined, SaveOutlined, UndoOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input, message } from 'antd';
import { memo, useState } from "react";
import { deleteTodo, updateTodo } from "../../api/todosApi";
import { validateInput } from "../../helpers/validateInput";
import type { FormValues, Todo } from "../../types/todo";
import styles from "./styles.module.css";

interface Props {
  todo: Todo
  onTasksUpdated: () => Promise<void>
}

export const TaskItem = memo(({ todo, onTasksUpdated }: Props) => {
  const [isEdit, setIsEdit] = useState<boolean>(false)
  const [form] = Form.useForm<FormValues>()

  const handleToggle = async () => {
    try {
      await updateTodo(todo.id, {
        isDone: !todo.isDone
      })
      await onTasksUpdated()
    } catch (error) {
      message.error(`Ошибка - ${error}`)
    }
  }

  const handleDelete = async () => {
    try {
      await deleteTodo(todo.id)
      await onTasksUpdated()
    } catch (error) {
      message.error(`Ошибка - ${error}`)
    }
  }

  const handleFinish = async (values: FormValues) => {
    const trimTitle = values.title.trim()

    try {
      await updateTodo(todo.id, { title: trimTitle })
      setIsEdit(false)
      await onTasksUpdated()
    } catch (error) {
      message.error(`Ошибка - ${error}`)
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
            <p className={`${styles.title} ${todo.isDone ? styles.checkedTitle : ''}`}>{todo.title}</p>
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
            onFinish={handleFinish}
            layout="inline"
            style={{
              gap: '10px'
            }}
          >
            <Form.Item
              name={'title'}
              rules={[
                { validator: validateInput(2, 64) }
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
})