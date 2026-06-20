export type AggregationType =
  | 'day'
  | 'week'
  | 'month'

export type CompareMode =
  | 'none'
  | 'previousPeriod'

export type MetricType =
  | 'revenue'
  | 'averageCheck'
  | 'expenses'
  | 'margin'
  | 'ordersCount'

export type OrderOption =
  | 'dineIn'
  | 'takeAway'
  | 'delivery'

export type PaymentOption =
  | 'cash'
  | 'card'
  | 'certificate'

export type ChartVisualizationType =
  | 'line'
  | 'bar'
  | 'pie'

// GET finance/analytics?query
export interface AnalyticsQuery {
  aggregationType: AggregationType;
  from: string;
  to: string;
  compareMode: CompareMode;
  pointIds: number[];
  metricType: MetricType;
  orderOptions: OrderOption[];
  paymentOptions: PaymentOption[];
}

// Response
export interface GetAnalyticsResponse {
  chartData: AnalyticsPoint[];
  summary: AnalyticsSummary;
  cashGaps: CashGaps[];
}

/** ISO-дата начала периода (YYYY-MM-DD). */
export interface AnalyticsPoint {
  periodKey: string;
  currentValue: number;
  previousValue?: number;
  planValue?: number;
}

/** Точка ряда для Recharts после агрегации и форматирования оси X. */
export interface ChartSeriesPoint {
  periodKey: string;
  label: string;
  currentValue: number;
  previousValue?: number;
  planValue?: number;
}

export interface CashGaps {
  pointId: number;
  pointName: string;
  actualBalance: number;
  requiredBalance: number;
  deficit: number;
}

export interface AnalyticsSummary {
  revenue: number;
  averageCheck: number;
  expenses: number;
  margin: number;
  ordersCount: number;
  cashGapCount: number;
}

// GET finance/analytics/points
export interface Point {
  id: number;
  name: string;
}

export type GetPointsResponse = Point[]
