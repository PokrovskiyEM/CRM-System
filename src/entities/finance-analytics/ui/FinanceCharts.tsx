import { buildChartSeries } from '@/entities/finance-analytics/lib/build-chart-series';
import type {
  AggregationType,
  AnalyticsPoint,
  ChartVisualizationType,
  MetricType,
} from '@/entities/finance-analytics/model/types';
import { useMemo } from 'react';
import FinanceBarChart from './charts/FinanceBarChart';
import { ChartEmptyState } from './charts/ChartShell';
import FinanceLineChart from './charts/FinanceLineChart';
import FinancePieChart from './charts/FinancePieChart';

interface Props {
  chartType: ChartVisualizationType;
  data: AnalyticsPoint[];
  from: string;
  to: string;
  aggregationType: AggregationType;
  metricType: MetricType;
}

export const FinanceCharts = ({
  chartType,
  data,
  from,
  to,
  aggregationType,
  metricType,
}: Props) => {
  const series = useMemo(
    () => buildChartSeries({ data, from, to, aggregationType, metricType }),
    [aggregationType, data, from, metricType, to],
  );

  if (series.length === 0) {
    return <ChartEmptyState />;
  }

  switch (chartType) {
    case 'line':
      return <FinanceLineChart data={series} />;
    case 'bar':
      return <FinanceBarChart data={series} />;
    case 'pie':
      return <FinancePieChart data={series} />;
    default:
      return <ChartEmptyState message="Выберите вариант отображения графика" />;
  }
};
