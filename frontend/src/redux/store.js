import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice'
import authDoctorReducer from './authDoctorSlice'
import specialty from './specialtySlice'
import storage from 'redux-persist/lib/storage'
import hardSet from 'redux-persist/lib/stateReconciler/hardSet'
import { persistStore, persistReducer } from "redux-persist";

const authConfig = {
    key: 'authUser',
    storage,
    stateReconciler: hardSet,
    whitelist: ["token", "data"]
}

// const authDoctorConfig = {
//     key: 'authDoctor',
//     storage,
//     stateReconciler: hardSet,
//     whitelist: ["token", "data"]
// }

const specialtyConfig = {
    key: 'specialties',
    storage,
    stateReconciler: hardSet,
    whitelist: ["data"]
}

export const store = configureStore({
    reducer: {
        auth: persistReducer(authConfig, authReducer),
        authDoctor: persistReducer(authConfig, authDoctorReducer),
        specialties: persistReducer(specialtyConfig, specialty)
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false, // 👈 tắt check toàn bộ
        }),
})

export const persistor = persistStore(store);