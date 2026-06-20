import { formatCurrency } from '@/shared/lib/format-number';
import { Table, type TableProps } from 'antd';
import type { CashGaps } from '../model/types';
import styles from './styles.module.css';

interface Props {
  cashGaps?: CashGaps[];
}

export const FinanceTable = ({ cashGaps = [] }: Props) => {
  const rows = cashGaps.filter((gap) => gap.deficit > 0);

  if (rows.length === 0) {
    return null;
  }

  const columns: TableProps<CashGaps>['columns'] = [
    {
      title: 'Точка',
      dataIndex: 'pointName',
      key: 'pointName',
    },
    {
      title: 'Текущий баланс',
      dataIndex: 'actualBalance',
      key: 'actualBalance',
      align: 'right',
      render: (value: number) => formatCurrency(value),
    },
    {
      title: 'Минимальный баланс',
      dataIndex: 'requiredBalance',
      key: 'requiredBalance',
      align: 'right',
      render: (value: number) => formatCurrency(value),
    },
    {
      title: 'Дефицит',
      dataIndex: 'deficit',
      key: 'deficit',
      align: 'right',
      render: (value: number) => (
        <span className={styles.deficitValue}>{formatCurrency(value)}</span>
      ),
    },
  ];

  return (
    <section className={styles.cashGapSection}>
      <h3 className={styles.cashGapTitle}>Кассовые разрывы</h3>
      <Table
        rowKey="pointId"
        columns={columns}
        dataSource={rows}
        pagination={false}
        size="middle"
        bordered
      />
    </section>
  );
};
