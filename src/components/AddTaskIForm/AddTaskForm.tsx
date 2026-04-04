import { Button, Form, Input, message } from "antd";
import { memo } from "react";
import { addTodo } from "../../api/todosApi";
import { validateInput } from "../../helpers/validateInput";
import type { FormValues } from "../../types/todo";

interface Props {
  onTasksUpdated: () => Promise<void>
}

export const AddTaskForm = memo(({ onTasksUpdated }: Props) => {
  const [form] = Form.useForm<FormValues>()

  const handleFinish = async (values: FormValues) => {
    const trimTitle = values.title.trim()

    try {
      await addTodo({ title: trimTitle })
      form.resetFields()
      await onTasksUpdated()
    } catch (error) {
      message.error(`Ошибка - ${error}`)
    }
  }

  return (
    <section>
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
    </section >
  )
})