import { Button, Divider, Popconfirm, Table, Tag } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import React from "react";

export const TableDespesa = ({
  despesas,
  onEditar,
  onExcluir,
  onPagar,
  loading,
  content,
  onChangePage,
  onChangeDespesasSelecionadas,
}) => {
  const rowSelectionConfig = {
    onChange: (idsDespesas, despesas) => {
      onChangeDespesasSelecionadas(despesas);
    },
  };

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

  const columns = [
    {
      title: "Descrição",
      dataIndex: "descricao",
      key: "descricao",
      render: (descricao, despesa) => {
        return (
          <div>
            {descricao}
            {despesa.qtdeParcela > 0
              ? ` - [${despesa.numParcela}/${despesa.qtdeParcela}]`
              : ""}
          </div>
        );
      },
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
      render: (text, despesa) => (
        <span>
          <Button
            shape="circle"
            type="primary"
            title="Editar"
            size="small"
            onClick={() => {onEditar(despesa.id)}}
            icon={<EditOutlined />}
          />
          <Divider type="vertical" />
          <Popconfirm
            placement="bottom"
            title="Tem certeza que deseja marcar como pago essa despesa?"
            okText="Sim"
            cancelText="Não"
            onConfirm={(event) => {
              event.stopPropagation();
              onPagar(despesa.id);
            }}
            onCancel={(event) => {
              event.stopPropagation();
            }}
          >
            <Button
              shape="circle"
              title="Pagar"
              size="small"
              onClick={(event) => {
                event.stopPropagation();
              }}
              icon={<UploadOutlined />}
            />
          </Popconfirm>
          <Divider type="vertical" />
          <Popconfirm
            placement="bottom"
            title={
              despesa.qtdeParcela > 0 ? (
                <span>
                  <strong>DESPESA PARCELADA:</strong>
                  <br />
                  <br />
                  Será removido todas parcelas, inclusive já PAGAS e
                  competências anteriores.
                  <br /> Sendo assim poderá influenciar em competências
                  anteriores.
                  <br />
                  <br /> Deseja continuar?
                </span>
              ) : (
                "Tem certeza que deseja excluir essa despesa?"
              )
            }
            okText="Sim"
            cancelText="Não"
            onConfirm={(event) => {
              event.stopPropagation();
              onExcluir(despesa.id);
            }}
            onCancel={(event) => {
              event.stopPropagation();
            }}
          >
            <Button
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
        </span>
      ),
    },
  ];

  const onChange = (a) => {
    onChangePage(a);
  };

  return (
    <Table
      rowSelection={rowSelectionConfig}
      columns={columns}
      dataSource={despesas}
      rowKey={(despesa) => despesa.id}
      size="small"
      loading={loading}
      expandable={{
        expandedRowRender: (registro) => (
          <div>
            Categorias:
            {registro.categorias.map((categoria) => {
              return (
                <p style={{ margin: 0 }} key={categoria.idCategoria}>
                  {`${categoria.categoria.nome} -> ${getTotal([categoria])}`}
                </p>
              );
            })}
          </div>
        ),
        rowExpandable: (despesa) =>
          despesa.categorias && despesa.categorias.length > 0,
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
