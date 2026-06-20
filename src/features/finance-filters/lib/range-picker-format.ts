import type { AggregationType } from '@/entities/finance-analytics/model/types';
import type { Dayjs } from 'dayjs';

export function getRangePickerFormat(aggregationType: AggregationType): string {
  switch (aggregationType) {
    case 'month':
      return 'MMMM YYYY';
    case 'week':
      return 'DD.MM.YYYY';
    case 'day':
    default:
      return 'DD.MM.YYYY';
  }
}

export function formatRangePickerValue(
  value: Dayjs,
  aggregationType: AggregationType,
): string {
  const formatted = value.format(getRangePickerFormat(aggregationType));

  if (aggregationType === 'month') {
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  }

  return formatted;
}
