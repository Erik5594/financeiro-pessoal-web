import fetch from "auth/FetchInterceptor";

const URL_DESPESA = "/v1/despesa";

const DespesaService = {};

DespesaService.listar = function (data) {
  let url =
    URL_DESPESA +
    "?size=" +
    data.pageable.size +
    "&page=" +
    data.pageable.page +
    "&sort=" +
    data.pageable.sort;

  if (data.filtro.descricao) {
    url = url + "&descricao=" + data.filtro.descricao;
  }

  if (data.filtro.tipoSituacao) {
    url = url + "&tipoSituacao=" + data.filtro.tipoSituacao;
  }

  if (data.filtro.competencia) {
    url = url + "&competencia=" + data.filtro.competencia.format("DD/MM/YYYY");
  }

  if (data.filtro.vencimento) {
    url = url + "&vencimento=" + data.filtro.vencimento.format("DD/MM/YYYY");
  }

  if (data.filtro.idMetodoPagamento) {
    url = url + "&idMetodoPagamento=" + data.filtro.idMetodoPagamento;
  }

  return fetch({
    url,
    method: "get",
  });
};

DespesaService.cadastrar = function (data) {
  const url = URL_DESPESA;
  return fetch({
    url,
    method: "post",
    data,
  });
};

DespesaService.atualizar = function (data) {
  const url = URL_DESPESA + "/" + data.id;
  return fetch({
    url,
    method: "put",
    data,
  });
};

DespesaService.excluir = function (data) {
  const url = URL_DESPESA + "/" + data.id;
  return fetch({
    url,
    method: "delete",
  });
};

DespesaService.excluirVarios = function (data) {
  const url = URL_DESPESA;
  return fetch({
    url,
    method: "delete",
    data,
  });
};

DespesaService.buscarById = function (data) {
  const url = URL_DESPESA + "/" + data.id;
  return fetch({
    url,
    method: "get",
  });
};

DespesaService.pagar = function (data) {
  const url = URL_DESPESA + "/" + data.id + "/pagar";
  return fetch({
    url,
    method: "put",
  });
};

DespesaService.pagarVarias = function (data) {
  const url = URL_DESPESA + "/pagar";
  return fetch({
    url,
    method: "put",
    data,
  });
};

export default DespesaService;
