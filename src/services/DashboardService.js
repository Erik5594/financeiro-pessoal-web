import fetch from 'auth/FetchInterceptor'

const URL_DASHBOARD = '/v1/dashboard'

const DashboardService = {}

DashboardService.totalizadorDespesa = function (competencia) {
	let url = URL_DASHBOARD;
	if(competencia){
		url = url + '?competencia='+competencia;
	}
	return fetch({
		url,
		method: 'get'
	})
}


export default DashboardService;