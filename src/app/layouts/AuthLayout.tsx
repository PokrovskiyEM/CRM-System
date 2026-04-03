import { Layout } from "antd"
import { Outlet } from "react-router"

const { Content } = Layout

export const AuthLayout = () => {
  return (
    <Layout style={{
      minHeight: '100vh',
      background: "var(--color-background)",
    }}>
      <Content style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: 15,
          padding: 15,
          width: 500,
          minHeight: 500,
          justifyItems: 'center',
          alignContent: 'center',
        }}>
          <div style={{
            width: '100%',
            maxWidth: 400
          }}>
            <Outlet />
          </div>
        </div>
      </Content>
    </Layout >
  )
}