import { FilterOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Dropdown, Flex, Input, message, Space, Table, Tag, Typography, type GetProp, type MenuProps, type TableProps } from "antd";
import type { SorterResult, SortOrder } from 'antd/es/table/interface';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router';
import { getUsers } from '../../api/adminApi';
import { useDebounce } from '../../hooks/useDebounce';
import { Roles, type User, type UserFilters } from '../../types/users';
import styles from "./styles.module.css";

type ColumnsType<T extends object = object> = TableProps<T>['columns'];

type TablePaginationConfig = Exclude<GetProp<TableProps, 'pagination'>, boolean>;

interface TableParams {
  pagination?: TablePaginationConfig;
  sortField?: SorterResult<any>['field'];
  sortOrder?: SorterResult<any>['order'];
  filters?: Parameters<GetProp<TableProps, 'onChange'>>[1];
  isBlocked?: boolean
  search?: string
}

const columns: ColumnsType<User> = [
  {
    title: 'Имя пользователя',
    dataIndex: 'username',
    width: 200,
    sorter: true,
  },
  {
    title: 'Email',
    dataIndex: 'email',
    width: 300,
    sorter: true,
  },
  {
    title: 'Дата регистрации',
    dataIndex: 'date',
    width: 150,
    render: (date: string) => new Date(date).toLocaleDateString()
  },
  {
    title: 'Статус блокировки',
    dataIndex: 'isBlocked',
    render: (isBlocked: boolean) => isBlocked ? 'Заблокирован' : 'Не заблокирован'
  },
  {
    title: 'Роли',
    dataIndex: 'roles',
    width: 150,
    render: (roles: Roles[]) => (
      <Flex gap='small' align='center' wrap>
        {roles.map((role) => {
          const color = (role === 'ADMIN') ? 'red' : (role === 'MODERATOR') ? 'orange' : 'blue'
          return (
            <Tag color={color} key={role}>
              {role}
            </Tag>
          )
        })}
      </Flex>
    )
  },
  {
    title: 'Номер телефона',
    dataIndex: 'phoneNumber',
    width: 150,
  },
  {
    title: 'Действия',
    key: 'actions',
    width: 400,
    render: (_, record) => {
      return (
        <Space >
          <Link to={`/users/${record.id}`}>
            <Button type='primary'>Профиль</Button>
          </Link>
          <Button type='primary' danger>
            Удалить
          </Button>
          <Button type='primary'>
            Изменить роли
          </Button>
          <Button type='primary'>
            {record.isBlocked ? 'Разблокировать' : 'Заблокировать'}
          </Button>
        </Space>
      )
    }
  },
]

const filterItems: MenuProps['items'] = [
  {
    key: 'all',
    label: 'Все пользователи'
  },
  {
    key: 'blocked',
    label: 'Только заблокированные'
  },
  {
    key: 'active',
    label: 'Только активные'
  },
]

const apiSortOrder = (order?: SortOrder | undefined) => {
  if (order === 'ascend') return 'asc'
  if (order === 'descend') return 'desc'
  return undefined
}

export function UsersPage() {
  const [usersData, setUsersData] = useState<User[]>([])
  const [totalUsers, setTotalUsers] = useState(0)
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 20,
    },
  })
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [searchValue, setSearchValue] = useState('')

  const debouncedSearchValue = useDebounce(searchValue, 1000)

  const fetchUserData = useCallback(
    async (queryParams: UserFilters) => {
      try {
        const response = await getUsers(queryParams)
        setUsersData(response.data)
        setTotalUsers(response.meta.totalAmount)
      } catch (error) {
        message.error(`Ошибка - ${error}`)
      }
    }, [])

  const query = useMemo(() => ({
    limit: tableParams.pagination?.pageSize ?? 20,
    page: (tableParams.pagination?.current ?? 1) - 1,
    sortBy: tableParams.sortField,
    sortOrder: apiSortOrder(tableParams.sortOrder),
    filters: tableParams.filters,
    isBlocked: tableParams.isBlocked,
    search: debouncedSearchValue || undefined,
  }), [tableParams, debouncedSearchValue])

  useEffect(() => {
    fetchUserData(query)
  }, [query, fetchUserData])

  const handleTableChange: TableProps<User>['onChange'] = (pagination, filters, sorter) => {
    setTableParams(prev => ({
      ...prev,
      pagination,
      filters,
      sortOrder: Array.isArray(sorter) ? undefined : sorter.order,
      sortField: Array.isArray(sorter) ? undefined : sorter.field,
    }))
  }

  const handleFilterClick: MenuProps['onClick'] = ({ key }) => {
    setSelectedFilter(key)
    setTableParams(prev => ({
      ...prev,
      pagination: {
        ...prev.pagination,
        current: 1
      },
      isBlocked: key === 'blocked'
        ? true
        : key === 'active'
          ? false
          : undefined
    }))
  }

  return (
    <div className={styles.wrapper}>
      <Flex justify='space-between' align='center'>
        <Typography.Title level={3} style={{ margin: 0 }}>
          Пользователи
        </Typography.Title>
        <Flex gap='small'>
          <Input
            placeholder='Поиск по имени или email'
            prefix={<SearchOutlined />}
            size='large'
            style={{ minWidth: 350 }}
            value={searchValue}
            onChange={e => setSearchValue(e.target.value)}
          />
          <Dropdown
            menu={{
              items: filterItems,
              onClick: handleFilterClick,
              selectedKeys: [selectedFilter]
            }}
            trigger={['click']} arrow
          >
            <Button type="primary" icon={<FilterOutlined />} size='large'>
              Фильтр
            </Button>
          </Dropdown>
        </Flex>
      </Flex>
      <Table<User>
        columns={columns}
        dataSource={usersData}
        rowKey={(record) => `${record.id}`}
        pagination={{
          ...tableParams.pagination,
          total: totalUsers
        }}
        scroll={{ x: 'max-content' }}
        onChange={handleTableChange}
      />
    </div>
  )
}
