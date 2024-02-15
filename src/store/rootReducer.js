import { combineReducers } from 'redux'
import theme from './slices/themeSlice'
import auth from './slices/authSlice'
import metodosPagamentoReducer from './slices/metodoPagamentoSlice'
import categoriaReducer from './slices/categoriaSlice'
import despesaReducer from './slices/despesaSlice'
import totalizadorDespesaReducer from './slices/dashboardTotalizadorDespesaSlice'

const rootReducer = (asyncReducers) => (state, action) => {
    const combinedReducer = combineReducers({
        theme,
        auth,
        metodosPagamentoReducer,
        categoriaReducer,
        despesaReducer,
        totalizadorDespesaReducer,
        ...asyncReducers,
    })
    return combinedReducer(state, action)
}
  
export default rootReducer
