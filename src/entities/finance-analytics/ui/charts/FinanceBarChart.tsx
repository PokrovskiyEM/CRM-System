import { formatChartTooltipLabel } from '@/entities/finance-analytics/lib/format-chart-label';
import type { ChartSeriesPoint } from '@/entities/finance-analytics/model/types';
import { formatNumber } from '@/shared/lib/format-number';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { ChartShell } from './ChartShell';
import { CHART_MARGIN, CHART_SERIES } from './chart-config';

interface Props {
  data: ChartSeriesPoint[];
}

const hasSeriesData = (data: ChartSeriesPoint[], key: keyof ChartSeriesPoint): boolean =>
  data.some((point) => point[key] !== undefined && point[key] !== null);

export default function FinanceBarChart({ data }: Props) {
  const showPlan = hasSeriesData(data, 'planValue');
  const showPrevious = hasSeriesData(data, 'previousValue');

  return (
    <ChartShell title="Сравнение по периодам">
      <BarChart
        style={{ width: '100%', height: 320 }}
        responsive
        data={data}
        margin={CHART_MARGIN}
      >
        <CartesianGrid stroke="#f0f0f0" strokeDasharray="4 4" vertical={false} />
        <XAxis
          dataKey="label"
          minTickGap={20}
          interval="preserveStartEnd"
          tick={{ fill: '#595959', fontSize: 12 }}
          axisLine={{ stroke: '#d9d9d9' }}
          tickLine={{ stroke: '#d9d9d9' }}
        />
        <YAxis
          width="auto"
          tick={{ fill: '#595959', fontSize: 12 }}
          axisLine={{ stroke: '#d9d9d9' }}
          tickLine={{ stroke: '#d9d9d9' }}
          tickFormatter={formatNumber}
        />
        <Tooltip
          formatter={(value) => formatNumber(Number(value))}
          labelFormatter={(_, payload) => {
            const point = payload?.[0]?.payload as ChartSeriesPoint | undefined;

            if (!point) {
              return '';
            }

            return formatChartTooltipLabel(point.label, point.periodKey);
          }}
          cursor={{ fill: 'rgb(22 119 255 / 6%)' }}
          contentStyle={{
            borderRadius: 8,
            borderColor: '#f0f0f0',
            boxShadow: '0 2px 8px rgb(0 0 0 / 8%)',
          }}
        />
        <Legend
          formatter={(value) => CHART_SERIES[value as keyof typeof CHART_SERIES]?.label ?? value}
        />
        <Bar
          dataKey="currentValue"
          name="currentValue"
          fill={CHART_SERIES.currentValue.color}
          radius={[6, 6, 0, 0]}
          maxBarSize={48}
        />
        {showPlan && (
          <Bar
            dataKey="planValue"
            name="planValue"
            fill={CHART_SERIES.planValue.color}
            radius={[6, 6, 0, 0]}
            maxBarSize={48}
          />
        )}
        {showPrevious && (
          <Bar
            dataKey="previousValue"
            name="previousValue"
            fill={CHART_SERIES.previousValue.color}
            radius={[6, 6, 0, 0]}
            maxBarSize={48}
          />
        )}
      </BarChart>
    </ChartShell>
  );
}
