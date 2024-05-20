import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { message } from "antd";
import SettingsService from "services/SettingsService";


export const initialState = {
  loading: false,
  message: "",
  showMessage: false,
  setting: {},
};

export const buscar = createAsyncThunk(
  "settings/buscar",
  async (_, { rejectWithValue }) => {
    try {
      const response = await SettingsService.buscar();
      return response;
    } catch (err) {
      return rejectWithValue(err.response?.data?.mensagem || "Error");
    }
  }
);

export const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(buscar.pending, (state) => {
        state.loading = true;
      })
      .addCase(buscar.fulfilled, (state, action) => {
        state.loading = false;
        state.setting = action.payload;
      })
      .addCase(buscar.rejected, (state, action) => {
        state.message = action.payload;
        state.showMessage = true;
        state.loading = false;
      });
  },
});

export default settingsSlice.reducer;
