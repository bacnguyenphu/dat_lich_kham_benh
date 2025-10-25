import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loginDoctor } from '../services/authService';

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
    },
})

export default authDoctorSlice.reducer;