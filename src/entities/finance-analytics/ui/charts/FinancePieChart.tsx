import type { ChartSeriesPoint } from '@/entities/finance-analytics/model/types';
import { formatNumber } from '@/shared/lib/format-number';
import { Cell, Legend, Pie, PieChart, Tooltip } from 'recharts';
import { ChartShell } from './ChartShell';
import { CHART_MARGIN, PIE_COLORS } from './chart-config';

interface Props {
  data: ChartSeriesPoint[];
}

export default function FinancePieChart({ data }: Props) {
  const pieData = data.map((point) => ({
    name: point.label,
    value: point.currentValue,
    periodKey: point.periodKey,
  }));

  return (
    <ChartShell title="Распределение по периодам">
      <PieChart
        style={{ width: '100%', height: 320 }}
        responsive
        margin={CHART_MARGIN}
      >
        <Pie
          data={pieData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={70}
          outerRadius={120}
          paddingAngle={2}
          label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`}
          labelLine={{ stroke: '#bfbfbf' }}
        >
          {pieData.map((entry, index) => (
            <Cell
              key={entry.periodKey}
              fill={PIE_COLORS[index % PIE_COLORS.length]}
              stroke="#fff"
              strokeWidth={2}
            />
          ))}
        </Pie>
        <Tooltip
          formatter={(value) => formatNumber(Number(value))}
          contentStyle={{
            borderRadius: 8,
            borderColor: '#f0f0f0',
            boxShadow: '0 2px 8px rgb(0 0 0 / 8%)',
          }}
        />
        <Legend
          layout="horizontal"
          verticalAlign="bottom"
          align="center"
        />
      </PieChart>
    </ChartShell>
  );
}
