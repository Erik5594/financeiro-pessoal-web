import fetch from 'auth/FetchInterceptor'

const URL_CATEGORIA = '/v1/categoria'

const CategoriaService = {}

CategoriaService.buscarTodas = function () {
	const url = URL_CATEGORIA;
	return fetch({
		url,
		method: 'get'
	})
}

CategoriaService.cadastrar = function (data) {
	const url = URL_CATEGORIA;
	return fetch({
		url,
		method: 'post',
		data: data
	})
}

CategoriaService.editar = function (data) {
	const url = URL_CATEGORIA+`/${data.id}`;
	return fetch({
		url,
		method: 'put',
		data: data
	})
}

CategoriaService.excluir = function (data) {
	const url = URL_CATEGORIA+'/'+data.id;
	return fetch({
		url,
		method: 'delete'
	})
}

CategoriaService.buscarById = function (data) {
	const url = URL_CATEGORIA+'/'+data.id;
	return fetch({
		url,
		method: 'get'
	})
}

CategoriaService.buscarTree = function (data) {
	const url = URL_CATEGORIA+'/tree';
	return fetch({
		url,
		method: 'get'
	})
}

export default CategoriaService;