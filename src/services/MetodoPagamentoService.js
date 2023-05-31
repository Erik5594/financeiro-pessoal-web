import fetch from 'auth/FetchInterceptor'

const URL_METODO_PAGAMENTO = '/v1/metodo-pagamento'

const MetodoPagamentoService = {}

MetodoPagamentoService.listar = function (data) {
	const url = URL_METODO_PAGAMENTO + '?size='+data.size+'&page='+data.page;
	return fetch({
		url,
		method: 'get'
	})
}

MetodoPagamentoService.cadastrar = function (data) {
	const url = URL_METODO_PAGAMENTO;
	return fetch({
		url,
		method: 'post',
		data: data
	})
}

MetodoPagamentoService.excluir = function (data) {
	const url = URL_METODO_PAGAMENTO+'/'+data.id;
	return fetch({
		url,
		method: 'delete'
	})
}

export default MetodoPagamentoService;