import SidebarMenu from "@/widgets/sidebar-menu";
import { Layout } from "antd";
import { Outlet } from "react-router";
import styles from "./styles.module.css";

const { Sider, Content } = Layout;

const SIDEBAR_WIDTH = 160

export const MainLayout = () => {
  return (
    <Layout
      className={styles.layout}
    >
      <Sider
        theme="light"
        width={SIDEBAR_WIDTH}
        className={styles.sideBarContainer}
      >
        <SidebarMenu />
      </Sider>
      <Content>
        <Outlet />
      </Content>
    </Layout>
  )
}
