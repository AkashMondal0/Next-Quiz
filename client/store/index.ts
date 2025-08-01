import { configureStore } from '@reduxjs/toolkit'
import AccountReducer from './features/account/AccountSlice'
import RoomReducer from './features/room/RoomSlice'

export const store = configureStore({
  reducer: {
    AccountState: AccountReducer,
    RoomState: RoomReducer
  },
})


export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch