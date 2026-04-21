import { Menu, type MenuProps } from "antd";
import { useLocation, useNavigate } from "react-router";
import { useAppSelector } from "../../app/store/store";
import { Roles } from "../../types/users";

const ADMIN_MENU_ITEMS = [
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

const USER_MENU_ITEMS = [
  {
    key: "/todos",
    label: 'Список задач'
  },
  {
    key: "/profile",
    label: 'Личный кабинет'
  },
]

export const SidebarMenu = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const roles = useAppSelector(state => state.authenticate.roles)

  const canViewUsers = roles.some(role => role === Roles.ADMIN || role === Roles.MODERATOR)

  const handleNavigateTo: MenuProps['onClick'] = ({ key }) => {
    navigate(key)
  }

  return (
    <Menu
      selectedKeys={[location.pathname]}
      items={canViewUsers ? ADMIN_MENU_ITEMS : USER_MENU_ITEMS}
      onClick={handleNavigateTo}
    />
  )
}
