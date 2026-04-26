import { Layout } from "antd"
import { Outlet } from "react-router"
import { BannerImage } from "../../../components/BannerImage/BannerImage"
import styles from "./AuthLayout.module.css"

const { Content } = Layout

export const AuthLayout = () => {
  return (
    <Layout className={styles.layout}>
      <Content className={styles.content}>
        <div className={styles.wrapper}>
          <BannerImage />
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