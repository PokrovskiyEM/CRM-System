import { useEffect, useState } from "react"
import { Navigate, Route, Routes } from "react-router"
import { refresh } from "../../api/authApi"
import { getUserProfile } from "../../api/userApi"
import { LoginForm } from "../../components/LoginForm/LoginForm"
import { ProtectedRoute } from "../../components/ProtectedRoute/ProtectedRoute"
import { RegisterForm } from "../../components/RegisterForm/RegisterForm"
import { RoleProtectedRoute } from "../../components/RoleProtectedRoute/RoleProtectedRoute"
import { tokenManager } from "../../helpers/tokenManager"
import { ProfilePage } from "../../pages/ProfilePage/ProfilePage"
import { TodoListPage } from "../../pages/TodoListPage/TodoListPage"
import { UserProfilePage } from "../../pages/UserProfilePage/UserProfilePage"
import { UsersPage } from "../../pages/UsersPage/UsersPage"
import { Roles } from "../../types/users"
import { AuthLayout } from "../layouts/AuthLayout/AuthLayout"
import { MainLayout } from "../layouts/MainLayout"
import { logout, setAuthenticated } from "../store/Authentication/Slices/authSlice"
import { useAppDispatch, useAppSelector } from "../store/store"

export const AppRouter = () => {
  const dispatch = useAppDispatch()
  const isAuthenticated = useAppSelector(state => state.authenticate.isAuthenticated)

  const [isAuthChecked, setIsAuthChecked] = useState<boolean>(false)

  const allowedRoles = [Roles.ADMIN, Roles.MODERATOR]

  useEffect(() => {
    let isCancelled = false

    const tokenCheck = async () => {
      const refreshToken = localStorage.getItem('refreshToken')
      if (!refreshToken) {
        if (!isCancelled) { setIsAuthChecked(true) }
        return
      }

      try {
        const refreshResponse = await refresh({ refreshToken })
        const accessToken = refreshResponse.accessToken

        tokenManager.setToken(accessToken)
        const profile = await getUserProfile()
        dispatch(setAuthenticated({
          roles: profile.roles
        }))
      } catch {
        tokenManager.clearToken()
        localStorage.removeItem('refreshToken')
        dispatch(logout())
      }
      finally {
        if (!isCancelled) {
          setIsAuthChecked(true)
        }
      }
    }

    tokenCheck()

    return () => {
      isCancelled = true
    }
  }, [dispatch])

  if (!isAuthChecked) {
    return null
  }

  return (
    <Routes >
      <Route path="/" element={<Navigate to={isAuthenticated ? '/todos' : '/login'} replace />} />

      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/todos" element={<TodoListPage />} />
          <Route path="/profile" element={<ProfilePage />} />

          <Route element={<RoleProtectedRoute allowedRoles={allowedRoles} />} >
            <Route path="/users" element={<UsersPage />} />
            <Route path="/users/:id" element={<UserProfilePage />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<Navigate to={isAuthenticated ? '/todos' : '/login'} replace />} />
    </Routes>
  )
}