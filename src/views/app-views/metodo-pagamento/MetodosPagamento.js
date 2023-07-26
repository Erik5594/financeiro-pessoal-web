import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { cadastrar, listar, excluir } from "store/slices/metodoPagamentoSlice";
import { notification } from "antd";
import MetodoPagamentoModal from "./modal/MetodoPagamentoModal";
import MetodoPagamentoList from "./component/MetodoPagamentoList";

export const MetodosPagamento = (props) => {
  const {
    cadastrar,
    listar,
    excluir,
    loading,
    metodosPagamentos,
    hasMore,
    openModalCadastro,
    showModalCadastro,
    onCloseModal,
  } = props;

  const [paginacao, setPaginacao] = useState({ pageSize: 5, current: 0 });
  const [isEdicao, setIsEdicao] = useState(false);
  const [metodoPagamento, setMetodoPagamento] = useState({});

  const inclemento = 5;

  const fetchMetodosPagamentos = () => {
    listar({ size: paginacao.pageSize, page: paginacao.current });
  };

  const excluirMetodoPagamento = (metodoPagamento) => {
    excluir({ id: metodoPagamento.id })
      .then((originalPromiseResult) => {
        notification.success({
          message: "Método de pagamento excluído com sucesso!",
        });
        fetchMetodosPagamentos();
      })
      .catch((rejectedValueOrSerializedError) =>
        notification.error({ message: "Ocorreu um erro ao tentar excluir!" })
      );
  };

  useEffect(() => {
    fetchMetodosPagamentos();
  }, []);

  const handleInfiniteOnLoad = () => {
    setPaginacao({ ...paginacao, pageSize: paginacao.pageSize + inclemento });
    fetchMetodosPagamentos();
  };

  const onEditar = (metodoPagamento) => {
    setMetodoPagamento(metodoPagamento);
    showModalCadastro();
  };

  return (
    <div>
      <div>
        <MetodoPagamentoList
          metodosPagamentos={metodosPagamentos}
          loading={loading}
          hasMore={hasMore}
          handleInfiniteOnLoad={handleInfiniteOnLoad}
          excluirMetodoPagamento={excluirMetodoPagamento}
          onEditar={onEditar}
        />
      </div>
      <div>
        <MetodoPagamentoModal
          open={openModalCadastro}
          handleCancel={() => {
            setMetodoPagamento({});
            onCloseModal();
          }}
          isEdicao={isEdicao}
          cadastrar={cadastrar}
          fetch={fetchMetodosPagamentos}
          metodoPagamento={metodoPagamento}
        />
      </div>
    </div>
  );
};

const mapStateToProps = ({ metodosPagamentoReducer }) => {
  const {
    loading,
    hasMore,
    message,
    showMessage,
    metodosPagamentos,
    registro,
  } = metodosPagamentoReducer;
  return {
    loading,
    hasMore,
    message,
    showMessage,
    metodosPagamentos,
    registro,
  };
};

const mapDispatchToProps = {
  cadastrar,
  listar,
  excluir,
};

export default connect(mapStateToProps, mapDispatchToProps)(MetodosPagamento);
