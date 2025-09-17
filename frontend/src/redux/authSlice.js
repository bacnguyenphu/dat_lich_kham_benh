import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { login } from '../services/authService';

export const loginUser = createAsyncThunk('auth/loginUser', async (data, { rejectWithValue }) => {
    try {
        const res = await login(data)
        return {
            data:res?.data,
            token:res?.token,
            error:res?.err,
            message:res?.message
        }
    } catch (error) {
        return rejectWithValue(error.response?.data || 'Login failed');
    }
})

const authSlice = createSlice({
    name: "auth",
    initialState: {
        data: null,
        token: null,
        loading: false,
        error: null,
        message:''
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.error = action.error;
                state.loading = false;
                state.data = action.payload?.data;
                state.token = 1;
                state.message = action.payload?.message;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error;
                state.message = action.payload?.message;
                state.token = null;
            });
    },
})

export default authSlice.reducer;