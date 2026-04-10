import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'
import type { Roles } from '../../../../types/users'

interface AuthState {
  isAuth: boolean,
  roles: Roles[]
}

const initialState: AuthState = {
  isAuth: false,
  roles: []
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<{ roles: Roles[] }>) => {
      state.isAuth = true
      state.roles = action.payload.roles
    },
    logout: (state) => {
      state.isAuth = false
      state.roles = []
    }
  },
})

export const { setAuth, logout } = authSlice.actions

export default authSlice.reducer