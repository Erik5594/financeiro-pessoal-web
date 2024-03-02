import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import MetodoPagamentoService from "services/MetodoPagamentoService";

export const initialState = {
  loading: false,
  hasMore: false,
  message: "",
  showMessage: false,
  metodosPagamentos: [],
  registro: {},
};

export const listar = createAsyncThunk(
  "metodo-pagamento/listar",
  async (data, { rejectWithValue }) => {
    const { size, page } = data;
    try {
      const response = await MetodoPagamentoService.listar({ size, page });
      return response;
    } catch (err) {
      return rejectWithValue(err.response?.data?.mensagem || "Error");
    }
  }
);

export const cadastrar = createAsyncThunk(
  "metodo-pagamento/cadastrar",
  async (data, { rejectWithValue }) => {
    try {
      await (data.id
        ? MetodoPagamentoService.atualizar(data)
        : MetodoPagamentoService.cadastrar(data));
      return true;
    } catch (err) {
      return rejectWithValue(err.response?.data?.mensagem || "Error");
    }
  }
);

export const excluir = createAsyncThunk(
  "metodo-pagamento/excluir",
  async (data, { rejectWithValue }) => {
    try {
      await MetodoPagamentoService.excluir(data);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.mensagem || "Error");
    }
  }
);

export const metodosPagamentoSlice = createSlice({
  name: "metodosPagamento",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(listar.pending, (state) => {
        state.loading = true;
      })
      .addCase(listar.fulfilled, (state, action) => {
        state.loading = false;
        state.hasMore = action.payload.totalPages !== action.payload.number + 1;
        state.registro = action.payload;
        state.metodosPagamentos = action.payload.content;
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
        state.message = "Cadastro realizado com sucesso!";
        state.showMessage = true;
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

export default metodosPagamentoSlice.reducer;
