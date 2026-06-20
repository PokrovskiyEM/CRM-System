import { formatCurrency, formatNumber } from '@/shared/lib/format-number';
import { Card, Flex } from 'antd';
import type { AnalyticsSummary } from '../model/types';

interface Props {
  summary?: AnalyticsSummary;
}

export const FinanceKpi = ({ summary }: Props) => {
  if (!summary) {
    return <div>Нет данных</div>;
  }

  const {
    revenue,
    averageCheck,
    expenses,
    margin,
    ordersCount,
    cashGapCount,
  } = summary;

  return (
    <Flex justify="center" align="center" gap="small" wrap>
      <Card title="Выручка" style={{ minWidth: 150 }} size="small">
        {formatCurrency(revenue)}
      </Card>
      <Card title="Средний чек" style={{ minWidth: 150 }} size="small">
        {formatCurrency(averageCheck)}
      </Card>
      <Card title="Расходы" style={{ minWidth: 150 }} size="small">
        {formatCurrency(expenses)}
      </Card>
      <Card title="Маржинальность" style={{ minWidth: 150 }} size="small">
        {`${formatNumber(margin)} %`}
      </Card>
      <Card title="Кол-во заказов" style={{ minWidth: 150 }} size="small">
        {formatNumber(ordersCount)}
      </Card>
      <Card title="Кол-во кассовых разрывов" style={{ minWidth: 150 }} size="small">
        {formatNumber(cashGapCount)}
      </Card>
    </Flex>
  );
};
