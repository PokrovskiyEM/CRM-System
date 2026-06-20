import type { AggregationType } from '@/entities/finance-analytics/model/types';
import dayjs, { type Dayjs } from 'dayjs';

export function generateTimeBuckets(
  from: string,
  to: string,
  unit: AggregationType,
): Dayjs[] {
  const rangeStart = dayjs(from).startOf(unit);
  const rangeEnd = dayjs(to).endOf(unit);

  if (!rangeStart.isValid() || !rangeEnd.isValid() || rangeStart.isAfter(rangeEnd)) {
    return [];
  }

  const buckets: Dayjs[] = [];
  let cursor = rangeStart;

  while (cursor.isBefore(rangeEnd) || cursor.isSame(rangeEnd, unit)) {
    buckets.push(cursor);
    cursor = cursor.add(1, unit);
  }

  return buckets;
}

export function getRangeSpanDays(from: string, to: string): number {
  const start = dayjs(from);
  const end = dayjs(to);

  if (!start.isValid() || !end.isValid()) {
    return 0;
  }

  return Math.max(1, end.endOf('day').diff(start.startOf('day'), 'day') + 1);
}

export function bucketEndDate(start: Dayjs, unit: AggregationType): Dayjs {
  return start.endOf(unit);
}
