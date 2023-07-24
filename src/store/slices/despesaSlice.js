import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import DespesaService from "services/DespesaService";

export const initialState = {
  loading: false,
  message: "",
  showMessage: false,
  despesas: [],
  despesa: {},
  content: {},
};

export const listar = createAsyncThunk(
  "despesa/listar",
  async (data, { rejectWithValue }) => {
    const { size, page } = data;
    try {
      const response = await DespesaService.listar({ size, page });
      return response;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Error");
    }
  }
);

export const cadastrar = createAsyncThunk(
  "despesa/cadastrar",
  async (data, { rejectWithValue }) => {
    try {
      const response = await (data.id
        ? DespesaService.atualizar(data)
        : DespesaService.cadastrar(data));
      return response;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Error");
    }
  }
);

export const excluir = createAsyncThunk(
  "despesa/excluir",
  async (data, { rejectWithValue }) => {
    try {
      await DespesaService.excluir(data);
      return true;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Error");
    }
  }
);

export const buscarById = createAsyncThunk(
  "despesa/buscarById",
  async (data, { rejectWithValue }) => {
    try {
      const response = await DespesaService.buscarById({ id: data.id });
      return response;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Error");
    }
  }
);

export const despesaSlice = createSlice({
  name: "despesa",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(listar.pending, (state) => {
        state.loading = true;
      })
      .addCase(listar.fulfilled, (state, action) => {
        state.loading = false;
        state.content = action.payload;
        state.despesas = action.payload.content;
      })
      .addCase(listar.rejected, (state, action) => {
        state.message = action.payload;
        state.showMessage = true;
        state.loading = false;
      })
      .addCase(cadastrar.pending, (state) => {
        state.loading = true;
      })
      .addCase(cadastrar.fulfilled, (state, action) => {
        state.loading = false;
        state.content = action.payload;
        state.despesas = action.payload.content;
      })
      .addCase(cadastrar.rejected, (state, action) => {
        state.message = action.payload;
        state.showMessage = true;
        state.loading = false;
      })
      .addCase(excluir.pending, (state) => {
        state.loading = true;
      })
      .addCase(excluir.fulfilled, (state, action) => {
        state.loading = false;
        state.message = "Cadastro excluido com sucesso!";
        state.showMessage = true;
      })
      .addCase(excluir.rejected, (state, action) => {
        state.message = action.payload;
        state.showMessage = true;
        state.loading = false;
      });
  },
});

export default despesaSlice.reducer;
