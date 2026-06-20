import { baseQueryWithAuth } from '@/shared/api/rtk-base-query';
import { serializeQueryParams } from '@/shared/lib/serialize-query-params';
import { createApi } from '@reduxjs/toolkit/query/react';
import type { AnalyticsQuery, GetAnalyticsResponse, GetPointsResponse } from '../model/types';

export const financeApi = createApi({
  reducerPath: 'financeApi',
  baseQuery: baseQueryWithAuth,
  endpoints: (builder) => ({
    getPoints: builder.query<GetPointsResponse, void>({
      query: () => '/finance/analytics/points',
    }),

    getAnalytics: builder.query<GetAnalyticsResponse, AnalyticsQuery>({
      query: (params) => ({
        url: '/finance/analytics',
        params,
        paramsSerializer: serializeQueryParams,
      }),
    }),
  }),
});

export const { useGetPointsQuery, useGetAnalyticsQuery } = financeApi;
