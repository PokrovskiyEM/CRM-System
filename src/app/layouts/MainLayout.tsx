import { Layout } from "antd";
import { Outlet } from "react-router";
import { SidebarMenu } from "../../components/SidebarMenu/SidebarMenu";

const { Sider, Content } = Layout;

const SIDEBAR_WIDTH = 160

export function MainLayout() {
  return (
    <Layout style={{
      minHeight: '100vh',
      background: "var(--color-background)",
    }}>
      <Sider
        theme="light"
        width={SIDEBAR_WIDTH}
        style={{
          position: "sticky",
          top: 0,
          height: '100vh',
          borderRight: "1px solid gray",
        }}
      >
        <SidebarMenu />
      </Sider>
      <Content>
        <Outlet />
      </Content>
    </Layout>
  )
}
