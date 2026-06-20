import type {
  AnalyticsPoint,
  AnalyticsQuery,
  AnalyticsSummary,
  CashGaps,
  CompareMode,
  GetAnalyticsResponse,
  GetPointsResponse,
  MetricType,
  OrderOption,
  PaymentOption,
  Point,
} from '@/entities/finance-analytics/model/types';
import { generateTimeBuckets } from '@/entities/finance-analytics/lib/time-buckets';
import { BASE_URL } from '@/shared/config/base-api';
import { http, HttpResponse, delay } from 'msw';

const MOCK_POINTS_COUNT = 100;

const POINT_DISTRICTS = [
  'Центральный',
  'Северный',
  'Южный',
  'Западный',
  'Восточный',
  'Приморский',
  'Городской',
  'Речной',
  'Лесной',
  'Промышленный',
] as const;

/** Средние значения одной «типовой» точки за период — для масштабирования профиля. */
const METRIC_BASE_PER_POINT: Record<MetricType, number> = {
  revenue: 125_000,
  averageCheck: 850,
  expenses: 72_000,
  margin: 42,
  ordersCount: 340,
};

type PointMetricsProfile = Record<MetricType, number>;

const MOCK_POINTS: GetPointsResponse = Array.from({ length: MOCK_POINTS_COUNT }, (_, index) => {
  const id = index + 1;
  const district = POINT_DISTRICTS[index % POINT_DISTRICTS.length];
  const branch = Math.floor(index / POINT_DISTRICTS.length) + 1;

  return {
    id,
    name: `Точка «${district} — филиал ${branch}»`,
  };
});

function seededRandom(seed: string): number {
  let hash = 0;

  for (let index = 0; index < seed.length; index += 1) {
    hash = ((hash << 5) - hash) + seed.charCodeAt(index);
    hash |= 0;
  }

  const value = Math.sin(hash) * 10_000;

  return value - Math.floor(value);
}

function seededRange(seed: string, min: number, max: number): number {
  return min + seededRandom(seed) * (max - min);
}

