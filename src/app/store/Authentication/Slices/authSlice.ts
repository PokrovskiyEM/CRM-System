import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'
import type { Role } from '../../../../types/users'

interface AuthenticateState {
  isAuthenticated: boolean,
  roles: Role[]
}

const initialState: AuthenticateState = {
  isAuthenticated: false,
  roles: []
}

export const authSlice = createSlice({
  name: 'authenticate',
  initialState,
  reducers: {
    setAuthenticated: (state: AuthenticateState, action: PayloadAction<{ roles: Role[] }>): void => {
      state.isAuthenticated = true
      state.roles = action.payload.roles
    },
    logout: (state: AuthenticateState): void => {
      state.isAuthenticated = false
      state.roles = []
    }
  },
})

export const { setAuthenticated, logout } = authSlice.actions

export default authSlice.reducer