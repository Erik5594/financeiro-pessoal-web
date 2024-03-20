import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { message } from "antd";
import PerfilService from "services/PerfilService";


export const initialState = {
  loading: false,
  message: "",
  showMessage: false,
  perfil: {},
};

export const buscar = createAsyncThunk(
  "perfil/buscar",
  async (_, { rejectWithValue }) => {
    try {
      const response = await PerfilService.buscar();
      return response;
    } catch (err) {
      return rejectWithValue(err.response?.data?.mensagem || "Error");
    }
  }
);

export const atualizar = createAsyncThunk(
  "perfil/atualizar",
  async (data, { rejectWithValue }) => {
    const key = "atualizando";
    message.loading({ content: "Atualizando...", key, duration: 1000 });
    try {
      await PerfilService.atualizar(data);
      message.success({ content: "Atualizado!", key, duration: 1.5 });
      return data;
    } catch (err) {
      console.log("Ocorreu um erro ao tentar atualizar perfil!", err);
      return rejectWithValue(err.response?.data?.mensagem || "Error");
    }
  }
);

export const buscarOuCriar = createAsyncThunk(
  "perfil/buscarOuCriar",
  async (_, { rejectWithValue }) => {
    try {
      const response = await PerfilService.buscarOuCriar();
      return response;
    } catch (err) {
      return rejectWithValue(err.response?.data?.mensagem || "Error");
    }
  }
);

export const perfilSlice = createSlice({
  name: "perfil",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(buscar.pending, (state) => {
        state.loading = true;
      })
      .addCase(buscar.fulfilled, (state, action) => {
        state.loading = false;
        state.perfil = action.payload;
      })
      .addCase(buscar.rejected, (state, action) => {
        state.message = action.payload;
        state.showMessage = true;
        state.loading = false;
      })
      .addCase(atualizar.pending, (state) => {
        state.loading = true;
      })
      .addCase(atualizar.fulfilled, (state, action) => {
        state.loading = false;
        state.message = "Perfil atualizado com sucesso!";
        state.showMessage = true;
      })
      .addCase(atualizar.rejected, (state, action) => {
        state.message = action.payload;
        state.showMessage = true;
        state.loading = false;
      })
      .addCase(buscarOuCriar.pending, (state) => {
        state.loading = true;
      })
      .addCase(buscarOuCriar.fulfilled, (state, action) => {
        state.loading = false;
        state.perfil = action.payload;
      })
      .addCase(buscarOuCriar.rejected, (state, action) => {
        state.message = action.payload;
        state.showMessage = true;
        state.loading = false;
      });
  },
});

export default perfilSlice.reducer;
