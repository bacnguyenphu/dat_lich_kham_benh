import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { login, logout } from '../services/authService';
import { getUserById } from '../services/userService';

export const loginUser = createAsyncThunk('auth/loginUser', async (data, { rejectWithValue }) => {
    try {
        const res = await login(data)
        if (res.err === 0) {
            return {
                data: res?.data,
                token: res?.token,
                error: res?.err,
                message: res?.message
            }
        }
        return null
    } catch (error) {
        return rejectWithValue(error.response?.data || 'Login failed');
    }
})

export const logoutUser = createAsyncThunk('auth/logoutUser', async () => {
    try {
        const res = await logout()
        console.log('chekc res lgout: ', res);

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
    reducers: {
        // logoutUser: (state) => {
        //     state.error = null;
        //     state.loading = false;
        //     state.data = null;
        //     state.message = null;
        //     state.token = null;
        // }
    },
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
                state.token = action.payload?.token;
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

            //logout
            .addCase(logoutUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(logoutUser.fulfilled, (state, action) => {
                state.error = action.error;
                state.loading = false;
                state.data = action.payload?.data;
                state.message = action.payload?.message;
                state.token = action.payload?.token;
            })
            .addCase(logoutUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error;
                state.message = action.payload?.message;
            })
    },
})

// export const {logoutUser} = authSlice.reducer
export default authSlice.reducer;