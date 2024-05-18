import { Avatar, Button, List, Popconfirm, Spin, Tag, Tooltip } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  CreditCardOutlined,
  CheckOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import '../metodo-pagamento.css'
import React from "react";
import InfiniteScroll from "react-infinite-scroller";

const infiniteScroll = {
  border: "1px solid #e8e8e8",
  borderRadius: "4px",
  overflow: "auto",
  padding: "8px 24px",
  height: "700px",
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
      <Popconfirm
        placement="bottom"
        title="Tem certeza que deseja excluir esse metodo de pagamento?"
        okText="Sim"
        cancelText="Não"
        onConfirm={(event) => {
          event.stopPropagation();
          excluirMetodoPagamento(metodoPagamento);
        }}
        onCancel={(event) => {
          event.stopPropagation();
        }}
      >
        <Button
          onClick={(event) => {
            event.stopPropagation();
          }}
          size="small"
          type="primary"
          danger
          title="Excluir"
          icon={<DeleteOutlined />}
        />
      </Popconfirm>,
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
    if (metodoPagamentoDesc?.descricao) {
      return metodoPagamentoDesc?.descricao;
    }

    if (
      metodoPagamentoDesc?.diaVencimento > 0 &&
      metodoPagamentoDesc?.diasParaFechamento > 0
    ) {
      return `Dia do vencimento ${metodoPagamentoDesc?.diaVencimento}, fecha ${metodoPagamentoDesc?.diasParaFechamento} dias antes do vencimento.`;
    }

    if (metodoPagamentoDesc?.diaVencimento > 0) {
      return `Dia do vencimento ${metodoPagamentoDesc?.diaVencimento}, sem informações sobre fechamento.`;
    }

    return metodoPagamentoDesc?.descricao;
  };

  const titulo = (metodoPagamento) => {
    return (
      <span>
        {metodoPagamento.nome}{" "}
        {metodoPagamento.padrao ? (
          <Tooltip title="Padrão" placement="topLeft">
            <Tag color="green">
              <CheckOutlined />
            </Tag>
          </Tooltip>
        ) : null}
      </span>
    );
  };

  return (
    <div class="infinite-scroll">
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
                  <Avatar
                    icon={
                      metodoPagamento?.tipoMetodoPagamento ===
                      "CARTAO_CREDITO" ? (
                        <CreditCardOutlined />
                      ) : (
                        <DollarOutlined />
                      )
                    }
                    style={{
                      backgroundColor: "#87d068",
                    }}
                  />
                }
                title={titulo(metodoPagamento)}
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
