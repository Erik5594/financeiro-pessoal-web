import fetch from "auth/FetchInterceptor";

const URL_MENSALIDADE = "/v1/mensalidade";

const MensalidadeService = {};

MensalidadeService.buscar = function () {
  const url = URL_MENSALIDADE;
  return fetch({
    url,
    method: "get",
  });
};

export default MensalidadeService;
