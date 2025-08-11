
import { RoomSession, RoomSessionActivityData } from '@/types';
import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

const initialState: RoomState = {
  roomSession: null,
}

export type RoomState = {
  roomSession: RoomSession | null;
}

export const RoomSlice = createSlice({
  name: 'Room',
  initialState,
  reducers: {
    setRoomSession: (state, action: PayloadAction<RoomSession | null>) => {
      state.roomSession = action.payload;
    },
    setRoomSessionStart: (state, action: PayloadAction<RoomSessionActivityData>) => {
      if (state.roomSession && state.roomSession.code === action.payload.code) {
        state.roomSession.matchStarted = true;
      }
    },
    setRoomSessionScore: (state, action: PayloadAction<RoomSessionActivityData>) => {
      if (state.roomSession?.matchRanking && state.roomSession.code === action.payload.code) {
        state.roomSession.matchRanking.forEach(player => {
          if (player.id === action.payload.id) {
            player.score = action.payload.totalAnswered;
          }
        });
      }
    },
    setRoomSessionSubmit: (state) => {
      if (state.roomSession?.matchRanking) {
        state.roomSession.matchEnded = true;
      }
    }
  },
  // extraReducers: (builder) => {
  // builder
  // // getSessionApi
  // .addCase(fetchSession.pending, (state) => {
  //   state.sessionLoading = "pending"
  //   state.sessionError = null
  // })
  // .addCase(fetchSession.fulfilled, (state, action: PayloadAction<RoomState["session"]>) => {
  //   state.session = action.payload
  //   state.sessionLoading = "normal"
  // })
  // .addCase(fetchSession.rejected, (state, action: PayloadAction<any>) => {
  //   state.sessionLoading = "normal"
  //   state.sessionError = action.payload?.message ?? "fetch error"
  // })
  // },
})

export const {
  setRoomSession,
  setRoomSessionScore,
  setRoomSessionSubmit,
  setRoomSessionStart
} = RoomSlice.actions

export default RoomSlice.reducer