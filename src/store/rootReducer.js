import { combineReducers } from 'redux'
import theme from './slices/themeSlice'
import auth from './slices/authSlice'
import metodosPagamentoReducer from './slices/metodoPagamentoSlice'

const rootReducer = (asyncReducers) => (state, action) => {
    const combinedReducer = combineReducers({
        theme,
        auth,
        metodosPagamentoReducer,
        ...asyncReducers,
    })
    return combinedReducer(state, action)
}
  
export default rootReducer
