import { Layout } from "antd"
import { Outlet } from "react-router"
import { BannerImage } from "../../../components/BannerImage/BannerImage"
import styles from "./styles.module.css"

const { Content } = Layout

export const AuthLayout = () => {
  return (
    <Layout className={styles.layout}>
      <Content className={styles.content}>
        <div className={styles.container}>
          <BannerImage />
          <div className={styles.formSection}>
            <div className={styles.formContainer}>
              <Outlet />
            </div>
          </div>
        </div>
      </Content>
    </Layout>
  )
}