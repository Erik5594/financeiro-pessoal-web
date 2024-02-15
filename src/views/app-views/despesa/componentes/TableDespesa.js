import { Button, Divider, Pagination, Popconfirm, Table, Tag } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import React from "react";

export const TableDespesa = ({
  despesas,
  onEditar,
  onExcluir,
  loading,
  content,
  onChangePage,
}) => {
  const getSituacaoFormatada = (situacao) => {
    switch (situacao) {
      case "EM_ABERTO":
        return { text: "Em aberto", color: "yellow" };
      case "PAGO":
        return { text: "Paga", color: "green" };
      case "PARCIALMENTE_PAGO":
        return { text: "Parcialmente paga", color: "geekblue" };
      case "VENCIDA":
        return { text: "Vencida", color: "red" };
      default:
        return { text: "Indefinida", color: "orange" };
    }
  };

  const getTotal = (categorias) => {
    let total = 0;
    for (let i = 0; i < categorias.length; i++) {
      total = total + categorias[i].valor;
    }
    return total.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const dataFormatada = (data, formatIn, formatOut) => {
    return dayjs(data, formatIn).format(formatOut);
  };

  const columns = [
    {
      title: "Lançamento",
      dataIndex: "dataLancamento",
      key: "dataLancamento",
      render: (lancamento) => {
        return <div>{lancamento}</div>;
      },
    },
    {
      title: "Descrição",
      dataIndex: "descricao",
      key: "descricao",
    },
    {
      title: "Vencimento",
      dataIndex: "dataVencimento",
      key: "dataVencimento",
      render: (vencimento) => {
        return <div>{vencimento}</div>;
      },
    },
    {
      title: "Total",
      dataIndex: "categorias",
      key: "categorias",
      render: (categorias) => <div>{getTotal(categorias)}</div>,
    },
    {
      title: "Situação",
      key: "situacao",
      dataIndex: "situacao",
      render: (situacao) => (
        <span>
          <Tag color={getSituacaoFormatada(situacao).color} key={situacao}>
            {getSituacaoFormatada(situacao).text}
          </Tag>
        </span>
      ),
    },
    {
      title: "",
      key: "action",
      render: (text, a) => (
        <span>
          <Button
            type="primary"
            title="Editar"
            size="small"
            onClick={() => onEditar(a.id)}
            icon={<EditOutlined />}
          />
          <Divider type="vertical" />
          <Popconfirm
            placement="bottom"
            title="Tem certeza que deseja excluir essa despesa?"
            okText="Sim"
            cancelText="Não"
            onConfirm={(event) => {
              event.stopPropagation();
              onExcluir(a.id);
            }}
            onCancel={(event) => {
              event.stopPropagation();
            }}
          >
            <Button
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
        </span>
      ),
    },
  ];

  const onChange = (a) => {
    onChangePage(a);
  };

  return (
    <Table
      columns={columns}
      dataSource={despesas}
      rowKey={(despesa) => despesa.id}
      size="small"
      loading={loading}
      expandable={{
        expandedRowRender: (registro) => (
          <p style={{ margin: 0 }}>{registro.observacao}</p>
        ),
        rowExpandable: (registro) =>
          registro.observacao && registro.observacao.length > 2,
      }}
      pagination={{
        onChange: onChange,
        total: content.totalElements,
        pageSize: content.size,
        current: content.number + 1,
        showTotal: (total, range) =>
          `${range[0]}-${range[1]} de ${total} registros`,
      }}
    />
  );
};

export default TableDespesa;
