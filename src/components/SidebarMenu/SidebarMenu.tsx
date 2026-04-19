import { useLocation, useNavigate } from "react-router";
import { Menu } from "antd";

const MENU_ITEMS = [
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

  return (
    <Menu
      selectedKeys={[location.pathname]}
      items={MENU_ITEMS}
      onClick={({ key }) => navigate(key)}
    />
  )
}
