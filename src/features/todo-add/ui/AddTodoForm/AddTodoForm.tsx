import { addTodo } from "@/entities/todo/api/todos-public-api";
import { handleNotificationError } from "@/shared/lib/handle-notification-error";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Form, Input } from "antd";
import { memo } from "react";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import styles from "./styles.module.css";

interface Props {
  onTodosUpdated: () => Promise<void>
}

const schema = z.object({
  title: z
    .string()
    .trim()
    .nonempty('Это поле не может быть пустым')
    .min(2, 'Минимальная длина текста 2 символа')
    .max(64, 'Максимальная длина текста 64 символа')
})

type FormData = z.infer<typeof schema>;

export const AddTodoForm = memo(({ onTodosUpdated }: Props) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
    },
    mode: "onBlur",
  });

  const handleAddTodo = async (values: FormData): Promise<void> => {
    try {
      await addTodo({ title: values.title })
      await onTodosUpdated()
      reset()
    } catch (error) {
      handleNotificationError(error)
    }
  }

  return (
    <form onSubmit={handleSubmit(handleAddTodo)} className={styles.form}>
      <Controller
        name="title"
        control={control}
        render={({ field, fieldState }) => (
          <Form.Item
            className={styles.inputItem}
            style={{
              flex: 1
            }}
            help={fieldState.error?.message}
            validateStatus={fieldState.error ? 'error' : ''}
          >
            <Input
              {...field}
              placeholder="Задача, которую необходимо выполнить..."
              variant="borderless"
            />
          </Form.Item>
        )}
      />
      <Button
        type="primary"
        size="large"
        htmlType="submit"
        loading={isSubmitting}
      >
        Создать
      </Button>
    </form >
  )
})