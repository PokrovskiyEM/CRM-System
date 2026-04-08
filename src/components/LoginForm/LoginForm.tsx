import { Button, Form, Input, message, Typography } from "antd";
import axios from "axios";
import { useEffect } from "react";
import { Link, Navigate, useNavigate } from "react-router";
import { signIn } from "../../api/authApi";
import { setAuth } from "../../app/slices/authSlice";
import { useAppDispatch, useAppSelector } from "../../app/store/store";
import { tokenManager } from "../../helpers/tokenManager";
import type { AuthData } from "../../types/auth";

export function LoginForm() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const isAuth = useAppSelector(state => state.auth.isAuth)

  useEffect(() => {
    if (isAuth) {
      navigate('/todos', { replace: true })
    }
  }, [isAuth, navigate])

  if (isAuth) {
    return <Navigate to='/todos' replace />
  }


  const handleFinish = async (values: AuthData) => {
    try {
      const data = await signIn(values)

      tokenManager.setToken(data.accessToken)
      localStorage.setItem('refreshToken', data.refreshToken)

      dispatch(setAuth(true))
      navigate('/todos', { replace: true })
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        message.error('Неверные логин или пароль')
        return
      }
      message.error('Ошибка входа')
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
        onFinish={handleFinish}
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