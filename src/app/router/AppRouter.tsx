import { useEffect, useState } from "react"
import { Navigate, Route, Routes } from "react-router"
import { refresh } from "../../api/authApi"
import { LoginForm } from "../../components/LoginForm/LoginForm"
import { ProtectedRoute } from "../../components/ProtectedRoute/ProtectedRoute"
import { RegisterForm } from "../../components/RegisterForm/RegisterForm"
import { tokenManager } from "../../helpers/tokenManager"
import { ProfilePage } from "../../pages/ProfilePage/ProfilePage"
import { TodoListPage } from "../../pages/TodoListPage/TodoListPage"
import { AuthLayout } from "../layouts/AuthLayout"
import { MainLayout } from "../layouts/MainLayout"
import { logout, setAuth } from "../slices/authSlice"
import { useAppDispatch, useAppSelector } from "../store/store"

export const AppRouter = () => {
  const dispatch = useAppDispatch()
  const isAuth = useAppSelector(state => state.auth.isAuth)

  const [authChecked, setAuthChecked] = useState(false)

  useEffect(() => {
    let isCancelled = false

    const tokenCheck = async () => {
      const refreshToken = localStorage.getItem('refreshToken')
      if (!refreshToken) {
        if (!isCancelled) { setAuthChecked(true) }
        return
      }

      try {
        const refreshResponse = await refresh({ refreshToken })
        const accessToken = refreshResponse.accessToken

        tokenManager.setToken(accessToken)
        dispatch(setAuth(true))
      } catch {
        tokenManager.clearToken()
        localStorage.removeItem('refreshToken')
        dispatch(logout())
      }
      finally {
        if (!isCancelled) {
          setAuthChecked(true)
        }
      }
    }

    tokenCheck()

    return () => {
      isCancelled = true
    }
  }, [dispatch])

  if (!authChecked) {
    return null
  }

  return (
    <Routes >
      <Route path="/" element={<Navigate to={isAuth ? '/todos' : '/login'} replace />} />

      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/todos" element={<TodoListPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to={isAuth ? '/todos' : '/login'} replace />} />

    </Routes>
  )
}