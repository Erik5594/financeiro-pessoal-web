import React, { Fragment } from "react";
import { buscar } from "store/slices/mensalidadeSlice";
import { connect } from "react-redux";

export const Mensalidade = (props) => {

  return (
    <Fragment>
        <strong>FUNCIONALIDADES:</strong>
      <ul>
        <li>1.4.5 - [FUNCIONALIDADE] - Ver historico de cobrança. [IMPLEMENTAR - Erik]</li>
		<li>1.4.7 - [FUNCIONALIDADE] - Ver faturas para pagar com boleto, Pix ou cartão. [IMPLEMENTAR - Erik]</li>
      </ul>
    </Fragment>
  );
};

const mapStateToProps = ({ mensalidadeReducer }) => {
  const { loading, message, showMessage, mensalidade } = mensalidadeReducer;
  return {
    loading,
    message,
    showMessage,
    mensalidade,
  };
};

const mapDispatchToProps = {
  buscar,
};

export default connect(mapStateToProps, mapDispatchToProps)(Mensalidade);
