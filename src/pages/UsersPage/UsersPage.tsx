import { FilterOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Dropdown, Flex, Input, message, Table, Typography, type GetProp, type MenuProps, type TableProps } from "antd";
import type { SorterResult } from 'antd/es/table/interface';
import { useCallback, useEffect, useState } from 'react';
import { getUsers } from '../../api/usersApi';
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
    width: 100,
    render: (roles: Roles[]) => roles.join(', ')
  },
  {
    title: 'Номер телефона',
    dataIndex: 'phoneNumber',
    width: 150,
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

const isNonNullable = <T,>(val: T): val is NonNullable<T> => {
  return val !== undefined && val !== null;
};

const getUsersParams = (params: TableParams): UserFilters => {
  const { pagination, sortField, filters, sortOrder, ...restParams } = params;
  const result: Record<string, any> = {};

  result.limit = pagination?.pageSize
  result.page = (pagination?.current ?? 1) - 1

  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (isNonNullable(value)) {
        result[key] = value;
      }
    });
  }

  if (sortField && sortOrder) {
    result.sortBy = sortField;
    result.sortOrder = sortOrder === 'ascend' ? 'asc' : 'desc';
  }

  Object.entries(restParams).forEach(([key, value]) => {
    if (isNonNullable(value)) {
      result[key] = value;
    }
  })

  return result
}

export function UsersPage() {
  const [usersData, setUsersData] = useState<User[]>([])
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 20,
    },
  })
  const [selectedFilter, setSelectedFilter] = useState('all')

  const fetchUserData = useCallback(
    async (queryParams: UserFilters) => {
      try {
        const response = await getUsers(queryParams)
        setUsersData(response.data)
        setTableParams(prev => {
          if (prev.pagination?.total === response.meta.totalAmount) {
            return prev
          }

          return {
            ...prev,
            pagination: {
              ...prev.pagination,
              total: response.meta.totalAmount
            }
          }
        }
        )
      } catch (error) {
        message.error(`Ошибка - ${error}`)
      }
    }, [])

  useEffect(() => {
    const params = getUsersParams(tableParams)
    fetchUserData(params)
  }, [tableParams, fetchUserData])

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
        pagination={tableParams.pagination}
        scroll={{ x: 'max-content' }}
        onChange={handleTableChange}
      />
    </div>
  )
}
