import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getSpecialties } from "../services/specialtyService";


export const getSpecialtyRedux = createAsyncThunk("specialties/getSpecialtyRedux", async (limit, { rejectWithValue }) => {
    try {
        const res = await getSpecialties(limit)
        if (res.err == 0) {
            return {
                data: res?.data,
                error: res?.err,
                message: res?.message
            }
        }
        else {
            return null
        }
    } catch (error) {
        return rejectWithValue(error.response?.data || 'Get special false');
    }
})

const specialtySlice = createSlice({
    name: "specialties",
    initialState: {
        data: null,
        loading: false,
        error: null,
        message: ''
    },
    reducers: {},
    extraReducers:(builder)=>{
        builder
            .addCase(getSpecialtyRedux.pending,(state)=>{
                state.loading = true;
                state.error = null;
            })
            .addCase(getSpecialtyRedux.fulfilled,(state,action)=>{
                state.data = action.payload?.data
                state.loading = false,
                state.message = action.payload?.message
            })
            .addCase(getSpecialtyRedux.rejected,(state,action)=>{
                state.error = action.error
                state.loading = false,
                state.message = action.payload?.message
            })
    }
})

export default specialtySlice.reducer