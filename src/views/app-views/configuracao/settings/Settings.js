import React, { Fragment } from "react";
import { buscar, atualizar } from "store/slices/settingsSlice";
import { connect } from "react-redux";

export const Settings = (props) => {

  return (
    <Fragment>
        <strong>FUNCIONALIDADES:</strong>
      <ul>
        <li>1.4.8 - [FUNCIONALIDADE] - Editar preferências de cores. [IMPLEMENTAR - Laiz]</li>
		<li>1.4.9 - [FUNCIONALIDADE] - Editar configurações de notificações, valores padrões. [IMPLEMENTAR - Laiz]</li>
		<li>1.4.10 - [FUNCIONALIDADE] - Excluir/Inativar conta. [IMPLEMENTAR - Laiz]</li>
      </ul>
    </Fragment>
  );
};

const mapStateToProps = ({ settingsReducer }) => {
  const { loading, message, showMessage, setting } = settingsReducer;
  return {
    loading,
    message,
    showMessage,
    setting,
  };
};

const mapDispatchToProps = {
  buscar,
};

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
