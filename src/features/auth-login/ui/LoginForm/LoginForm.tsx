import { signIn } from "@/entities/session/api/auth-api";
import { getUserProfile } from "@/entities/session/api/profile-api";
import { setAuthenticated } from "@/entities/session/model/auth-slice";
import { useAppDispatch, useAppSelector } from "@/shared/lib/store/selectors";
import { tokenManager } from "@/shared/lib/token-manager";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Form, Input, notification, Typography } from "antd";
import axios from "axios";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Link, Navigate, useNavigate } from "react-router";
import * as z from "zod";

const schema = z.object({
  login: z.string().trim().min(1, 'Введите логин'),
  password: z.string().trim().min(1, 'Введите пароль'),
})

type FormData = z.infer<typeof schema>;

export const LoginForm = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const isAuthenticated = useAppSelector(state => state.authenticate.isAuthenticated)

  const {
    control,
    handleSubmit,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      login: "",
      password: "",
    },
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/todos', { replace: true })
    }
  }, [isAuthenticated, navigate])

  if (isAuthenticated) {
    return <Navigate to='/todos' replace />
  }

  const handleLogin = async (values: FormData): Promise<void> => {
    try {
      const data = await signIn(values)

      tokenManager.setToken(data.accessToken)
      localStorage.setItem('refreshToken', data.refreshToken)

      const profile = await getUserProfile()

      dispatch(setAuthenticated({
        roles: profile.roles
      }))

      navigate('/todos', { replace: true })
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        notification.error({
          title: `Неверные логин или пароль`
        })
        return
      }
      notification.error({
        title: `Ошибка входа`
      })
    }
  }

  return (
    <>
      <Typography.Title
        level={3}
      >
        Вход
      </Typography.Title>

      <Form
        layout="vertical"
      >
        <Controller
          name="login"
          control={control}
          render={({ field, fieldState }) => (
            <Form.Item
              required
              label="Логин"
              help={fieldState.error?.message}
              validateStatus={fieldState.error ? 'error' : ''}
            >
              <Input
                {...field}
              />
            </Form.Item>
          )}
        />

        <Controller
          name="password"
          control={control}
          render={({ field, fieldState }) => (
            <Form.Item
              required
              label="Пароль"
              help={fieldState.error?.message}
              validateStatus={fieldState.error ? 'error' : ''}
            >
              <Input.Password
                {...field}
              />
            </Form.Item>
          )}
        />

        <Form.Item>
          <Button
            type="primary"
            htmlType="button"
            style={{ width: "100%" }}
            onClick={handleSubmit(handleLogin)}
          >
            Войти
          </Button>
        </Form.Item>
      </Form>
      <Typography.Paragraph>
        Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
      </Typography.Paragraph>
    </>
  )
}