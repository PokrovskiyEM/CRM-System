import { useAppSelector } from "@/shared/lib/store/selectors"
import { Navigate, Outlet } from "react-router"

export const ProtectedRoute = () => {
  const isAuthenticated = useAppSelector(state => state.authenticate.isAuthenticated)

  if (!isAuthenticated) {
    return <Navigate to={'/login'} replace />
  }

  return (
    <Outlet />
  )
}