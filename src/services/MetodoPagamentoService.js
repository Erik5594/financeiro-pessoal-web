import fetch from 'auth/FetchInterceptor'

const MetodoPagamentoService = {}

MetodoPagamentoService.listar = function (data) {
	const url = '/v1/metodo-pagamento?size='+data.size+'&page='+data.page;
	return fetch({
		url,
		method: 'get'
	})
}

export default MetodoPagamentoService;