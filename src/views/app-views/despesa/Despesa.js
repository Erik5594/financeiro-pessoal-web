import React, { useEffect, useState } from "react";
import TableDespesa from "./componentes/TableDespesa";
import {
  PlusOutlined,
  SearchOutlined,
  UploadOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { connect } from "react-redux";
import {
  listar,
  cadastrar,
  excluir,
  excluirVarios,
  buscarById,
  pagar,
  pagarVarias,
} from "store/slices/despesaSlice";
import { Button, Divider, Popconfirm, Tooltip, notification } from "antd";
import PageHeaderAlt from "components/layout-components/PageHeaderAlt";
import Flex from "components/shared-components/Flex";
import DespesaCadastroModal from "./DespesaCadastroModal";
import ModalFiltroDespesa from "./componentes/ModalFiltroDespesa";
import dayjs from "dayjs";

export const Despesa = (props) => {
  const {
    listar,
    cadastrar,
    excluir,
    excluirVarios,
    despesas,
    buscarById,
    pagar,
    loading,
    content,
    pagarVarias,
  } = props;

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
  const [despesasSelecionadas, setDespesasSelecionadas] = useState([]);

  const fetchDespesas = (
    pageable = { ...paginacao },
    filtro = { ...filtroState }
  ) => {
    listar({ pageable, filtro });
  };

  useEffect(() => {
    fetchDespesas(paginacao);
  }, []);

  useEffect(() => {
    atualizarSelecionadas();
  }, [despesas]);

  const onNova = (data) => {
    setIsModalCadastroOpen(true);
  };

  const onClickButtonFiltro = () => {
    setIsModalFiltroOpen(true);
  };

  const handlerFiltro = (values) => {
    const filtroAux = { ...values };
    setFiltroState(filtroAux);
    setCountFiltroUtilizado(countFiltros(filtroAux));
    fetchDespesas(paginacao, filtroAux);
  };

  const onPagar = async (id) => {
    await pagar({
      id,
    })
      .then((originalPromiseResult) => {
        if (originalPromiseResult.payload !== "Error") {
          notification.success({
            message: "Despesa paga com sucesso!",
          });
          fetchDespesas(paginacao);
          setIsModalCadastroOpen(false);
        }
      })
      .catch((rejectedValueOrSerializedError) =>
        notification.error({
          message: "Ocorreu um erro ao tentar pagar despesa!",
        })
      );
  };

  const onChangeDespesasSelecionadas = (despesasSelecionadas) => {
    setDespesasSelecionadas([...despesasSelecionadas]);
  };

  const countFiltros = (filtro) => {
    let contador = 0;
    if (filtro.competencia) {
      contador++;
    }

    if (filtro.vencimento) {
      contador++;
    }

    if (filtro.tipoSituacao) {
      contador++;
    }

    if (filtro.descricao) {
      contador++;
    }

    if (filtro.idMetodoPagamento) {
      contador++;
    }
    return contador;
  };

  const onEditar = (id) => {
    setIsEdicao(true);
    buscarById({ id })
      .then((originalPromiseResult) => {
        if (originalPromiseResult.payload !== "Error") {
          const retorno = originalPromiseResult.payload;
          let retornoAux = { ...retorno };
          setDespesa(retornoAux);
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

  const onPagarSelecionadas = async () => {
    const idSelecionadas = [
      ...despesasSelecionadas.map((despesa) => despesa.id),
    ];
    await pagarVarias(idSelecionadas)
      .then((originalPromiseResult) => {
        if (originalPromiseResult.payload !== "Error") {
          notification.success({
            message: "Despesas pagas com sucesso!",
          });
          fetchDespesas(paginacao);
          setIsModalCadastroOpen(false);
          const despesasSelecionadasAux = despesas.filter((despesa) =>
            despesasSelecionadas.anyMatch((id) => id === despesa.id)
          );
        }
      })
      .catch((rejectedValueOrSerializedError) =>
        notification.error({
          message: "Ocorreu um erro ao tentar pagar as despesas!",
        })
      );
  };

  function atualizarSelecionadas() {
    let despesasSelecionadasAux = [];
    if (!!despesas) {
      despesasSelecionadasAux = despesas.filter((despesa) => {
        return !!despesasSelecionadas.find(
          (despesaSelect) => despesaSelect.id === despesa.id
        );
      });
    }
    setDespesasSelecionadas([...despesasSelecionadasAux]);
  }

  const onExcluirSelecionadas = async () => {
    const idSelecionadas = [
      ...despesasSelecionadas.map((despesa) => despesa.id),
    ];
    await excluirVarios(idSelecionadas)
      .then((originalPromiseResult) => {
        if (originalPromiseResult.payload !== "Error") {
          notification.success({
            message: "Despesas excluidas com sucesso!",
          });
          fetchDespesas(paginacao);
          setIsModalCadastroOpen(false);
        }
      })
      .catch((rejectedValueOrSerializedError) =>
        notification.error({
          message: "Ocorreu um erro ao tentar excluir as despesas!",
        })
      );
  };

  const TituloFiltro = () => {
    return (
      <span>
        Filtros: {filtroState.competencia ? `Competência; ` : ""}
        {filtroState.vencimento ? `Vencimento; ` : ""}
        {filtroState.tipoSituacao ? `Situação; ` : ""}
        {filtroState.descricao ? `Descrição; ` : ""}
        {filtroState.idMetodoPagamento ? `Metodo pagamento; ` : ""}
      </span>
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
            <div style={{ display: "block", width: "100%" }}>
              <div style={{ display: "flex" }}>
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
                <TituloFiltro />
              </div>
              <div
                style={{
                  display: "flex",
                  width: "100%",
                  justifyContent: "end",
                  marginTop: '10px'
                }}
              >
                <Tooltip title="Cadastrar nova despesa">
                  <Button
                    type="primary"
                    shape="circle"
                    className="ml-2"
                    size="small"
                    onClick={() => onNova()}
                    icon={<PlusOutlined />}
                  ></Button>
                </Tooltip>
                <Divider type="vertical" />
                <Tooltip
                  title="Marcar todas despesas selecionadas como 'Pagas'."
                  placement="topLeft"
                >
                  <Popconfirm
                    placement="bottom"
                    title={
                      <span>
                        <strong>
                          MARCAR {`(${despesasSelecionadas.length})`} DESPESAS
                          COMO PAGA:
                        </strong>
                        <br />
                        <br />
                        Todas as despesas selecionadas serão marcadas como
                        'Pagas'.
                        <br />
                        <br /> Deseja continuar?
                      </span>
                    }
                    okText="Sim"
                    cancelText="Não"
                    onConfirm={(event) => {
                      event.stopPropagation();
                      onPagarSelecionadas();
                    }}
                    onCancel={(event) => {
                      event.stopPropagation();
                    }}
                  >
                    <Button
                      title="Pagar"
                      size="small"
                      shape="circle"
                      disabled={despesasSelecionadas.length < 1}
                      onClick={(event) => {
                        event.stopPropagation();
                      }}
                      icon={<UploadOutlined />}
                    />
                  </Popconfirm>
                </Tooltip>
                <Divider type="vertical" />
                <Tooltip
                  title="Excluir todas despesas selecionadas."
                  placement="topLeft"
                >
                  <Popconfirm
                    placement="bottom"
                    title={
                      <span>
                        <strong>
                          EXCLUIR {`(${despesasSelecionadas.length})`} DESPESAS
                          SELECIONADAS:
                        </strong>
                        <br />
                        <br />
                        Todas despesas selecionadas serão excluídas, EXCETO as
                        despesas com parcelamento.
                        <br />
                        <br /> Deseja continuar?
                      </span>
                    }
                    okText="Sim"
                    cancelText="Não"
                    onConfirm={(event) => {
                      event.stopPropagation();
                      onExcluirSelecionadas();
                    }}
                    onCancel={(event) => {
                      event.stopPropagation();
                    }}
                  >
                    <Button
                      disabled={despesasSelecionadas.length < 1}
                      shape="circle"
                      type="primary"
                      danger
                      title="Excluir"
                      size="small"
                      onClick={(event) => {
                        event.stopPropagation();
                      }}
                      icon={<DeleteOutlined />}
                    />
                  </Popconfirm>
                </Tooltip>
              </div>
            </div>
          </Flex>
        </div>
      </PageHeaderAlt>
      <TableDespesa
        despesas={despesas}
        onEditar={onEditar}
        onExcluir={onExcluir}
        onPagar={onPagar}
        onChangeDespesasSelecionadas={onChangeDespesasSelecionadas}
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
  excluirVarios,
  buscarById,
  pagar,
  pagarVarias,
};

export default connect(mapStateToProps, mapDispatchToProps)(Despesa);
