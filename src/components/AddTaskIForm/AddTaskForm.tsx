import { memo } from "react";
import { addTodo } from "../../api/todosApi";
import { Form, Input, Button } from "antd";
import { validateAntdInput } from "../../helpers/validateAntdInput";
import type { FormValues } from "../../types/todo";

interface Props {
  onTasksUpdated: () => Promise<void>
}

export const AddTaskForm = memo(({ onTasksUpdated }: Props) => {
  const [form] = Form.useForm<FormValues>()

  const finishHandler = async (values: FormValues) => {
    const trimTitle = values.title.trim()

    try {
      await addTodo({ title: trimTitle })
      form.resetFields()
      await onTasksUpdated()
    } catch (error) {
      alert(`Ошибка - ${error}`);
    }
  }

  return (
    <section>
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