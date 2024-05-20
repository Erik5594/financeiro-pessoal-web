import fetch from "auth/FetchInterceptor";

const URL_PLANO = "/v1/plano";

const PlanoService = {};

PlanoService.buscar = function () {
  const url = URL_PLANO;
  return fetch({
    url,
    method: "get",
  });
};

export default PlanoService;
