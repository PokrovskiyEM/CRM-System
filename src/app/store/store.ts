import { financeApi } from "@/entities/finance-analytics/api/financeAnalyticsApi";
import authenticateReducer from "@/entities/session/model/auth-slice";
import { configureStore } from '@reduxjs/toolkit';

export const store = configureStore({
  reducer: {
    authenticate: authenticateReducer,
    [financeApi.reducerPath]: financeApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(financeApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch