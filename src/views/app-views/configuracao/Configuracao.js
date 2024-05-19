import { Menu } from "antd";
import React, { Component, Fragment } from "react";
import { Link, Navigate, Route, Routes, useLocation } from "react-router-dom";
import {
  UserOutlined,
  LockOutlined
} from "@ant-design/icons";
import Perfil from "./perfil/Perfil";
import AlterarSenha from "./senha/AlterarSenha";
import InnerAppLayout from "layouts/inner-app-layout";

const url = '/app/config'

const MenuItem = ({icon, path, label}) => {
  return (
		<>
			{icon}
			<span>{label}</span>
			<Link to={`${url}/${path}`} />
		</>
	)
}

const OpcaoConfiguracao = () => {

	const location = useLocation();

	const locationPath = location.pathname.split('/')

	const currentpath = locationPath[locationPath.length - 1]

	return (
		<Menu
			mode="inline"
			selectedKeys={[currentpath]}
			items={[
				{
					key: 'editar-perfil',
					label: <MenuItem label="Editar perfil" icon={<UserOutlined />} path="editar-perfil" />
				},
				{
					key: 'alterar-senha',
					label: <MenuItem label="Alterar Senha" icon={<LockOutlined />} path="alterar-senha" />
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
			<Route path="*" element={<Navigate to="editar-perfil" replace />} />
		</Routes>
	)
}

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
