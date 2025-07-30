import { loadingType, User } from '@/types';
import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { fetchSession } from './Api'

const initialState: AccountState = {
  session: null,
  sessionLoading: "idle",
  sessionError: null,
}

export type AccountState = {
  session: User | null
  sessionLoading: loadingType
  sessionError: string | null
}

export const AccountSlice = createSlice({
  name: 'Account',
  initialState,
  reducers: {
    resetSession: (state) => {
      state.session = null;
      state.sessionLoading = "idle";
      state.sessionError = null;
    },

    setSession: (state, action: PayloadAction<User | null>) => {
      state.session = action.payload;
      state.sessionLoading = "normal";
      state.sessionError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // getSessionApi
      .addCase(fetchSession.pending, (state) => {
        state.sessionLoading = "pending"
        state.sessionError = null
      })
      .addCase(fetchSession.fulfilled, (state, action: PayloadAction<AccountState["session"]>) => {
        state.session = action.payload
        state.sessionLoading = "normal"
      })
      .addCase(fetchSession.rejected, (state, action: PayloadAction<any>) => {
        state.sessionLoading = "normal"
        state.sessionError = action.payload?.message ?? "fetch error"
      })
  },
})

export const {
  setSession
} = AccountSlice.actions

export default AccountSlice.reducer