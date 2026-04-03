import { DeleteOutlined, EditOutlined, SaveOutlined, UndoOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input } from 'antd';
import { memo, useState } from "react";
import { deleteTodo, updateTodo } from "../../api/todosApi";
import { validateAntdInput } from "../../helpers/validateAntdInput";
import type { FormValues, Todo } from "../../types/todo";
import styles from "./styles.module.css";

interface Props {
  todo: Todo
  onTasksUpdated: () => Promise<void>
}

export const TaskItem = memo(({ todo, onTasksUpdated }: Props) => {
  const [isEdit, setIsEdit] = useState<boolean>(false)
  const [form] = Form.useForm<FormValues>()

  const toggleHandler = async () => {
    try {
      await updateTodo(todo.id, {
        isDone: !todo.isDone
      })
      await onTasksUpdated()
    } catch (error) {
      alert(`Ошибка - ${error}`);
    }
  }

  const deleteHandler = async () => {
    try {
      await deleteTodo(todo.id)
      await onTasksUpdated()
    } catch (error) {
      alert(`Ошибка - ${error}`);
    }
  }

  const finishHandler = async (values: FormValues) => {
    const trimTitle = values.title.trim()

    try {
      await updateTodo(todo.id, { title: trimTitle })
      setIsEdit(false)
      await onTasksUpdated()
    } catch (error) {
      alert(`Ошибка - ${error}`);
    }
  }

  const startEditHandler = () => {
    form.setFieldsValue({ title: todo.title })
    setIsEdit(true)
  }

  const cancelEditHandler = () => {
    setIsEdit(false)
  }

  return (
    <li className={styles.item}>
      <Checkbox
        checked={todo.isDone}
        onChange={toggleHandler}
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
                onClick={startEditHandler}
              />
              <Button
                size="large"
                type="primary"
                danger
                icon={<DeleteOutlined />}
                onClick={deleteHandler}
              />
            </div>
          </>
        )
        : (
          <Form
            form={form}
            onFinish={finishHandler}
            layout="inline"
            style={{
              gap: '10px'
            }}
          >
            <Form.Item
              name={'title'}
              rules={[
                { validator: validateAntdInput(2, 64) }
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
                onClick={cancelEditHandler}
              />
            </div>
          </Form>
        )
      }
    </li >
  )
})