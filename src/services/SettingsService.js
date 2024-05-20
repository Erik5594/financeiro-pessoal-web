import fetch from "auth/FetchInterceptor";

const URL_SETTINGS = "/v1/settings";

const SettingsService = {};

SettingsService.buscar = function () {
  const url = URL_SETTINGS;
  return fetch({
    url,
    method: "get",
  });
};

export default SettingsService;
