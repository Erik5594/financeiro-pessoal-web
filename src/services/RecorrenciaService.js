import fetch from "auth/FetchInterceptor";

const URL_RECORRENTE = "/v1/recorrente";

const RecorrenciaService = {};

RecorrenciaService.buscarPrevia = function (filtro) {
  const url =
    URL_RECORRENTE +
    "/previas?uuidFormaPagamento=" +
    filtro.uuidFormaPagamento +
    "&frequencia=" +
    filtro.frequencia +
    "&dataLimite=" +
    filtro.dataLimite +
    "&primeiroLancamento=" +
    filtro.primeiroLancamento +
    "&primeiroVencimento=" +
    filtro.primeiroVencimento;
  return fetch({
    url,
    method: "get",
  });
};

export default RecorrenciaService;
