import authenticateReducer from "@/entities/session/model/auth-slice";
import { configureStore } from '@reduxjs/toolkit';

export const store = configureStore({
  reducer: {
    authenticate: authenticateReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch