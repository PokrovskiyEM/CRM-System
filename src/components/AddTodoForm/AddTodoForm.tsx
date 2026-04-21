import { Button, Flex, Form, Input, message } from "antd";
import { memo } from "react";
import { addTodo } from "../../api/todosApi";
import type { FormValues } from "../../types/todo";

interface Props {
  onTodosUpdated: () => Promise<void>
}

export const AddTodoForm = memo(({ onTodosUpdated }: Props) => {
  const [form] = Form.useForm<FormValues>()

  const handleFinish = async (values: FormValues) => {
    const trimmedTitle = values.title.trim()

    try {
      await addTodo({ title: trimmedTitle })
      form.resetFields()
      await onTodosUpdated()
    } catch (error) {
      message.error(`Ошибка - ${error}`)
    }
  }

  return (
    <Flex vertical>
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