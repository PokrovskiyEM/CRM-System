import { Layout } from "antd";
import { SidebarMenu } from "../components/SidebarMenu/SidebarMenu";
import { AppRouter } from "./router/AppRouter";

const { Sider, Content } = Layout;

export function App() {
  return (
    <Layout style={{
      minHeight: '100vh',
      background: "var(--color-background)",
    }}>
      <Sider
        theme="light"
        width={130}
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
        <AppRouter />
      </Content>
    </Layout>
  )
}
