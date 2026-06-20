import { refresh } from "@/entities/session/api/auth-api"
import { getUserProfile } from "@/entities/session/api/profile-api"
import { logout, setAuthenticated } from "@/entities/session/model/auth-slice"
import { Role } from "@/entities/session/model/types"
import { ProtectedRoute } from "@/entities/session/ui/ProtectedRoute/ProtectedRoute"
import { RoleProtectedRoute } from "@/entities/session/ui/RoleProtectedRoute/RoleProtectedRoute"
import { LoginForm } from "@/features/auth-login/ui/LoginForm/LoginForm"
import { RegisterForm } from "@/features/auth-register/ui/RegisterForm/RegisterForm"
import FinanceAnalyticsPage from "@/pages/FinanceAnalytics"
import ProfilePage from "@/pages/Profile"
import TodoListPage from "@/pages/TodoList"
import UserProfilePage from "@/pages/UserProfile"
import UsersPage from "@/pages/Users"
import { useAppDispatch, useAppSelector } from "@/shared/lib/store/selectors"
import { tokenManager } from "@/shared/lib/token-manager"
import { useEffect, useState } from "react"
import { Navigate, Route, Routes } from "react-router"
import { AuthLayout } from "../layouts/AuthLayout/AuthLayout"
import { MainLayout } from "../layouts/MainLayout/MainLayout"

export const AppRouter = () => {
  const dispatch = useAppDispatch()
  const isAuthenticated = useAppSelector(state => state.authenticate.isAuthenticated)

  const [isAuthChecked, setIsAuthChecked] = useState<boolean>(false)

  const allowedRoles = [
    Role.ADMIN,
    Role.MODERATOR
  ]

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
            <Route path="/finance" element={<FinanceAnalyticsPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<Navigate to={isAuthenticated ? '/todos' : '/login'} replace />} />
    </Routes>
  )
}