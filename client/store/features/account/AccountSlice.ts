import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { fetchRoomSession, fetchSession, handleLogOut } from './Api'
import { RoomSession } from '@/types'

const initialState: AccountState = {
    session: null,
    sessionLoading: "idle",
    sessionError: null,
    roomSession: null,
    roomSessionLoading: "idle",
    roomSessionError: null,
}

export type AccountState = {
    session: any | null
    sessionLoading: "normal" | "pending" | "error" | "idle"
    sessionError: string | null
    roomSession: RoomSession | null
    roomSessionLoading?: "normal" | "pending" | "error" | "idle"
    roomSessionError?: string | null
}

export const AccountSlice = createSlice({
    name: 'Account',
    initialState,
    reducers: {

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
            // fetchRoomSessionApi
            .addCase(fetchRoomSession.pending, (state) => {
                state.roomSessionLoading = "pending"
                state.roomSessionError = null
            })
            .addCase(fetchRoomSession.fulfilled, (state, action: PayloadAction<RoomSession>) => {
                state.roomSession = action.payload
                state.roomSessionLoading = "normal"
            })
            .addCase(fetchRoomSession.rejected, (state, action: PayloadAction<any>) => {
                state.roomSessionLoading = "error"
                state.roomSessionError = action.payload?.message ?? "logout error"
            })
    },
})

export const {

} = AccountSlice.actions

export default AccountSlice.reducer