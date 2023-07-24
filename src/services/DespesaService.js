import fetch from 'auth/FetchInterceptor'

const URL_DESPESA = '/v1/despesa'

const DespesaService = {}

DespesaService.listar = function (data) {
	const url = URL_DESPESA + '?size='+data.size+'&page='+data.page;
	return fetch({
		url,
		method: 'get'
	})
}

DespesaService.cadastrar = function (data) {
	const url = URL_DESPESA;
	return fetch({
		url,
		method: 'post',
		data
	})
}

DespesaService.atualizar = function (data) {
	const url = URL_DESPESA+'/'+data.id;
	return fetch({
		url,
		method: 'put',
		data
	})
}

DespesaService.excluir = function (data) {
	const url = URL_DESPESA + '/'+data.id;
	return fetch({
		url,
		method: 'delete'
	})
}

DespesaService.buscarById = function (data) {
	const url = URL_DESPESA+'/'+data.id;
	return fetch({
		url,
		method: 'get'
	})
}

export default DespesaService;