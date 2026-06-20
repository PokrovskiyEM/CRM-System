import type {
  AggregationType,
  AnalyticsPoint,
  ChartSeriesPoint,
  MetricType,
} from '@/entities/finance-analytics/model/types';
import dayjs, { type Dayjs } from 'dayjs';
import { formatChartLabel } from './format-chart-label';
import { bucketEndDate, generateTimeBuckets, getRangeSpanDays } from './time-buckets';

const MAX_CHART_POINTS = 24;

export interface BuildChartSeriesParams {
  data: AnalyticsPoint[];
  from: string;
  to: string;
  aggregationType: AggregationType;
  metricType: MetricType;
}

function normalizePeriodKey(periodKey: string): string {
  const parsed = dayjs(periodKey);

  if (parsed.isValid()) {
    return parsed.format('YYYY-MM-DD');
  }

  return periodKey.slice(0, 10);
}

function indexDataByPeriod(data: AnalyticsPoint[]): Map<string, AnalyticsPoint> {
  return new Map(data.map((point) => [normalizePeriodKey(point.periodKey), point]));
}

function isRateMetric(metricType: MetricType): boolean {
  return metricType === 'averageCheck' || metricType === 'margin';
}

function aggregateField(
  points: AnalyticsPoint[],
  metricType: MetricType,
  field: 'currentValue' | 'previousValue' | 'planValue',
): number | undefined {
  const values = points
    .map((point) => point[field])
    .filter((value): value is number => value !== undefined && value !== null);

  if (values.length === 0) {
    return undefined;
  }

  if (isRateMetric(metricType)) {
    return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
  }

  return Math.round(values.reduce((sum, value) => sum + value, 0));
}

function groupBuckets(buckets: Dayjs[], maxPoints: number): Dayjs[][] {
  if (buckets.length <= maxPoints) {
    return buckets.map((bucket) => [bucket]);
  }

  const groupSize = Math.ceil(buckets.length / maxPoints);
  const groups: Dayjs[][] = [];

  for (let index = 0; index < buckets.length; index += groupSize) {
    groups.push(buckets.slice(index, index + groupSize));
  }

  return groups;
}

function buildSeriesPoint(
  bucketGroup: Dayjs[],
  dataMap: Map<string, AnalyticsPoint>,
  aggregationType: AggregationType,
  metricType: MetricType,
  spanDays: number,
  isGrouped: boolean,
): ChartSeriesPoint {
  const groupPoints = bucketGroup
    .map((bucket) => dataMap.get(bucket.format('YYYY-MM-DD')))
    .filter((point): point is AnalyticsPoint => point !== undefined);

  const periodStart = bucketGroup[0];
  const periodEnd = bucketEndDate(bucketGroup[bucketGroup.length - 1], aggregationType);

  return {
    periodKey: periodStart.format('YYYY-MM-DD'),
    label: formatChartLabel(periodStart, periodEnd, aggregationType, spanDays, isGrouped),
    currentValue: aggregateField(groupPoints, metricType, 'currentValue') ?? 0,
    previousValue: aggregateField(groupPoints, metricType, 'previousValue'),
    planValue: aggregateField(groupPoints, metricType, 'planValue'),
  };
}

export function buildChartSeries({
  data,
  from,
  to,
  aggregationType,
  metricType,
}: BuildChartSeriesParams): ChartSeriesPoint[] {
  const buckets = generateTimeBuckets(from, to, aggregationType);

  if (buckets.length === 0) {
    return [];
  }

  const dataMap = indexDataByPeriod(data);
  const spanDays = getRangeSpanDays(from, to);
  const bucketGroups = groupBuckets(buckets, MAX_CHART_POINTS);
  const isGrouped = bucketGroups.length < buckets.length;

  return bucketGroups.map((group) =>
    buildSeriesPoint(group, dataMap, aggregationType, metricType, spanDays, isGrouped),
  );
}
