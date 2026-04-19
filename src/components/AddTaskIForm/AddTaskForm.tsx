import { Button, Flex, Form, Input, notification } from "antd";
import { memo } from "react";
import { addTodo } from "../../api/todosApi";
import type { FormValues } from "../../types/todo";

interface Props {
  onTasksUpdated: () => Promise<void>
}

export const AddTaskForm = memo(({ onTasksUpdated }: Props) => {
  const [form] = Form.useForm<FormValues>()

  const handleAddTodo = async (values: FormValues) => {
    const trimTitle = values.title.trim()

    try {
      await addTodo({ title: trimTitle })
      form.resetFields()
      await onTasksUpdated()
    } catch (error) {
      notification.error({
        title: `Ошибка - ${error}`
      })
    }
  }

  return (
    <Flex vertical>
      <Form
        form={form}
        onFinish={handleAddTodo}
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
            borderBottom: '1px solid gray',
            alignContent: 'center'
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