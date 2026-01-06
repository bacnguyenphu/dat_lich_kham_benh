import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loginDoctor, logout } from '../services/authService';

export const loginDoctorRedux = createAsyncThunk('authDoctor/loginDoctorRedux', async (data, { rejectWithValue }) => {
    try {
        const res = await loginDoctor(data)
        if (res.err === 0) {
            return {
                data: res?.data,
                token: res?.token,
                error: res?.err,
                message: res?.message
            }
        }
        return {
            data: res?.data,
            token: res?.token,
            error: res?.err,
            message: res?.message
        }
    } catch (error) {
        return rejectWithValue(error.response?.data || 'Login failed');
    }
})

export const logoutDoctor = createAsyncThunk('auth/logoutDoctor', async () => {
    try {
        const res = await logout()

        if (res.err === 0) {
            return {
                data: null,
                token: null,
                loading: false,
                error: res.err,
                message: ''
            }
        }
    } catch (error) {
        console.log(error.response?.data || 'Logout failed');
    }
})

const authDoctorSlice = createSlice({
    name: "auth",
    initialState: {
        data: null,
        token: null,
        loading: false,
        error: null,
        message: ''
    },
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            //login doctor
            .addCase(loginDoctorRedux.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginDoctorRedux.fulfilled, (state, action) => {
                state.error = action.error;
                state.loading = false;
                state.data = action.payload?.data;
                state.token = action.payload?.token;
                state.message = action.payload?.message;
            })
            .addCase(loginDoctorRedux.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error;
                state.message = action.payload?.message;
                state.token = null;
            })

            //logout doctor
            .addCase(logoutDoctor.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(logoutDoctor.fulfilled, (state, action) => {
                state.error = action.error;
                state.loading = false;
                state.data = action.payload?.data;
                state.message = action.payload?.message;
                state.token = action.payload?.token;
            })
            .addCase(logoutDoctor.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error;
                state.message = action.payload?.message;
            })
    },
})

export default authDoctorSlice.reducer;