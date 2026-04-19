import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'

interface AuthenticateState {
  isAuthenticated: boolean
}

const initialState: AuthenticateState = {
  isAuthenticated: false,
}

export const authSlice = createSlice({
  name: 'authenticate',
  initialState,
  reducers: {
    setAuthenticated: (state: AuthenticateState, action: PayloadAction<boolean>): void => {
      state.isAuthenticated = action.payload
    },
    logout: (state: AuthenticateState): void => {
      state.isAuthenticated = false
    }
  },
})

export const { setAuthenticated, logout } = authSlice.actions

export default authSlice.reducer