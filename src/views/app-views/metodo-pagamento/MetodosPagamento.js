import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { cadastrar, listar, excluir } from "store/slices/metodoPagamentoSlice";
import { Button, Tooltip, notification } from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  UploadOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import MetodoPagamentoModal from "./modal/MetodoPagamentoModal";
import MetodoPagamentoList from "./component/MetodoPagamentoList";
import PageHeaderAlt from "components/layout-components/PageHeaderAlt";
import Flex from "components/shared-components/Flex";
import IntlMessage from "components/util-components/IntlMessage";
import { Grid } from "antd";
import Utils from "utils";

const { useBreakpoint } = Grid;

export const MetodosPagamento = (props) => {
  const { cadastrar, listar, excluir, loading, metodosPagamentos, hasMore } =
    props;

  const [paginacao, setPaginacao] = useState({ pageSize: 10, current: 0 });
  const [isEdicao, setIsEdicao] = useState(false);
  const [metodoPagamento, setMetodoPagamento] = useState({});
  const [openModalCadastro, setOpenModalCadastro] = useState(false);

  const inclemento = 5;

  const isMobile = !Utils.getBreakPoint(useBreakpoint()).includes("lg");

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
    setIsEdicao(true);
    showModal();
  };

  const onNovoCadastro = () => {
    setMetodoPagamento({});
    setIsEdicao(false);
    showModal();
  };

  const showModal = () => {
    setOpenModalCadastro(true);
  };

  const onCloseModal = () => {
    setOpenModalCadastro(false);
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
                <h2>
                  <IntlMessage id="sidenav.config.metodos-pagamento" />
                </h2>
              </div>
              <div
                style={{
                  display: "flex",
                  width: "100%",
                  justifyContent: "end",
                  marginTop: "10px",
                }}
              >
                <Tooltip title={<IntlMessage id="new-register" />}>
                  <Button
                    type="primary"
                    shape="circle"
                    className="ml-2"
                    size="small"
                    onClick={onNovoCadastro}
                    icon={<PlusOutlined />}
                  />
                </Tooltip>
              </div>
            </div>
          </Flex>
        </div>
      </PageHeaderAlt>
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
            setIsEdicao(false);
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
