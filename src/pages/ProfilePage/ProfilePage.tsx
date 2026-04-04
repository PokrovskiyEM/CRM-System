import { Button, Descriptions, message } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { getUserProfile, logoutProfile } from "../../api/userApi";
import { logout } from "../../app/slices/authSlice";
import { useAppDispatch } from "../../app/store/store";
import { tokenManager } from "../../helpers/tokenManager";
import type { Profile } from "../../types/auth";

export function ProfilePage() {
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
          message.error('Ошибка загрузки данных профиля')
        }
      }
    }

    fetchProfile()

    return () => {
      isCancelled = true
    }
  }, [])

  const logoutHandler = async () => {
    try {
      await logoutProfile()
      tokenManager.clearToken()
      localStorage.removeItem('refreshToken')
      dispatch(logout())

      navigate('/login', { replace: true })
    } catch {
      message.error('Ошибка выхода')
    }
  }

  if (!profile) {
    return (
      <div>Не удалось загрузить профиль</div>
    )
  }

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      padding: 25,
    }}>
      <div style={{
        width: 500,
        display: 'flex',
        flexDirection: 'column',
        rowGap: 20
      }}>
        <Descriptions bordered column={1}>
          <Descriptions.Item label={'Имя пользователя'}>{profile.username}</Descriptions.Item>
          <Descriptions.Item label={'Email'}>{profile.email}</Descriptions.Item>
          <Descriptions.Item label={'Телефон'}>{profile.phoneNumber ? profile.phoneNumber : '-'}</Descriptions.Item>
        </Descriptions>

        <Button danger onClick={logoutHandler} >
          Выйти
        </Button>
      </div >
    </div>
  )
}
