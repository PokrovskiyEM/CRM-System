import { Navigate, Outlet } from "react-router"
import { useAppSelector } from "../../app/store/store"

export const ProtectedRoute = () => {
  const isAuthenticated = useAppSelector(state => state.authenticate.isAuthenticated)

  if (!isAuthenticated) {
    return <Navigate to={'/login'} replace />
  }

  return (
    <Outlet />
  )
}