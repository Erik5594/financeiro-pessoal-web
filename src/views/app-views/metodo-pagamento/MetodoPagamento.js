import { Avatar, Button, List, Spin, Table, Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import { DeleteOutlined } from "@ant-design/icons";
import { connect } from "react-redux";
import { cadastrar, listar, excluir } from "store/slices/metodoPagamentoSlice";
import InfiniteScroll from "react-infinite-scroller";
import { notification } from "antd";
import { Form } from "antd";
import { Input } from "antd";
import MetodoPagamentoModal from "./MetodoPagamentoModal";

const infiniteScroll = {
  border: "1px solid #e8e8e8",
  borderRadius: "4px",
  overflow: "auto",
  padding: "8px 24px",
  height: "300px",
};

export const MetodosPagamento = (props) => {
  const {
    cadastrar,
    listar,
    excluir,
    loading,
    showMessage,
    message,
    metodosPagamentos,
    hasMore,
    registro,
    isModalOpen,
    handleCancel,
  } = props;

  const [form] = Form.useForm();
  const [paginacao, setPaginacao] = useState({ pageSize: 5, current: 0 });
  //const [isModalOpen, setIsModalOpen] = useState(false);

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

  const onFinish = (values) => {
    cadastrar(values)
      .then((originalPromiseResult) => {
        form.resetFields();
        notification.success({
          message: "Método de pagamento cadastrado com sucesso!",
        });
        fetchMetodosPagamentos();
      })
      .catch((rejectedValueOrSerializedError) =>
        notification.error({ message: "Ocorreu um erro ao tentar cadastrar!" })
      );
  };

  const actions = (metodoPagamento) => {
    return [
      <Button
        type="primary"
        danger
        title="Excluir"
        size="small"
        onClick={() => excluirMetodoPagamento(metodoPagamento)}
        icon={<DeleteOutlined />}
      />,
    ];
  };

  return (
    <div>
      <div>
        <MetodoPagamentoModal
          onFinish={onFinish}
          open={isModalOpen}
          handleCancel={handleCancel}
          form={form}
        />
      </div>
      <div style={infiniteScroll}>
        <InfiniteScroll
          initialLoad={false}
          pageStart={0}
          loadMore={() => handleInfiniteOnLoad()}
          hasMore={!loading && hasMore}
          useWindow={false}
        >
          <List
            dataSource={metodosPagamentos}
            renderItem={(metodoPagamento) => (
              <List.Item
                key={metodoPagamento.id}
                actions={actions(metodoPagamento)}
              >
                <List.Item.Meta
                  avatar={
                    <Avatar src="https://as2.ftcdn.net/v2/jpg/00/72/77/79/1000_F_72777900_PuZflEq56bzqNr7SqGq2X59MsfC9aDPp.jpg" />
                  }
                  title={metodoPagamento.nome}
                  description={metodoPagamento.descricao || ""}
                />
              </List.Item>
            )}
          >
            {loading && hasMore && (
              <div
                className="demo-loading-container"
                style={{ textAlign: "center" }}
              >
                <Spin />
              </div>
            )}
          </List>
        </InfiniteScroll>
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
