import { configureStore } from '@reduxjs/toolkit'
import AccountReducer from '@/store/features/account/AccountSlice'

// ✅ Configure Redux store
export const store = configureStore({
  reducer: {
    AccountState: AccountReducer,
  },
})

// ✅ Types for TypeScript
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
