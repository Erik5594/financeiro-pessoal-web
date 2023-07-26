import React, { useEffect, useState } from "react";
import TableDespesa from "./componentes/TableDespesa";
import { PlusOutlined } from "@ant-design/icons";
import { connect } from "react-redux";
import {
  listar,
  cadastrar,
  excluir,
  buscarById,
} from "store/slices/despesaSlice";
import { Button, Form, Tooltip, notification } from "antd";
import PageHeaderAlt from "components/layout-components/PageHeaderAlt";
import Flex from "components/shared-components/Flex";
import DespesaCadastroModal from "./DespesaCadastroModal";

const titulo = {
  marginBottom: "20px",
  fontSize: "x-large",
};

export const Despesa = (props) => {
  const { listar, cadastrar, excluir, despesas, buscarById, loading, content } =
    props;

  const [paginacao, setPaginacao] = useState({ pageSize: 10, current: 0 });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdicao, setIsEdicao] = useState(false);
  const [despesa, setDespesa] = useState({});

  const fetchDespesas = (
    pageable = { size: paginacao.pageSize, page: paginacao.current }
  ) => {
    listar(pageable);
  };

  useEffect(() => {
    fetchDespesas({ size: paginacao.pageSize, page: paginacao.current });
  }, []);

  const onNova = (data) => {
    setIsModalOpen(true);
  };

  const onEditar = (id) => {
    setIsEdicao(true);
    buscarById({ id })
      .then((originalPromiseResult) => {
        if (originalPromiseResult.payload !== "Error") {
          const retorno = originalPromiseResult.payload;
          setDespesa(retorno);
          setIsModalOpen(true);
        }
      })
      .catch((rejectedValueOrSerializedError) =>
        notification.error({ message: "Ocorreu um erro ao tentar cadastrar!" })
      );
    setDespesa();
  };

  const onChangePage = (page) => {
    setPaginacao({ ...paginacao, current: page - 1 });
    const pageAux = { size: paginacao.pageSize, page: page - 1 };
    fetchDespesas(pageAux);
  };

  const onExcluir = async (id) => {
    await excluir({
      id,
    })
      .then((originalPromiseResult) => {
        if (originalPromiseResult.payload !== "Error") {
          notification.success({
            message: "Despesa excluida com sucesso!",
          });
          fetchDespesas();
          setIsModalOpen(false);
        }
      })
      .catch((rejectedValueOrSerializedError) =>
        notification.error({
          message: "Ocorreu um erro ao tentar excluir despesa!",
        })
      );
  };

  return (
    <div>
      <PageHeaderAlt className="border-bottom">
        <div className="container-fluid">
          <Flex
            justifyContent="space-between"
            alignItems="center"
            className="py-4"
          >
            <h2>Despesas</h2>
            <Tooltip title="Cadastrar nova despesa">
              <Button
                type="primary"
                className="ml-2"
                size="small"
                onClick={() => onNova()}
              >
                <PlusOutlined />
                <span>Nova</span>
              </Button>
            </Tooltip>
          </Flex>
        </div>
      </PageHeaderAlt>
      <TableDespesa
        despesas={despesas}
        onEditar={onEditar}
        onExcluir={onExcluir}
        loading={loading}
        content={content}
        onChangePage={onChangePage}
      />
      <DespesaCadastroModal
        cadastrar={cadastrar}
        open={isModalOpen}
        isEdicao={isEdicao}
        handleCancel={() => {
          setDespesa({});
          setIsModalOpen(false);
        }}
        fetchDespesas={fetchDespesas}
        despesa={despesa}
      />
    </div>
  );
};

const mapStateToProps = ({ despesaReducer }) => {
  const { loading, message, showMessage, despesas, content } = despesaReducer;
  return {
    loading,
    message,
    showMessage,
    despesas,
    content,
  };
};

const mapDispatchToProps = {
  listar,
  cadastrar,
  excluir,
  buscarById,
};

export default connect(mapStateToProps, mapDispatchToProps)(Despesa);
