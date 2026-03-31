import { useLocation, useNavigate } from "react-router";
import { Menu } from "antd";

export const SidebarMenu = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const items = [
    {
      key: "/todos",
      label: 'Список задач'
    },
    {
      key: "/profile",
      label: 'Профиль'
    },
  ]

  return (
    <Menu
      selectedKeys={[location.pathname]}
      items={items}
      onClick={({ key }) => navigate(key)}
    />
  )
}
