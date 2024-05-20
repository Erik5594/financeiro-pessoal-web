import React, { Fragment } from "react";
import { buscar, atualizar } from "store/slices/planoSlice";
import { connect } from "react-redux";

export const Plano = (props) => {

  return (
    <Fragment>
      <strong>FUNCIONALIDADES</strong>
      <ul>
        <li>1.4.3 - [FUNCIONALIDADE] - Selecionar plano. [IMPLEMENTAR - Erik]</li>
        <li>1.4.6 - [FUNCIONALIDADE] - Cancelar assinatura. [IMPLEMENTAR - Erik]</li>
      </ul>
    </Fragment>
  );
};

const mapStateToProps = ({ planoReducer }) => {
  const { loading, message, showMessage, plano } = planoReducer;
  return {
    loading,
    message,
    showMessage,
    plano,
  };
};

const mapDispatchToProps = {
  buscar,
};

export default connect(mapStateToProps, mapDispatchToProps)(Plano);
