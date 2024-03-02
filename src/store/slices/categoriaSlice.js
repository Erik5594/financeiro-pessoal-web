import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import CategoriaService from 'services/CategoriaService';

export const initialState = {
	loading: false,
	message: '',
	showMessage: false,
	categorias: [],
	categoria: {},
	categoriaTree: {despesas: [], receitas: []},
}

export const buscarTodas = createAsyncThunk('categoria/buscarTodas',async (data, { rejectWithValue }) => {
	try {
		const response = await CategoriaService.buscarTodas()
        return response
	} catch (err) {
		return rejectWithValue(err.response?.data?.mensagem || 'Error')
	}
})

export const buscarById = createAsyncThunk('categoria/buscarById',async (data, { rejectWithValue }) => {
	try {
		const response = await CategoriaService.buscarById({id: data.id})
        return response
	} catch (err) {
		return rejectWithValue(err.response?.data?.mensagem || 'Error')
	}
})

export const cadastrar = createAsyncThunk('categoria/cadastrar',async (data, { rejectWithValue }) => {
	try {
		await CategoriaService.cadastrar(data)
        return true
	} catch (err) {
		return rejectWithValue(err.response?.data?.mensagem || 'Error')
	}
})

export const editar = createAsyncThunk('categoria/editar',async (data, { rejectWithValue }) => {
	try {
		await CategoriaService.editar(data)
        return true
	} catch (err) {
		return rejectWithValue(err.response?.data?.mensagem || 'Error')
	}
})

export const excluir = createAsyncThunk('categoria/excluir',async (data, { rejectWithValue }) => {
	try {
		await CategoriaService.excluir(data)
        return true
	} catch (err) {
		return rejectWithValue(err.response?.data?.mensagem || 'Error')
	}
})

export const buscarTree = createAsyncThunk('categoria/buscarTree',async (data, { rejectWithValue }) => {
	try {
		const response = await CategoriaService.buscarTree()
        return response
	} catch (err) {
		return rejectWithValue(err.response?.data?.mensagem || 'Error')
	}
})


export const categoriaSlice = createSlice({
	name: 'categorias',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(buscarTodas.pending, (state) => {
				state.loading = true
			})
			.addCase(buscarTodas.fulfilled, (state, action) => {
				state.loading = false
				state.categorias = action.payload
			})
			.addCase(buscarTodas.rejected, (state, action) => {
				state.message = action.payload
				state.showMessage = true
				state.loading = false
			})
			.addCase(buscarById.pending, (state) => {
				state.loading = true
			})
			.addCase(buscarById.fulfilled, (state, action) => {
				state.loading = false
				state.categoria = action.payload
			})
			.addCase(buscarById.rejected, (state, action) => {
				state.message = action.payload
				state.showMessage = true
				state.loading = false
			})
			.addCase(cadastrar.pending, (state) => {
				state.loading = true
			})
			.addCase(cadastrar.fulfilled, (state) => {
				state.loading = false
				state.message = 'Cadastro realizado com sucesso!'
				state.showMessage = true
			})
			.addCase(cadastrar.rejected, (state, action) => {
				state.message = action.payload
				state.showMessage = true
				state.loading = false
			})
			.addCase(editar.pending, (state) => {
				state.loading = true
			})
			.addCase(editar.fulfilled, (state) => {
				state.loading = false
				state.message = 'Cadastro editado com sucesso!'
				state.showMessage = true
			})
			.addCase(editar.rejected, (state, action) => {
				state.message = action.payload
				state.showMessage = true
				state.loading = false
			})
			.addCase(excluir.pending, (state) => {
				state.loading = true
			})
			.addCase(excluir.fulfilled, (state, action) => {
				state.loading = false
				state.message = 'Cadastro excluido com sucesso!'
				state.showMessage = true
			})
			.addCase(excluir.rejected, (state, action) => {
				state.message = action.payload
				state.showMessage = true
				state.loading = false
			})
			.addCase(buscarTree.pending, (state) => {
				state.loading = true
			})
			.addCase(buscarTree.fulfilled, (state, action) => {
				state.loading = false
				state.categoriaTree = action.payload
			})
			.addCase(buscarTree.rejected, (state, action) => {
				state.message = action.payload
				state.showMessage = true
				state.loading = false
			})
	},
})

export default categoriaSlice.reducer