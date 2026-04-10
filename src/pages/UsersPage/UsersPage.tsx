/* eslint-disable react-hooks/exhaustive-deps */
import { FilterOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Flex, Input, message, Table, Typography, type GetProp, type TableProps } from "antd";
import styles from "./styles.module.css";
import { Roles, type User, type UserFilters } from '../../types/users';
import { useEffect, useState } from 'react';
import type { SorterResult } from 'antd/es/table/interface';
import { getUsers, mockData } from '../../api/usersApi';

type ColumnsType<T extends object = object> = TableProps<T>['columns'];

type TablePaginationConfig = Exclude<GetProp<TableProps, 'pagination'>, boolean>;

interface TableParams {
  pagination?: TablePaginationConfig;
  sortField?: SorterResult<any>['field'];
  sortOrder?: SorterResult<any>['order'];
  filters?: Parameters<GetProp<TableProps, 'onChange'>>[1];
}

const columns: ColumnsType<User> = [
  {
    title: 'Имя пользователя',
    dataIndex: 'username',
    width: 200,
    sorter: true
  },
  {
    title: 'Email',
    dataIndex: 'email',
    width: 200,
  },
  {
    title: 'Дата регистрации',
    dataIndex: 'date',
    width: 150,
  },
  {
    title: 'Статус блокировки',
    dataIndex: 'isBlocked',
  },
  {
    title: 'Роли',
    dataIndex: 'roles',
    width: 100,
  },
  {
    title: 'Номер телефона',
    dataIndex: 'phoneNumber',
    width: 150,
  },
]

const isNonNullable = <T,>(val: T): val is NonNullable<T> => {
  return val !== undefined && val !== null;
};

const getUsersParams = (params: TableParams) => {
  const { pagination, filters, sortField, sortOrder, ...restParams } = params;
  const result: Record<string, any> = {};

  result.limit = pagination?.pageSize
  result.page = pagination?.current - 1

  if (sortField) {
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
  // const [usersData, setUsersData] = useState<User[]>(mockData)
  const [usersData, setUsersData] = useState<User[]>()
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 20,
    },
  })

  const params = getUsersParams(tableParams)

  const fetchUserData = async (queryParams: UserFilters) => {
    try {
      const response = await getUsers(queryParams)
      setUsersData(response.data)
      setTableParams({
        ...tableParams,
        pagination: {
          ...tableParams.pagination,
          total: response.meta.totalAmount
        }
      })
    } catch (error) {
      message.error(`Ошибка - ${error}`)
    }
  }

  useEffect(() => {
    fetchUserData(params)
  }, [
    tableParams.pagination?.current,
    tableParams.pagination?.pageSize,
    tableParams?.sortOrder,
    tableParams?.sortField,
    JSON.stringify(tableParams.filters),
  ])

  const handleTableChange: TableProps<User>['onChange'] = (pagination, filters, sorter) => {
    setTableParams({
      pagination,
      filters,
      sortOrder: Array.isArray(sorter) ? undefined : sorter.order,
      sortField: Array.isArray(sorter) ? undefined : sorter.field,
    })

    if (pagination.pageSize !== tableParams.pagination?.pageSize) {
      setUsersData([]);
    }
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
          <Button type="primary" icon={<FilterOutlined />} size='large'>
            Фильтр
          </Button>
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
