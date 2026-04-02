import { Layout } from "antd"
import { Outlet } from "react-router"

const { Content } = Layout

export const AuthLayout = () => {
  return (
    <Layout>
      <Content>
        <Outlet />
      </Content>
    </Layout>
  )
}