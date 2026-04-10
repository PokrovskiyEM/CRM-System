import { Menu } from "antd";
import { useLocation, useNavigate } from "react-router";
import { useAppSelector } from "../../app/store/store";
import { Roles } from "../../types/users";

export const SidebarMenu = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const roles = useAppSelector(state => state.auth.roles)

  const canViewUsers = roles.some(role => role === Roles.ADMIN || role === Roles.MODERATOR)

  const adminItems = [
    {
      key: "/todos",
      label: 'Список задач'
    },
    {
      key: "/profile",
      label: 'Личный кабинет'
    },
    {
      key: "/users",
      label: 'Пользователи'
    },
  ]

  const userItems = [
    {
      key: "/todos",
      label: 'Список задач'
    },
    {
      key: "/profile",
      label: 'Личный кабинет'
    },
  ]

  return (
    <Menu
      selectedKeys={[location.pathname]}
      items={canViewUsers ? adminItems : userItems}
      onClick={({ key }) => navigate(key)}
    />
  )
}
