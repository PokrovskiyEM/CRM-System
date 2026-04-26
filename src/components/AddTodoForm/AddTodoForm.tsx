import { Button, Flex, Form, Input } from "antd";
import { memo } from "react";
import { addTodo } from "../../api/todosApi";
import { handleNotificationError } from "../../helpers/handleNotificationError";
import type { FormValues } from "../../types/todo";
import styles from "./styles.module.css";

interface Props {
  onTodosUpdated: () => Promise<void>
}

export const AddTodoForm = memo(({ onTodosUpdated }: Props) => {
  const [form] = Form.useForm<FormValues>()

  const handleAddTodo = async (values: FormValues): Promise<void> => {
    const trimmedTitle = values.title.trim()

    try {
      await addTodo({ title: trimmedTitle })
      form.resetFields()
      await onTodosUpdated()
    } catch (error) {
      handleNotificationError(error)
    }
  }

  return (
    <Flex vertical>
      <Form
        form={form}
        onFinish={handleAddTodo}
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
            placeholder="Задача, которую необходимо выполнить..."
            variant="borderless"
          />
        </Form.Item>
        <Button
          type="primary"
          size="large"
          htmlType="submit"
        >
          Создать
        </Button>
      </Form>
    </Flex >
  )
})