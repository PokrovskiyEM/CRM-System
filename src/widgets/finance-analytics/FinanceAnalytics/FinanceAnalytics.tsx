import { useGetAnalyticsQuery, useGetPointsQuery } from "@/entities/finance-analytics/api/financeAnalyticsApi";
import { FinanceCharts } from "@/entities/finance-analytics/ui/FinanceCharts";
import { FinanceKpi } from "@/entities/finance-analytics/ui/FinanceKpi";
import { FinanceTable } from "@/entities/finance-analytics/ui/FinanceTable";
import { createDefaultFinanceFilters } from "@/features/finance-filters/model/create-default-filters";
import { FinanceFilters } from "@/features/finance-filters/ui/FinanceFilters";
import { Alert, Button, Flex, Spin } from "antd";
import { useState } from "react";

export const FinanceAnalytics = () => {
  const [filters, setFilters] = useState(createDefaultFinanceFilters);

  const {
    chartType,
    ...queryParams
  } = filters;

  const pollingInterval = filters.metricType === 'revenue' ? 15_000 : 60_000;

  const {
    data: points = [],
    isLoading: isPointsLoading,
    isError: isPointsError,
  } = useGetPointsQuery();

  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useGetAnalyticsQuery(queryParams, {
    pollingInterval,
  });

  const isInitialLoading = isLoading && !data;

  return (
    <Flex vertical gap="small" justify="center">
      <FinanceFilters
        value={filters}
        onChange={setFilters}
        points={points}
        isPointsLoading={isPointsLoading}
      />

      {isPointsError && (
        <Alert
          type="warning"
          showIcon
          title="Не удалось загрузить список точек"
          description="Фильтр по точкам может быть недоступен. Попробуйте обновить страницу."
        />
      )}

      {isError && (
        <Alert
          type="error"
          showIcon
          title="Не удалось загрузить аналитику"
          action={(
            <Button size="small" onClick={() => refetch()}>
              Повторить
            </Button>
          )}
        />
      )}

      <>
        {isInitialLoading ? (
          <Flex justify="center" align="center" style={{ minHeight: 120 }}>
            <Spin size="large" />
          </Flex>
        ) : !isError && (
          <>
            <FinanceKpi summary={data?.summary} />
            <FinanceCharts
              chartType={chartType}
              data={data?.chartData ?? []}
              from={filters.from}
              to={filters.to}
              aggregationType={filters.aggregationType}
              metricType={filters.metricType}
            />
            <FinanceTable cashGaps={data?.cashGaps} />
          </>
        )}
      </>
    </Flex>
  );
};
