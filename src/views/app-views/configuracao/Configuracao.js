import { Menu } from "antd";
import React, { Component } from "react";
import { Link, Navigate, Route, Routes, useLocation } from "react-router-dom";
import {
  UserOutlined,
  SettingOutlined,
  HistoryOutlined,
  LockOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import Perfil from "./perfil/Perfil";
import Plano from "./plano/Plano";
import AlterarSenha from "./senha/AlterarSenha";
import InnerAppLayout from "layouts/inner-app-layout";
import IntlMessage from "components/util-components/IntlMessage";
import Settings from "./settings/Settings";
import Mensalidade from "./mensalidades/Mensalidade";

const url = "/app/config";

const MenuItem = ({ icon, path, label }) => {
  return (
    <>
      {icon}
      <span>{label}</span>
      <Link to={`${url}/${path}`} />
    </>
  );
};

const OpcaoConfiguracao = () => {
  const location = useLocation();

  const locationPath = location.pathname.split("/");

  const currentpath = locationPath[locationPath.length - 1];

  return (
    <Menu
      mode="inline"
      selectedKeys={[currentpath]}
      items={[
        {
          key: "editar-perfil",
          label: (
            <MenuItem
              label={<IntlMessage id="sidenav.config.perfil.edit" />}
              icon={<UserOutlined />}
              path="editar-perfil"
            />
          ),
        },
        {
          key: "planos",
          label: (
            <MenuItem
              label={<IntlMessage id="sidenav.config.plano" />}
              icon={<ShoppingCartOutlined />}
              path="planos"
            />
          ),
        },
		{
			key: "mensalidade",
			label: (
			  <MenuItem
				label={<IntlMessage id="sidenav.config.mensalidade" />}
				icon={<HistoryOutlined />}
				path="mensalidade"
			  />
			),
		  },
		{
			key: "settings",
			label: (
			  <MenuItem
				label={<IntlMessage id="sidenav.config.settings" />}
				icon={<SettingOutlined />}
				path="settings"
			  />
			),
		  },
        {
          key: "alterar-senha",
          label: (
            <MenuItem
              label={<IntlMessage id="sidenav.config.alterar-senha" />}
              icon={<LockOutlined />}
              path="alterar-senha"
            />
          ),
        },
      ]}
    />
  );
};

const ConfiguracaoConteudo = () => {
  return (
    <Routes>
      <Route path="editar-perfil" element={<Perfil />} />
      <Route path="alterar-senha" element={<AlterarSenha />} />
      <Route path="planos" element={<Plano />} />
	  <Route path="settings" element={<Settings />} />
	  <Route path="mensalidade" element={<Mensalidade />} />
      <Route path="*" element={<Navigate to="editar-perfil" replace />} />
    </Routes>
  );
};

export class Configuracao extends Component {
  render() {
    return (
      <InnerAppLayout
        sideContent={<OpcaoConfiguracao />}
        mainContent={<ConfiguracaoConteudo />}
      />
    );
  }
}

export default Configuracao;
