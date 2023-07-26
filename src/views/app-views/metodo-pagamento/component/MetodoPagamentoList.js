import { Avatar, Button, List, Spin } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import React from "react";
import InfiniteScroll from "react-infinite-scroller";

const infiniteScroll = {
  border: "1px solid #e8e8e8",
  borderRadius: "4px",
  overflow: "auto",
  padding: "8px 24px",
  height: "300px",
};

export const MetodoPagamentoList = (props) => {
  const {
    metodosPagamentos,
    loading,
    hasMore,
    handleInfiniteOnLoad,
    excluirMetodoPagamento,
    onEditar,
  } = props;

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
      <Button
        type="primary"
        title="Editar"
        size="small"
        onClick={() => onEditar(metodoPagamento)}
        icon={<EditOutlined />}
      />,
    ];
  };

  const getDescricao = (metodoPagamentoDesc) => {
    if(metodoPagamentoDesc?.descricao){
      return metodoPagamentoDesc?.descricao;
    }

    if(metodoPagamentoDesc?.diaVencimento > 0 && metodoPagamentoDesc?.diasParaFechamento > 0){
      return `Dia do vencimento ${metodoPagamentoDesc?.diaVencimento}, fecha ${metodoPagamentoDesc?.diasParaFechamento} dias antes do vencimento.`
    }

    if(metodoPagamentoDesc?.diaVencimento > 0){
      return `Dia do vencimento ${metodoPagamentoDesc?.diaVencimento}, sem informações sobre fechamento.`
    }

    return metodoPagamentoDesc?.descricao;
  }

  return (
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
                description={getDescricao(metodoPagamento) || ""}
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
  );
};

export default MetodoPagamentoList;
