import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice'
import storage from 'redux-persist/lib/storage'
import hardSet from 'redux-persist/lib/stateReconciler/hardSet'
import { persistStore, persistReducer } from "redux-persist";

const authConfig = {
    key: 'authUser',
    storage,
    stateReconciler: hardSet,
    whitelist: ["token","data"]
}

export const store = configureStore({
    reducer: {
        auth: persistReducer(authConfig, authReducer),
    },
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // 👈 tắt check toàn bộ
    }),
})

export const persistor = persistStore(store);