import dayjs from 'dayjs';
import type { FinanceFiltersState } from './types';

export function createDefaultFinanceFilters(): FinanceFiltersState {
  const now = dayjs();

  return {
    aggregationType: 'week',
    from: now.startOf('week').toISOString(),
    to: now.endOf('week').toISOString(),
    compareMode: 'none',
    pointIds: [],
    metricType: 'revenue',
    orderOptions: [],
    paymentOptions: [],
    chartType: 'line',
  };
}
