import { Layout } from "antd"
import { Outlet } from "react-router"
import styles from "./AuthLayout.module.css"

const { Content } = Layout

export const AuthLayout = () => {
  return (
    <Layout className={styles.layout}>
      <Content className={styles.content}>
        <div className={styles.wrapper}>
          <div className={styles.image} />
          <div className={styles.form}>
            <div className={styles.inner}>
              <Outlet />
            </div>
          </div>
        </div>
      </Content>
    </Layout>
  )
}