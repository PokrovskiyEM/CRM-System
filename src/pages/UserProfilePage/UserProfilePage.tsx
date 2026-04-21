import { Button, Descriptions, Form, Input, message } from "antd";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { getUserProfileByAdmin, updateUserProfile } from "../../api/adminApi";
import type { Profile } from "../../types/auth";
import styles from "./styles.module.css"
import { PHONE_NUMBER_REGEX, USERNAME_REGEX } from "../../constants/regex";

interface FormValues {
  username?: string,
  email?: string,
  phoneNumber?: string,
}

export const UserProfilePage = () => {
  const navigate = useNavigate()
  const { id } = useParams()

  const [isEditing, setIsEditing] = useState(false)
  const [form] = Form.useForm<FormValues>()

  const [profile, setProfile] = useState<Profile | null>(null)

  useEffect(() => {
    let isCancelled = false

    const fetchProfile = async () => {
      try {
        if (!id) {
          throw new Error("Ошибка чтения id пользователя");
        }
        const data = await getUserProfileByAdmin(+id)
        if (!isCancelled) {
          setProfile(data)
        }
      } catch {
        if (!isCancelled) {
          message.error('Ошибка загрузки данных профиля')
        }
      }
    }

    fetchProfile()

    return () => {
      isCancelled = true
    }
  }, [id])

  const handleStartEditing = () => {
    if (!profile) {
      message.error('Данные профиля отсутствуют')
      return
    }

    form.setFieldsValue({
      username: profile.username,
      email: profile.email,
      phoneNumber: profile.phoneNumber,
    })
    setIsEditing(true)
  }

  const handleUpdateUserProfileInfo = async (values: FormValues) => {
    if (!profile) {
      return
    }

    const updatedValues: FormValues = {}
    if (values.username !== profile.username) {
      updatedValues.username = values.username
    }
    if (values.email !== profile.email) {
      updatedValues.email = values.email
    }
    if (values.phoneNumber !== profile.phoneNumber) {
      updatedValues.phoneNumber = values.phoneNumber
    }
    if (Object.keys(updatedValues).length === 0) {
      return
    }

    try {
      if (!id) {
        throw new Error("Ошибка чтения id пользователя");
      }
      const newProfile = await updateUserProfile(+id, updatedValues)
      setProfile(newProfile);
      setIsEditing(false)
      message.success(`Данные пользователя #${id} обновлены`)
    } catch (error) {
      message.error(`Ошибка - ${error}`)
    }
  }

  if (!profile) {
    return (
      <div>Не удалось загрузить профиль</div>
    )
  }

  return (
    <div className={styles.layout}>
      <div className={styles.content}>
        <Form
          form={form}
          onFinish={handleUpdateUserProfileInfo}
        >
          <Descriptions bordered column={1}>
            {!isEditing
              ? <>
                <Descriptions.Item label={'Имя пользователя'}>{profile?.username}</Descriptions.Item>
                <Descriptions.Item label={'Email'}>{profile?.email}</Descriptions.Item>
                <Descriptions.Item label={'Телефон'}>{profile?.phoneNumber ? profile?.phoneNumber : '-'}</Descriptions.Item>
              </>
              : <>
                <Descriptions.Item label={'Имя пользователя'}>
                  <Form.Item
                    className={styles.autoMarginBottom}
                    name='username'
                    required
                    rules={[
                      { min: 1, message: 'Минимальная длина текста 1 символ' },
                      { max: 60, message: 'Максимальная длина текста 60 символов' },
                      { pattern: USERNAME_REGEX, message: 'Используйте русский или латинский алфавит' }
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Descriptions.Item>
                <Descriptions.Item label={'Email'}>
                  <Form.Item
                    className={styles.autoMarginBottom}
                    name='email'
                    required
                    rules={[
                      { required: true, message: 'Введите почтовый адрес' },
                      { type: "email", message: 'Введите корректный почтовый адрес' }
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Descriptions.Item>
                <Descriptions.Item label={'Телефон'}>
                  <Form.Item
                    className={styles.autoMarginBottom}
                    name='phoneNumber'
                    required
                    rules={[
                      { pattern: PHONE_NUMBER_REGEX, message: 'Введите корректный номер телефона' }
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Descriptions.Item>
              </>
            }
          </Descriptions>
        </Form>

        <Button onClick={handleStartEditing} type="primary">
          Редактировать
        </Button>
        <Button
          onClick={() => form.submit()}
          danger
          disabled={!isEditing}
        >
          Сохранить
        </Button>
        <Button onClick={() => navigate('/users')} >
          Вернуться
        </Button>
      </div >
    </div >
  )
}
