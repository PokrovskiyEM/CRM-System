import { Navigate, Outlet } from "react-router"
import { useAppSelector } from "../../app/store/store"
import type { Role } from "../../types/users"

interface Props {
  allowedRoles: Role[]
}

export const RoleProtectedRoute = ({ allowedRoles }: Props) => {
  const { roles } = useAppSelector(state => state.authenticate)

  const hasAccess = roles.some(role => allowedRoles.includes(role))

  if (!hasAccess) {
    return <Navigate to={'/todos'} replace />
  }

  return (
    <Outlet />
  )
}