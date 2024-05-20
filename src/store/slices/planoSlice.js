import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { message } from "antd";
import PlanoService from "services/PlanoService";


export const initialState = {
  loading: false,
  message: "",
  showMessage: false,
  plano: {},
};

export const buscar = createAsyncThunk(
  "plano/buscar",
  async (_, { rejectWithValue }) => {
    try {
      const response = await PlanoService.buscar();
      return response;
    } catch (err) {
      return rejectWithValue(err.response?.data?.mensagem || "Error");
    }
  }
);

export const planoSlice = createSlice({
  name: "plano",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(buscar.pending, (state) => {
        state.loading = true;
      })
      .addCase(buscar.fulfilled, (state, action) => {
        state.loading = false;
        state.plano = action.payload;
      })
      .addCase(buscar.rejected, (state, action) => {
        state.message = action.payload;
        state.showMessage = true;
        state.loading = false;
      });
  },
});

export default planoSlice.reducer;
