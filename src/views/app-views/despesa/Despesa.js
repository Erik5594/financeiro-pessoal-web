import React, { useEffect, useState } from "react";
import TableDespesa from "./componentes/TableDespesa";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
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
import ModalFiltroDespesa from "./componentes/ModalFiltroDespesa";
import dayjs from "dayjs";

const titulo = {
  marginBottom: "20px",
  fontSize: "x-large",
};

export const Despesa = (props) => {
  const { listar, cadastrar, excluir, despesas, buscarById, loading, content } =
    props;

  const [paginacao, setPaginacao] = useState({
    size: 10,
    page: 0,
    sort: "situacao,dataVencimento,ASC",
  });

  const [filtroState, setFiltroState] = useState({
    descricao: undefined,
    tipoSituacao: undefined,
    competencia: dayjs(dayjs(), "DD/MM/YYYY"),
    vencimento: undefined,
  });

  const [isModalCadastroOpen, setIsModalCadastroOpen] = useState(false);
  const [isModalFiltroOpen, setIsModalFiltroOpen] = useState(false);
  const [isEdicao, setIsEdicao] = useState(false);
  const [despesa, setDespesa] = useState({});
  const [countFiltroUtilizado, setCountFiltroUtilizado] = useState(1);

  const fetchDespesas = (pageable = {...paginacao}, filtro = {...filtroState}) => {
    listar({pageable, filtro});
  };

  useEffect(() => {
    fetchDespesas(paginacao);
  }, []);

  const onNova = (data) => {
    setIsModalCadastroOpen(true);
  };

  const onClickButtonFiltro = () => {
    setIsModalFiltroOpen(true);
  };

  const handlerFiltro = (values) => {
    const filtroAux = {...values}
    setFiltroState(filtroAux);
    setCountFiltroUtilizado(countFiltros(filtroAux));
    fetchDespesas(paginacao, filtroAux);
  }

  const countFiltros = (filtro) => {
    let contador = 0;
    if(filtro.competencia){
      contador++;
    }

    if(filtro.vencimento){
      contador++;
    }

    if(filtro.tipoSituacao){
      contador++;
    }

    if(filtro.valorCategoria){
      contador++;
    }
    return contador;

  }

  const onEditar = (id) => {
    setIsEdicao(true);
    buscarById({ id })
      .then((originalPromiseResult) => {
        if (originalPromiseResult.payload !== "Error") {
          const retorno = originalPromiseResult.payload;
          setDespesa(retorno);
          setIsModalCadastroOpen(true);
        }
      })
      .catch((rejectedValueOrSerializedError) =>
        notification.error({ message: "Ocorreu um erro ao tentar cadastrar!" })
      );
    setDespesa();
  };

  const onChangePage = (page) => {
    const pageAux = {
      ...paginacao,
      page: page - 1,
    };
    
    setPaginacao(pageAux);

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
          fetchDespesas(paginacao);
          setIsModalCadastroOpen(false);
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
            <div style={{ display: "inline-flex" }}>
              <h2>Despesas</h2>
              <Tooltip title="Filtrar">
                <Button
                  type="link"
                  className="ml-2"
                  size="small"
                  onClick={() => onClickButtonFiltro()}
                >
                  <SearchOutlined />
                  <span>{`Filtrar (${countFiltroUtilizado})`}</span>
                </Button>
              </Tooltip>
            </div>
            <div>
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
            </div>
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
        open={isModalCadastroOpen}
        isEdicao={isEdicao}
        handleCancel={() => {
          setDespesa({});
          setIsEdicao(false);
          setIsModalCadastroOpen(false);
        }}
        fetchDespesas={fetchDespesas}
        despesa={despesa}
      />
      <ModalFiltroDespesa
        open={isModalFiltroOpen}
        handleCancel={() => setIsModalFiltroOpen(false)}
        handlerFiltro={handlerFiltro}
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
