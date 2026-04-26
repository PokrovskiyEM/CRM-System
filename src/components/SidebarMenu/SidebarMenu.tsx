import { Menu, type MenuProps } from "antd";
import { useLocation, useNavigate } from "react-router";

type MenuItem = Required<MenuProps>['items'][number];

const MENU_ITEMS: MenuItem[] = [
  {
    key: "/todos",
    label: 'Список задач'
  },
  {
    key: "/profile",
    label: 'Профиль'
  },
]

export const SidebarMenu = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigateTo: MenuProps['onClick'] = ({ key }) => {
    navigate(key)
  }

  return (
    <Menu
      selectedKeys={[location.pathname]}
      items={MENU_ITEMS}
      onClick={handleNavigateTo}
    />
  )
}
