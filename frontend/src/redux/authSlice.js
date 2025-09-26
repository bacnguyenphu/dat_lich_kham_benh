import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { login } from '../services/authService';
import { getUserById } from '../services/userService';

export const loginUser = createAsyncThunk('auth/loginUser', async (data, { rejectWithValue }) => {
    try {
        const res = await login(data)
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


export const getUserRedux = createAsyncThunk('auth/getUserRedux', async (idUser, { rejectWithValue }) => {
    try {
        const res = await getUserById(idUser)
        return {
            data: res?.data,
            error: res?.err,
            message: res?.message
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
        message: ''
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
            })

            // get user by ID
            .addCase(getUserRedux.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getUserRedux.fulfilled, (state, action) => {
                state.error = action.error;
                state.loading = false;
                state.data = action.payload?.data;
                state.message = action.payload?.message;
            })
            .addCase(getUserRedux.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error;
                state.message = action.payload?.message;
            })
},
})

export default authSlice.reducer;