import { Navigate, Outlet } from "react-router"
import { useAppSelector } from "../../app/store/store"
import type { Roles } from "../../types/users"

interface Props {
  allowedRoles: Roles[]
}

export const RoleProtectedRoute = ({ allowedRoles }: Props) => {
  const { roles } = useAppSelector(state => state.auth)

  const hasAccess = roles.some(role => allowedRoles.includes(role))

  if (!hasAccess) {
    return <Navigate to={'/todos'} replace />
  }

  return (
    <Outlet />
  )
}