import axios from 'axios';
import { API_BASE_URL } from 'configs/AppConfig';
import { signOutSuccess } from 'store/slices/authSlice';
import store from '../store';
import { AUTH_TOKEN } from 'constants/AuthConstant';
import { notification } from 'antd';

const unauthorizedCode = [401, 403]

const service = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000
})

// Config
const TOKEN_PAYLOAD_KEY = 'authorization'

// API Request interceptor
service.interceptors.request.use(config => {
	const jwtToken = localStorage.getItem(AUTH_TOKEN) || null;
	
	if (jwtToken) {
		config.headers[TOKEN_PAYLOAD_KEY] = 'Bearer ' + jwtToken
	}

  	return config
}, error => {
	// Do something with request error here
	notification.error({
		message: 'Error'
	})
	Promise.reject(error)
})

// API respone interceptor
service.interceptors.response.use( (response) => {
	return response.data
}, (error) => {

	let notificationParam = {
		message: ''
	}

	// Remove token and redirect 
	if (unauthorizedCode.includes(error.response.status)) {
		notificationParam.message = 'Falha na autenticação'
		notificationParam.description = 'Tente novamente'
		localStorage.removeItem(AUTH_TOKEN)

		store.dispatch(signOutSuccess())
	}

	if (error.response.status === 400) {
		notificationParam.message = error.response.data.mensagem
	}

	if (error.response.status === 404) {
		notificationParam.message = 'Não encontrado'
	}

	if (error.response.status === 500) {
		notificationParam.message = 'Ocorreu um erro interno'
	}
	
	if (error.response.status === 508) {
		notificationParam.message = 'Time Out'
	}

	notification.error(notificationParam)

	return Promise.reject(error);
});

export default service