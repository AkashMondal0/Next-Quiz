import { combineReducers, configureStore } from '@reduxjs/toolkit'
import AccountReducer from './features/account/AccountSlice'
import RoomReducer from './features/room/RoomSlice'
import storage from 'redux-persist/lib/storage';
import { persistStore, persistReducer } from 'redux-persist';

const rootReducer = combineReducers({
  AccountState: AccountReducer,
  RoomState: RoomReducer
});

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['AccountState'],
  blacklist: ['RoomState']
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false
  })
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch