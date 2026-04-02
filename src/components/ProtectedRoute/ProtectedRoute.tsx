import { Navigate, Outlet } from "react-router"
import { useAppSelector } from "../../app/store/store"

export const ProtectedRoute = () => {
  const isAuth = useAppSelector(state => state.auth.isAuth)

  if (!isAuth) {
    return <Navigate to={'/login'} replace />
  }

  return (
    <Outlet />
  )
}