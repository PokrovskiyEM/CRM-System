import type { Profile } from "@/entities/session/model/types";
import { getUserProfileByAdmin, updateUserProfile } from "@/entities/user/api/admin-api";
import { PHONE_NUMBER_REGEX, USERNAME_REGEX } from "@/shared/config/regex";
import { handleNotificationError } from "@/shared/lib/handle-notification-error";
import { Button, Descriptions, Form, Input, message, notification } from "antd";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import styles from "./styles.module.css";

interface FormValues {
  username?: string,
  email?: string,
  phoneNumber?: string,
}

const getChangedFields = <T extends object>(original: T, updated: Partial<T>): Partial<T> => {
  const result: Partial<T> = {}

  const keys = Object.keys(updated) as (keyof T)[]

  keys.forEach(key => {
    const originalValue = original[key]
    const updatedValue = updated[key]

    if (updatedValue !== originalValue) {
      result[key] = updatedValue
    }
  })

  return result
}

export const UserProfilePage = () => {
  const navigate = useNavigate()
  const { id } = useParams()

  const [isEditing, setIsEditing] = useState<boolean>(false)
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
          notification.error({
            title: `Данные профиля отсутствуют`
          })
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
      notification.error({
        title: `Данные профиля отсутствуют`
      })
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

    const updatedValues = getChangedFields<Profile>(profile, values)

    try {
      if (!id) {
        throw new Error("Ошибка чтения id пользователя");
      }
      const newProfile = await updateUserProfile(+id, updatedValues)
      setProfile(newProfile);
      setIsEditing(false)
      message.success(`Данные пользователя #${id} обновлены`)
    } catch (error) {
      handleNotificationError(error)
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
