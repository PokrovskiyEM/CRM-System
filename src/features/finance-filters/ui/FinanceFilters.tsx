import type { AggregationType, Point } from '@/entities/finance-analytics/model/types';
import { formatRangePickerValue } from '@/features/finance-filters/lib/range-picker-format';
import { BarChartOutlined, LineChartOutlined, PieChartOutlined } from '@ant-design/icons';
import { DatePicker, Flex, Radio, Select, type RadioChangeEvent } from 'antd';
import ruRU from 'antd/locale/ru_RU';
import dayjs, { type Dayjs } from 'dayjs';
import type { FinanceFiltersState } from '../model/types';

const { RangePicker } = DatePicker;

interface Props {
  value: FinanceFiltersState;
  onChange: (value: FinanceFiltersState) => void;
  points: Point[];
  isPointsLoading?: boolean;
}

const pickerMap = {
  day: 'date',
  week: 'week',
  month: 'month',
} as const;

const getDefaultRange = (aggregationType: AggregationType): Pick<FinanceFiltersState, 'from' | 'to'> => {
  const now = dayjs();

  return {
    from: now.startOf(aggregationType).toISOString(),
    to: now.endOf(aggregationType).toISOString(),
  };
};

const toRangeValue = (from: string, to: string): [Dayjs, Dayjs] | null => {
  const start = dayjs(from);
  const end = dayjs(to);

  if (!start.isValid() || !end.isValid()) {
    return null;
  }

  return [start, end];
};

export const FinanceFilters = ({ value, onChange, points, isPointsLoading }: Props) => {
  const rangeValue = toRangeValue(value.from, value.to);

  const pointOptions = points.map((point) => ({
    value: point.id,
    label: point.name,
  }));

  return (
    <Flex gap="small" align="center" wrap>
      <Select
        value={value.aggregationType}
        style={{ width: 100 }}
        onChange={(aggregationType: AggregationType) => {
          onChange({
            ...value,
            aggregationType,
            ...getDefaultRange(aggregationType),
          });
        }}
        options={[
          { value: 'day', label: 'День' },
          { value: 'week', label: 'Неделя' },
          { value: 'month', label: 'Месяц' },
        ]}
      />
      <RangePicker
        picker={pickerMap[value.aggregationType]}
        locale={ruRU.DatePicker}
        format={(date) => formatRangePickerValue(date, value.aggregationType)}
        style={{ width: 220 }}
        value={rangeValue}
        onChange={(dates) => {
          if (!dates?.[0] || !dates[1]) {
            return;
          }

          onChange({
            ...value,
            from: dates[0].startOf(value.aggregationType).toISOString(),
            to: dates[1].endOf(value.aggregationType).toISOString(),
          });
        }}
      />
      <Select
        value={value.compareMode}
        style={{ width: 190 }}
        onChange={(compareMode) => {
          onChange({
            ...value,
            compareMode,
          });
        }}
        options={[
          { value: 'none', label: 'Нет' },
          { value: 'previousPeriod', label: 'Предыдущий период' },
        ]}
      />
      <Select
        showSearch={{ optionFilterProp: 'label' }}
        placeholder="Выберите точку"
        allowClear
        mode="multiple"
        style={{ width: 190 }}
        value={value.pointIds}
        loading={isPointsLoading}
        onChange={(pointIds: number[]) => {
          onChange({
            ...value,
            pointIds,
          });
        }}
        options={pointOptions}
      />
      <Select
        value={value.metricType}
        style={{ width: 150 }}
        onChange={(metricType) => {
          const nextValue: FinanceFiltersState = {
            ...value,
            metricType,
          };

          if (
            (metricType === 'margin' || metricType === 'averageCheck')
            && value.chartType === 'pie'
          ) {
            nextValue.chartType = 'line';
          }

          onChange(nextValue);
        }}
        options={[
          { value: 'revenue', label: 'Выручка' },
          { value: 'averageCheck', label: 'Средний чек' },
          { value: 'expenses', label: 'Расходы' },
          { value: 'margin', label: 'Маржинальность' },
          { value: 'ordersCount', label: 'Кол-во заказов' },
        ]}
      />
      <Select
        placeholder="Выберите вариант заказа"
        value={value.orderOptions}
        allowClear
        mode="multiple"
        style={{ width: 300 }}
        onChange={(orderOptions) => {
          onChange({
            ...value,
            orderOptions,
          });
        }}
        options={[
          { value: 'dineIn', label: 'В зале' },
          { value: 'takeAway', label: 'На вынос' },
          { value: 'delivery', label: 'Доставка' },
        ]}
      />
      <Select
        placeholder="Выберите вариант оплаты"
        value={value.paymentOptions}
        allowClear
        mode="multiple"
        style={{ width: 320 }}
        onChange={(paymentOptions) => {
          onChange({
            ...value,
            paymentOptions,
          });
        }}
        options={[
          { value: 'cash', label: 'Наличные' },
          { value: 'card', label: 'Карта' },
          { value: 'certificate', label: 'Сертификат' },
        ]}
      />
      <Radio.Group
        value={value.chartType}
        onChange={(e: RadioChangeEvent) => {
          onChange({
            ...value,
            chartType: e.target.value,
          });
        }}
        options={[
          {
            value: 'line',
            className: 'option-1',
            label: (
              <Flex gap="small" justify="center" align="center" vertical>
                <LineChartOutlined style={{ fontSize: 16 }} />
                LineChart
              </Flex>
            ),
          },
          {
            value: 'bar',
            className: 'option-2',
            label: (
              <Flex gap="small" justify="center" align="center" vertical>
                <BarChartOutlined style={{ fontSize: 16 }} />
                BarChart
              </Flex>
            ),
          },
          {
            value: 'pie',
            disabled: value.metricType === 'margin' || value.metricType === 'averageCheck',
            className: 'option-3',
            label: (
              <Flex gap="small" justify="center" align="center" vertical>
                <PieChartOutlined style={{ fontSize: 16 }} />
                PieChart
              </Flex>
            ),
          },
        ]}
      />
    </Flex>
  );
};
