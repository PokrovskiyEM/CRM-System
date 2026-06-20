import type { AnalyticsQuery, ChartVisualizationType } from '@/entities/finance-analytics/model/types';

export type FinanceFiltersState = AnalyticsQuery & {
  chartType: ChartVisualizationType;
};
