import { memo } from "react";
import { addTodo } from "../../api/todosApi";
import { Form, Input, Button } from "antd";
import { validateAntdTitle } from "../../helpers/validateAntdTitle";

interface Props {
  onTasksUpdated: () => Promise<void>
}

interface FormValues {
  title: string
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
      >
        <Form.Item
          name={'title'}
          rules={[
            { validator: validateAntdTitle }
          ]}
          style={{
            flex: 1,
            marginBottom: 0,
            borderBottom: '1px solid gray',
            alignContent: 'center'
          }}
        >
          <Input
            placeholder="Task To Be Done..."
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