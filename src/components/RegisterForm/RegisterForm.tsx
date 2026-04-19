import { Button, Form, Input, Modal, notification, Result, Typography } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router";
import { signUp } from "../../api/authApi";
import { useAppSelector } from "../../app/store/store";
import type { UserRegistration } from "../../types/auth";

type FormValues = UserRegistration & {
  repeatPassword: string
}

export const RegisterForm = () => {
  const [isCreated, setIsCreated] = useState<boolean>(false)

  const usernameRegex = /^(?:[A-Za-z]+|[А-Яа-яЁё]+)$/
  const loginRegex = /^[A-Za-z]+$/
  const numberRegex = /^\+7\d{10}$/

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

  const handleRegister = async (values: FormValues): Promise<void> => {
    const trimmedValues: UserRegistration = {
      login: values.login.trim(),
      username: values.username.trim(),
      password: values.password.trim(),
      email: values.email.trim(),
      phoneNumber: values.phoneNumber?.trim() ?? ''
    }

    try {
      const { status } = await signUp(trimmedValues)
      if (status === 201) {
        setIsCreated(true)
      } else {
        notification.error({
          title: `Ошибка регистрации`
        })
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        notification.error({
          title: `Логин или почтовый адрес уже существуют`
        })
        return
      }
      notification.error({
        title: `Ошибка регистрации`
      })
    }
  }

  return (
    <>
      <Typography.Title
        level={3}
      >
        Регистрация
      </Typography.Title>
      <Form
        onFinish={handleRegister}
        layout="vertical"
      >
        <Form.Item
          label="Имя пользователя"
          name="username"
          required
          rules={[
            { min: 1, message: 'Минимальная длина текста 1 символ' },
            { max: 60, message: 'Максимальная длина текста 60 символов' },
            { pattern: usernameRegex, message: 'Используйте русский или латинский алфавит' }
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Логин"
          name="login"
          required
          rules={[
            { min: 2, message: 'Минимальная длина текста 2 символа' },
            { max: 60, message: 'Максимальная длина текста 60 символов' },
            { pattern: loginRegex, message: 'Используйте латинский алфавит' }
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Пароль"
          name="password"
          required
          rules={[
            { min: 6, message: 'Минимальная длина текста 6 символ' },
            { max: 60, message: 'Максимальная длина текста 60 символов' },
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          label="Повторите пароль"
          name="repeatPassword"
          dependencies={['password']}
          rules={[
            { required: true, message: 'Повторите пароль' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve()
                }
                return Promise.reject(new Error('Пароли не совпадают'))
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          label="Почтовый адрес"
          name="email"
          required
          rules={[
            { required: true, message: 'Введите почтовый адрес' },
            { type: "email", message: 'Введите корректный почтовый адрес' }
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Телефон"
          name="phoneNumber"
          rules={[
            { pattern: numberRegex, message: 'Введите корректный номер телефона' }
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            style={{ width: "100%" }}
          >
            Зарегистрироваться
          </Button>
        </Form.Item>
        <Typography.Paragraph>
          Уже есть аккаунт? <Link to="/login">Войти</Link>
        </Typography.Paragraph>
      </Form >

      <Modal open={isCreated} footer={null} onCancel={() => setIsCreated(false)}>
        <Result
          status='success'
          title='Регистрация прошла успешно'
          extra={[
            <Button key='success' type="primary" htmlType="button" onClick={() => navigate('/login')}>
              Перейти к авторизации
            </Button>
          ]}
        />
      </Modal >
    </>
  )
}
