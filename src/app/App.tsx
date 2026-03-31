import { BrowserRouter } from "react-router";
import { AppRouter } from "./router/AppRouter";
import { Layout } from "antd";
import { SidebarMenu } from "../components/SidebarMenu/SidebarMenu";

const { Sider, Content } = Layout;

export function App() {
  return (
    <BrowserRouter>
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
    </BrowserRouter >
  )
}
