import fetch from "auth/FetchInterceptor";

const URL_METODO_PAGAMENTO = "/v1/metodo-pagamento";

const MetodoPagamentoService = {};

MetodoPagamentoService.listar = function (data) {
  const url =
    URL_METODO_PAGAMENTO +
    "?size=" +
    data.size +
    "&page=" +
    data.page +
    "&nome=" +
    (data.nome || "");
  return fetch({
    url,
    method: "get",
  });
};

MetodoPagamentoService.cadastrar = function (data) {
  const url = URL_METODO_PAGAMENTO;
  return fetch({
    url,
    method: "post",
    data: data,
  });
};

MetodoPagamentoService.atualizar = function (data) {
  const url = URL_METODO_PAGAMENTO + "/" + data.id;
  return fetch({
    url,
    method: "put",
    data,
  });
};

MetodoPagamentoService.excluir = function (data) {
  const url = URL_METODO_PAGAMENTO + "/" + data.id;
  return fetch({
    url,
    method: "delete",
  });
};

MetodoPagamentoService.buscarDatas = function ({ id, dataBase }) {
  const url =
    URL_METODO_PAGAMENTO +
    "/" +
    id +
    "/dataVencimentoECompetencia?dataBase=" +
    dataBase;
  return fetch({
    url,
    method: "get",
  });
};

MetodoPagamentoService.buscarDatasSemMetodoPagamento = function ({
  dataBase,
  tipoLancamentoCompetencia,
  diaVencimento,
  diasFechamento,
}) {
  const url =
    URL_METODO_PAGAMENTO +
    "/dataVencimentoECompetencia?dataBase=" +
    dataBase +
    "&tipoLancamentoCompetencia=" +
    tipoLancamentoCompetencia +
    "&diaVencimento=" +
    diaVencimento +
    "&diasFechamento=" +
    diasFechamento;
  return fetch({
    url,
    method: "get",
  });
};

export default MetodoPagamentoService;