function randomInRange(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

/** Детерминированный коэффициент 0.55–1.45 по id точки — профиль стабилен между запросами. */
function pointScale(pointId: number, salt: number): number {
  const x = Math.sin(pointId * 12.9898 + salt * 78.233) * 43_758.5453;

  return 0.55 + (x - Math.floor(x)) * 0.9;
}

function getPointMetricsProfile(pointId: number): PointMetricsProfile {
  const revenue = Math.round(METRIC_BASE_PER_POINT.revenue * pointScale(pointId, 1));
  const ordersCount = Math.max(
    1,
    Math.round(METRIC_BASE_PER_POINT.ordersCount * pointScale(pointId, 2)),
  );
  const expenses = Math.round(METRIC_BASE_PER_POINT.expenses * pointScale(pointId, 3));
  const averageCheck = Math.round(revenue / ordersCount);
  const margin = revenue > 0
    ? Math.round(((revenue - expenses) / revenue) * 100)
    : METRIC_BASE_PER_POINT.margin;

  return {
    revenue,
    averageCheck,
    expenses,
    margin,
    ordersCount,
  };
}

function parseArrayParam(values: string[]): string[] {
  if (values.length === 0) {
    return [];
  }

  return values
    .flatMap((value) => value.split(','))
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseNumberArrayParam(values: string[]): number[] {
  return parseArrayParam(values)
    .map(Number)
    .filter((item) => !Number.isNaN(item));
}

function buildChartData(
  query: AnalyticsQuery,
  summary: AnalyticsSummary,
): AnalyticsPoint[] {
  const compareMode: CompareMode = query.compareMode;
  const buckets = generateTimeBuckets(query.from, query.to, query.aggregationType);
  const length = buckets.length || 1;
  const base = summary[query.metricType];
  const isRateMetric = query.metricType === 'averageCheck' || query.metricType === 'margin';

  return buckets.map((bucket, index) => {
    const seed = `${query.metricType}-${bucket.format('YYYY-MM-DD')}-${query.pointIds.join(',')}`;
    const seasonality = 1 + Math.sin(index * 0.9) * seededRange(`${seed}-season`, 0.05, 0.15);
    const trend = 0.72 + index * seededRange(`${seed}-trend`, 0.015, 0.045);
    const noise = seededRange(`${seed}-noise`, 0.82, 1.18);

    const currentValue = isRateMetric
      ? Math.round(base * seasonality * seededRange(`${seed}-rate`, 0.94, 1.06))
      : Math.round((base / length) * trend * seasonality * noise);

    const point: AnalyticsPoint = {
      periodKey: bucket.format('YYYY-MM-DD'),
      currentValue,
    };

    if (compareMode === 'previousPeriod') {
      point.previousValue = Math.round(currentValue * seededRange(`${seed}-prev`, 0.86, 0.97));
    }

    if (query.metricType === 'revenue' || query.metricType === 'expenses') {
      point.planValue = Math.round(currentValue * seededRange(`${seed}-plan`, 1.02, 1.12));
    }

    return point;
  });
}

function resolvePointsForMetrics(selectedPointIds: number[]): Point[] {
  if (selectedPointIds.length === 0) {
    return MOCK_POINTS;
  }

  return MOCK_POINTS.filter((point) => selectedPointIds.includes(point.id));
}

function getFilterShare(
  orderOptions: OrderOption[],
  paymentOptions: PaymentOption[],
): number {
  const orderShare = orderOptions.length === 0
    ? 1
    : 0.28 + orderOptions.length * 0.22;
  const paymentShare = paymentOptions.length === 0
    ? 1
    : 0.32 + paymentOptions.length * 0.2;

  return orderShare * paymentShare;
}

/** Суммирует метрики выбранных точек; margin и averageCheck пересчитываются из итогов. */
function aggregateMetricsForPoints(
  points: Point[],
  orderOptions: OrderOption[],
  paymentOptions: PaymentOption[],
): AnalyticsSummary {
  const filterShare = getFilterShare(orderOptions, paymentOptions);

  const totals = points.reduce(
    (acc, point) => {
      const profile = getPointMetricsProfile(point.id);

      acc.revenue += profile.revenue;
      acc.expenses += profile.expenses;
      acc.ordersCount += profile.ordersCount;

      if (profile.margin < 20) {
        acc.cashGapCount += 1;
      }

      return acc;
    },
    {
      revenue: 0,
      expenses: 0,
      ordersCount: 0,
      cashGapCount: 0,
    },
  );

  const revenue = Math.round(totals.revenue * filterShare);
  const expenses = Math.round(totals.expenses * filterShare);
  const ordersCount = Math.max(1, Math.round(totals.ordersCount * filterShare));
  const averageCheck = Math.round(revenue / ordersCount);
  const margin = revenue > 0
    ? Math.round(((revenue - expenses) / revenue) * 100)
    : 0;

  return {
    revenue,
    averageCheck,
    expenses,
    margin,
    ordersCount,
    cashGapCount: totals.cashGapCount,
  };
}

function buildCashGaps(selectedPointIds: number[]): CashGaps[] {
  const points = selectedPointIds.length > 0
    ? MOCK_POINTS.filter((point) => selectedPointIds.includes(point.id))
    : MOCK_POINTS.filter((point) => getPointMetricsProfile(point.id).margin < 25);

  return points.map((point) => {
    const profile = getPointMetricsProfile(point.id);
    const actualBalance = Math.round(profile.revenue * randomInRange(0.35, 0.55));
    const requiredBalance = Math.round(profile.expenses * randomInRange(1.05, 1.25));
    const deficit = Math.max(0, requiredBalance - actualBalance);

    return {
      pointId: point.id,
      pointName: point.name,
      actualBalance,
      requiredBalance,
      deficit,
    };
  });
}

function parseAnalyticsQuery(url: URL): AnalyticsQuery {
  return {
    aggregationType: (url.searchParams.get('aggregationType') ?? 'week') as AnalyticsQuery['aggregationType'],
    from: url.searchParams.get('from') ?? new Date().toISOString(),
    to: url.searchParams.get('to') ?? new Date().toISOString(),
    compareMode: (url.searchParams.get('compareMode') ?? 'none') as AnalyticsQuery['compareMode'],
    pointIds: parseNumberArrayParam(url.searchParams.getAll('pointIds')),
    metricType: (url.searchParams.get('metricType') ?? 'revenue') as AnalyticsQuery['metricType'],
    orderOptions: parseArrayParam(url.searchParams.getAll('orderOptions')) as AnalyticsQuery['orderOptions'],
    paymentOptions: parseArrayParam(url.searchParams.getAll('paymentOptions')) as AnalyticsQuery['paymentOptions'],
  };
}

export const financeHandlers = [
  http.get(`${BASE_URL}/finance/analytics/points`, async () => {
    await delay(randomInRange(200, 600));

    return HttpResponse.json(MOCK_POINTS);
  }),

  http.get(`${BASE_URL}/finance/analytics`, async ({ request }) => {
    await delay(randomInRange(350, 900));

    const query = parseAnalyticsQuery(new URL(request.url));
    const points = resolvePointsForMetrics(query.pointIds);
    const summary = aggregateMetricsForPoints(
      points,
      query.orderOptions,
      query.paymentOptions,
    );

    const response: GetAnalyticsResponse = {
      chartData: buildChartData(query, summary),
      summary,
      cashGaps: buildCashGaps(query.pointIds),
    };

    return HttpResponse.json(response);
  }),
];
