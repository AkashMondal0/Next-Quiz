import { configureStore } from '@reduxjs/toolkit'
import AccountReducer from './features/account/AccountSlice'

export const store = configureStore({
  reducer: {
    AccountState: AccountReducer,
  },
})


export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch