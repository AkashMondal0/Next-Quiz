import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { fetchRoomSession, fetchSession, handleLogOut } from './Api'
import { Player, RoomSession } from '@/types'

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
        joinUserInRoom(state, action: PayloadAction<Player>) {
            if (state.roomSession) {
                state.roomSession.players.push(action.payload)
            }
        },
        leaveUserFromRoom(state, action: PayloadAction<string>) {
            if (state.roomSession) {
                state.roomSession.players = state.roomSession.players.filter(player => player.id !== action.payload);
            }
        },
        roomReset(state) {
            state.roomSession = null;
        },
        playerReadyToggle(state, action: PayloadAction<{ playerId: string; isReady: boolean; roomCode: string }>) {
            if (state.roomSession?.id === action.payload.roomCode) {
                const player = state.roomSession.players.find(p => p.id === action.payload.playerId);
                if (player) {
                    player.isReady = action.payload.isReady;
                }
            }
        },
        gameStart(state) {
            if (state.roomSession) {
                state.roomSession.matchStarted = true;
            }
        },
        rankingActivity(state, action: PayloadAction<{ playerId: string; roomCode: string; answeredCount: number }>) {
            if (state.roomSession?.id === action.payload.roomCode) {
                const player = state.roomSession.matchRanking.find(p => p.id === action.payload.playerId);
                if (player) {
                    player.answered = action.payload.answeredCount;
                }
            }
        },
        resultUpdate(state, action: PayloadAction<RoomSession["matchResults"]>) {
            if (state.roomSession) {
                state.roomSession.matchResults = action.payload;
            }
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
    joinUserInRoom,
    leaveUserFromRoom,
    roomReset,
    playerReadyToggle,
    gameStart,
    rankingActivity,
    resultUpdate
} = AccountSlice.actions

export default AccountSlice.reducer