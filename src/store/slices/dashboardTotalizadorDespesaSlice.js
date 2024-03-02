import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import DashboardService from "services/DashboardService";
import dayjs from "dayjs";

export const initialState = {
  loading: false,
  message: "",
  showMessage: false,
  totalizador: {},
  content: {},
};

export const buscar = createAsyncThunk(
  "totalizadorDespesa/buscar",
  async (competencia, { rejectWithValue }) => {
    try {
      let competenciaFormatada = undefined;
      if(competencia){
        competenciaFormatada = dayjs(competencia).format("DD/MM/YYYY")
      }
      const response = await DashboardService.totalizadorDespesa(competenciaFormatada);
      return response;
    } catch (err) {
      return rejectWithValue(err.response?.data?.mensagem || "Error");
    }
  }
);


export const dashboardTotalizadorDespesaSlice = createSlice({
  name: "dashboardTotalizadorDespesaSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(buscar.pending, (state) => {
        state.loading = true;
      })
      .addCase(buscar.fulfilled, (state, action) => {
        state.loading = false;
        state.content = action.payload;
        state.totalizador = action.payload;
      })
      .addCase(buscar.rejected, (state, action) => {
        state.message = action.payload;
        state.showMessage = true;
        state.loading = false;
      });
  },
});

export default dashboardTotalizadorDespesaSlice.reducer;
