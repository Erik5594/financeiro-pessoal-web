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
    try {
      const response = await DespesaService.listar(data);
      return response;
    } catch (err) {
      return rejectWithValue(err.response?.data?.mensagem || "Error");
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
      return rejectWithValue(err.response?.data?.mensagem || "Error");
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
      return rejectWithValue(err.response?.data?.mensagem || "Error");
    }
  }
);

export const excluirVarios = createAsyncThunk(
  "despesa/excluirVarios",
  async (data, { rejectWithValue }) => {
    try {
      await DespesaService.excluirVarios(data);
      return true;
    } catch (err) {
      return rejectWithValue(err.response?.data?.mensagem || "Error");
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
      return rejectWithValue(err.response?.data?.mensagem || "Error");
    }
  }
);

export const pagar = createAsyncThunk(
  "despesa/pagar",
  async (data, { rejectWithValue }) => {
    try {
      const response = await DespesaService.pagar({ id: data.id });
      return response;
    } catch (err) {
      return rejectWithValue(err.response?.data?.mensagem || "Error");
    }
  }
);

export const pagarVarias = createAsyncThunk(
  "despesa/pagarVarias",
  async (data, { rejectWithValue }) => {
    try {
      await DespesaService.pagarVarias(data);
      return true;
    } catch (err) {
      return rejectWithValue(err.response?.data?.mensagem || "Error");
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
      })
      .addCase(excluirVarios.pending, (state) => {
        state.loading = true;
      })
      .addCase(excluirVarios.fulfilled, (state, action) => {
        state.loading = false;
        state.message = "Cadastros excluidos com sucesso!";
        state.showMessage = true;
      })
      .addCase(excluirVarios.rejected, (state, action) => {
        state.message = action.payload;
        state.showMessage = true;
        state.loading = false;
      })
      .addCase(pagar.pending, (state) => {
        state.loading = true;
      })
      .addCase(pagar.fulfilled, (state, action) => {
        state.loading = false;
        state.message = "Registro pago com sucesso!";
        state.showMessage = true;
      })
      .addCase(pagar.rejected, (state, action) => {
        state.message = action.payload;
        state.showMessage = true;
        state.loading = false;
      })
      .addCase(pagarVarias.pending, (state) => {
        state.loading = true;
      })
      .addCase(pagarVarias.fulfilled, (state, action) => {
        state.loading = false;
        state.message = "Cadastros pagos com sucesso!";
        state.showMessage = true;
      })
      .addCase(pagarVarias.rejected, (state, action) => {
        state.message = action.payload;
        state.showMessage = true;
        state.loading = false;
      });
  },
});

export default despesaSlice.reducer;
