import fetch from "auth/FetchInterceptor";

const URL_PERFIL = "/v1/perfil";

const PerfilService = {};

PerfilService.buscar = function () {
  const url = URL_PERFIL;
  return fetch({
    url,
    method: "get",
  });
};

PerfilService.buscarOuCriar = function () {
  const url = URL_PERFIL + '/aux';
  return fetch({
    url,
    method: "get",
  });
};

PerfilService.atualizar = function (data) {
  const url = URL_PERFIL;
  return fetch({
    url,
    method: "put",
    data: data
  });
};

PerfilService.excluirImagem = function () {
  const url = URL_PERFIL+'/imagem';
  return fetch({
    url,
    method: "delete",
  });
};

export default PerfilService;
