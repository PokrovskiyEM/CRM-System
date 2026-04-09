import { FilterOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Flex, Input, Typography } from "antd";
import styles from "./styles.module.css";

export function UsersPage() {
  return (
    <div className={styles.wrapper}>
      <Flex justify='space-between'>
        <Typography.Title level={3} style={{ margin: 0 }}>
          Пользователи
        </Typography.Title>
        <Flex gap='small'>
          <Input
            placeholder='Поиск по имени или email'
            prefix={<SearchOutlined />}
            style={{ minWidth: 300 }}
          />
          <Button type="primary" icon={<FilterOutlined />} >
            Фильтр
          </Button>
        </Flex>
      </Flex>
      Table
    </div>
  )
}
