import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { message } from "antd";
import MensalidadeService from "services/MensalidadeService";


export const initialState = {
  loading: false,
  message: "",
  showMessage: false,
  mensalidade: {},
};

export const buscar = createAsyncThunk(
  "mensalidade/buscar",
  async (_, { rejectWithValue }) => {
    try {
      const response = await MensalidadeService.buscar();
      return response;
    } catch (err) {
      return rejectWithValue(err.response?.data?.mensagem || "Error");
    }
  }
);

export const mensalidadeSlice = createSlice({
  name: "mensalidade",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(buscar.pending, (state) => {
        state.loading = true;
      })
      .addCase(buscar.fulfilled, (state, action) => {
        state.loading = false;
        state.mensalidade = action.payload;
      })
      .addCase(buscar.rejected, (state, action) => {
        state.message = action.payload;
        state.showMessage = true;
        state.loading = false;
      });
  },
});

export default mensalidadeSlice.reducer;
