import type { Role } from "@/entities/session/model/types"
import { useAppSelector } from "@/shared/lib/store/selectors"
import { Navigate, Outlet } from "react-router"

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