import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { fetchSession, handleLogOut } from './Api'

const initialState: AccountState = {
    session: null,
    sessionLoading: "idle",
    sessionError: null,
    counter: 0,
}

export type AccountState = {
    session: any | null
    sessionLoading: "normal" | "pending" | "error" | "idle"
    sessionError: string | null
    counter: number
}

export const AccountSlice = createSlice({
    name: 'Account',
    initialState,
    reducers: {
        increment: (state) => {
            state.counter += 1
        },
        decrement: (state) => {
            state.counter -= 1
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
                state.sessionLoading = "error"
                state.session = null
                state.sessionError = action.payload?.message ?? "fetch error"
            })
            // handleLogOutApi
            .addCase(handleLogOut.pending, (state) => {
                state.sessionLoading = "pending"
                state.sessionError = null
            })
            .addCase(handleLogOut.fulfilled, (state) => {
                state.session = null
                state.sessionLoading = "idle"
                state.sessionError = null
            })
            .addCase(handleLogOut.rejected, (state, action: PayloadAction<any>) => {
                state.sessionLoading = "error"
                state.sessionError = action.payload?.message ?? "logout error"
            })
    },
})

export const {
    increment,
    decrement,
} = AccountSlice.actions

export default AccountSlice.reducer