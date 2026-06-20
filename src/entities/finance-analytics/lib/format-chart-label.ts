import type { AggregationType } from '@/entities/finance-analytics/model/types';
import '@/shared/lib/setup-dayjs';
import dayjs, { type Dayjs } from 'dayjs';

type LabelFormat = 'day' | 'week-range' | 'month-year' | 'period-range';

function resolveLabelFormat(
  unit: AggregationType,
  spanDays: number,
  groupSpanDays: number,
  isGrouped: boolean,
): LabelFormat {
  if (unit === 'month') {
    return 'month-year';
  }

  if (isGrouped) {
    if (groupSpanDays > 60 || spanDays > 365) {
      return 'month-year';
    }

    if (groupSpanDays > 7) {
      return 'period-range';
    }
  }

  if (spanDays > 365) {
    return 'month-year';
  }

  if (unit === 'week' || (isGrouped && groupSpanDays > 1)) {
    return 'week-range';
  }

  return 'day';
}

function capitalizeFirst(value: string): string {
  if (!value) {
    return value;
  }

  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function formatChartLabel(
  start: Dayjs,
  end: Dayjs,
  unit: AggregationType,
  spanDays: number,
  isGrouped: boolean,
): string {
  const groupSpanDays = Math.max(1, end.endOf('day').diff(start.startOf('day'), 'day') + 1);
  const format = resolveLabelFormat(unit, spanDays, groupSpanDays, isGrouped);

  switch (format) {
    case 'month-year':
      return capitalizeFirst(start.format('MMMM YYYY'));
    case 'week-range':
      return `${start.format('DD.MM')}–${end.format('DD.MM')}`;
    case 'period-range':
      return `${start.format('DD.MM.YY')}–${end.format('DD.MM.YY')}`;
    case 'day':
    default:
      return start.format('DD.MM');
  }
}

export function formatChartTooltipLabel(label: string, periodKey: string): string {
  const date = dayjs(periodKey);

  if (date.isValid()) {
    return `${label} (${date.format('DD.MM.YYYY')})`;
  }

  return label;
}
