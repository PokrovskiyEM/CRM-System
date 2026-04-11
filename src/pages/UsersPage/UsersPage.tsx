import { FilterOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Checkbox, Dropdown, Flex, Input, message, Modal, Popconfirm, Space, Table, Tag, Typography, type GetProp, type MenuProps, type TableProps } from "antd";
import type { SorterResult, SortOrder } from 'antd/es/table/interface';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router';
import { deleteUser, getUsers, setUserBlockStatus, updateUserRoles, type BlockStatus } from '../../api/adminApi';
import { useAppSelector } from '../../app/store/store';
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

export function UsersPage() {
  const { roles } = useAppSelector(state => state.auth)
  const isAdminAccess = roles.includes(Roles.ADMIN)

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

  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [selectedRoles, setSelectedRoles] = useState<Roles[]>([])

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
          {roles?.map((role) => {
            const roleColors = {
              ADMIN: 'red',
              MODERATOR: 'orange',
              USER: 'blue',
            }
            return (
              <Tag color={roleColors[role] || 'purple'} key={role}>
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
            <Popconfirm
              title='Удалить пользователя'
              description='Вы точно хотите удалить данного пользователя?'
              onConfirm={() => handleDeleteUser(record.id)}
              okText='Да'
              cancelText='Нет'
            >
              <Button type='primary' danger disabled={!isAdminAccess}>
                Удалить
              </Button>
            </Popconfirm>
            <Button type='primary' onClick={() => handleRoleModalOpen(record)} disabled={!isAdminAccess}>
              Изменить роли
            </Button>
            {record.isBlocked
              ? (
                <Button type='primary' disabled={!isAdminAccess} onClick={() => handleBlockStatus(record.id, 'unblock')}>
                  Разблокировать
                </Button>
              )
              : (
                <Button type='primary' onClick={() => handleBlockStatus(record.id, 'block')}>
                  Заблокировать
                </Button>
              )
            }
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

  const apiSortOrder = (order?: SortOrder | undefined): 'asc' | 'desc' | undefined => {
    if (order === 'ascend') return 'asc'
    if (order === 'descend') return 'desc'
    return undefined
  }

  const query = useMemo(() => ({
    limit: tableParams.pagination?.pageSize ?? 20,
    page: (tableParams.pagination?.current ?? 1) - 1,
    sortBy: tableParams.sortField ? String(tableParams.sortField) : undefined,
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

  const handleDeleteUser = async (id: number) => {
    try {
      await deleteUser(id)

      await fetchUserData(query)
    } catch (error) {
      message.error(`Ошибка - ${error}`)
    }
  }

  const handleBlockStatus = async (id: number, status: BlockStatus) => {
    try {
      await setUserBlockStatus(id, status)

      await fetchUserData(query)
    } catch (error) {
      message.error(`Ошибка - ${error}`)
    }
  }

  const handleRoleModalOpen = (user: User) => {
    setSelectedUser(user)
    setSelectedRoles(user.roles)
    setIsRoleModalOpen(true)
  }

  const handleRoleModalClose = () => {
    setIsRoleModalOpen(false)
    setSelectedUser(null)
    setSelectedRoles([])
  }

  const handleChangeRoles = async () => {
    if (!selectedUser) {
      return
    }

    try {
      await updateUserRoles(selectedUser.id, selectedRoles)
      handleRoleModalClose()

      await fetchUserData(query)
    } catch (error) {
      message.error(`Ошибка - ${error}`)
    }
  }

  return (
    <>
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
          rowKey='id'
          pagination={{
            ...tableParams.pagination,
            total: totalUsers,
            hideOnSinglePage: true,
            showSizeChanger: false
          }}
          scroll={{ x: 'max-content' }}
          onChange={handleTableChange}
        />
      </div>

      <Modal
        title={`Выберите роли для пользователя - ${selectedUser?.username}:`}
        open={isRoleModalOpen}
        onCancel={handleRoleModalClose}
        onOk={handleChangeRoles}
      >
        <Checkbox.Group
          value={selectedRoles}
          onChange={setSelectedRoles}
        >
          <Space orientation='vertical'>
            <Checkbox value={Roles.USER}>{Roles.USER}</Checkbox>
            <Checkbox value={Roles.MODERATOR}>{Roles.MODERATOR}</Checkbox>
            <Checkbox value={Roles.ADMIN}>{Roles.ADMIN}</Checkbox>
          </Space>
        </Checkbox.Group>
      </Modal >
    </>
  )
}
