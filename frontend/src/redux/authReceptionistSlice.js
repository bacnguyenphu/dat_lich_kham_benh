import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginReceptionist, logout } from "../services/authService";

export const loginReceptionistRedux = createAsyncThunk(
  "authReceptionist/loginReceptionistRedux",
  async (data, { rejectWithValue }) => {
    try {
      const res = await loginReceptionist(data);
      if (res.err === 0) {
        return {
          data: res?.data,
          token: res?.token,
          error: res?.err,
          message: res?.message,
        };
      }
      return {
        data: res?.data,
        token: res?.token,
        error: res?.err,
        message: res?.message,
      };
    } catch (error) {
      return rejectWithValue(error.response?.data || "Login failed");
    }
  },
);

export const logoutReceptionistRedux = createAsyncThunk(
  "auth/logoutReceptionistRedux",
  async () => {
    try {
      const res = await logout();

      if (res.err === 0) {
        return {
          data: null,
          token: null,
          loading: false,
          error: res.err,
          message: "",
        };
      }
    } catch (error) {
      console.log(error.response?.data || "Logout failed");
    }
  },
);

const authReceptionistSlice = createSlice({
  name: "auth",
  initialState: {
    data: null,
    token: null,
    loading: false,
    error: null,
    message: "",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      //login receptionist
      .addCase(loginReceptionistRedux.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginReceptionistRedux.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
        state.message = action.payload?.message;
        state.token = null;
      })
      .addCase(loginReceptionistRedux.fulfilled, (state, action) => {
        state.error = action.error;
        state.loading = false;
        state.data = action.payload?.data;
        state.token = action.payload?.token;
        state.message = action.payload?.message;
      })

      //logout receptionist
      .addCase(logoutReceptionistRedux.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutReceptionistRedux.fulfilled, (state, action) => {
        state.error = action.error;
        state.loading = false;
        state.data = action.payload?.data;
        state.message = action.payload?.message;
        state.token = action.payload?.token;
      })
      .addCase(logoutReceptionistRedux.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
        state.message = action.payload?.message;
      });
  },
});

export default authReceptionistSlice.reducer;
