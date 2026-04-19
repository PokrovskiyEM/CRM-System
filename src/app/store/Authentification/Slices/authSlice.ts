import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'

interface AuthState {
  isAuth: boolean
}

const initialState: AuthState = {
  isAuth: false,
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (state: AuthState, action: PayloadAction<boolean>): void => {
      state.isAuth = action.payload
    },
    logout: (state: AuthState): void => {
      state.isAuth = false
    }
  },
})

export const { setAuth, logout } = authSlice.actions

export default authSlice.reducer