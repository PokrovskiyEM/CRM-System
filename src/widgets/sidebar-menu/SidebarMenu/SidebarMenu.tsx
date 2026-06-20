import { Role } from "@/entities/session/model/types";
import { useAppSelector } from "@/shared/lib/store/selectors";
import { Menu, type MenuProps } from "antd";
import { useLocation, useNavigate } from "react-router";

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

const ADMIN_MENU_ITEMS = [
  ...USER_MENU_ITEMS,
  {
    key: "/users",
    label: 'Пользователи'
  },
  {
    key: "/finance",
    label: 'Финансовая аналитика'
  },
]

export const SidebarMenu = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const roles = useAppSelector(state => state.authenticate.roles)

  const canViewUsers = roles.some(role => role === Role.ADMIN || role === Role.MODERATOR)

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
