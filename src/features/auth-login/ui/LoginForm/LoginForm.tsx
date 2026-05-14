import { signIn } from "@/entities/session/api/auth-api";
import { getUserProfile } from "@/entities/session/api/profile-api";
import { setAuthenticated } from "@/entities/session/model/auth-slice";
import type { AuthData } from "@/entities/session/model/types";
import { useAppDispatch, useAppSelector } from "@/shared/lib/store/selectors";
import { tokenManager } from "@/shared/lib/token-manager";
import { Button, Form, Input, notification, Typography } from "antd";
import axios from "axios";
import { useEffect } from "react";
import { Link, Navigate, useNavigate } from "react-router";

export const LoginForm = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const isAuthenticated = useAppSelector(state => state.authenticate.isAuthenticated)

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/todos', { replace: true })
    }
  }, [isAuthenticated, navigate])

  if (isAuthenticated) {
    return <Navigate to='/todos' replace />
  }

  const handleLogin = async (values: AuthData): Promise<void> => {
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
        onFinish={handleLogin}
        layout="vertical"
      >
        <Form.Item
          label="Логин"
          name="login"
          rules={[
            { required: true, message: 'Введите логин' },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Пароль"
          name="password"
          rules={[
            { required: true, message: 'Введите пароль' },
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            style={{ width: "100%" }}
          >
            Войти
          </Button>
        </Form.Item>
        <Typography.Paragraph>
          Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
        </Typography.Paragraph>
      </Form>
    </>
  )
}