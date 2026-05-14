import { getUserProfile, logoutProfile } from "@/entities/session/api/profile-api";
import { logout } from "@/entities/session/model/auth-slice";
import type { Profile } from "@/entities/session/model/types";
import { useAppDispatch } from "@/shared/lib/store/selectors";
import { tokenManager } from "@/shared/lib/token-manager";
import { Button, Descriptions, notification, Typography } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import styles from "./styles.module.css";

export const ProfilePage = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const [profile, setProfile] = useState<Profile | null>(null)

  useEffect(() => {
    let isCancelled = false

    const fetchProfile = async () => {
      try {
        const data = await getUserProfile()
        if (!isCancelled) {
          setProfile(data)
        }
      } catch {
        if (!isCancelled) {
          notification.error({
            message: `Ошибка загрузки данных профиля`
          })
        }
      }
    }

    fetchProfile()

    return () => {
      isCancelled = true
    }
  }, [])

  const handleLogout = async (): Promise<void> => {
    try {
      await logoutProfile()
      tokenManager.clearToken()
      localStorage.removeItem('refreshToken')
      dispatch(logout())

      navigate('/login', { replace: true })
    } catch {
      notification.error({
        message: `Ошибка выхода`
      })
    }
  }

  if (!profile) {
    return (
      <Typography.Title
        level={4}
      >
        Не удалось загрузить профиль
      </Typography.Title>
    )
  }

  return (
    <div className={styles.layout}>
      <div className={styles.content}>
        <Descriptions bordered column={1}>
          <Descriptions.Item label={'Имя пользователя'}>{profile.username}</Descriptions.Item>
          <Descriptions.Item label={'Email'}>{profile.email}</Descriptions.Item>
          <Descriptions.Item label={'Телефон'}>{profile.phoneNumber ? profile.phoneNumber : '-'}</Descriptions.Item>
        </Descriptions>

        <Button danger onClick={handleLogout} >
          Выйти
        </Button>
      </div >
    </div>
  )
}
