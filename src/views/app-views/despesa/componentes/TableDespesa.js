import { Button, Divider, Dropdown, Popconfirm, Table, Tag } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  UploadOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import "../despesa.css";
import React, { useState } from "react";
import styled from "@emotion/styled";
import { FONT_SIZES, SPACER } from "constants/ThemeConstant";
import Flex from "components/shared-components/Flex";

const Icon = styled.div(() => ({
  fontSize: FONT_SIZES.LG,
}));

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
  const [despesaSelecionada, setDespesaSelecionada] = useState({});

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

  const DeletarRegistro = (props) => (
    <Popconfirm
      placement="bottom"
      title={
        props.despesa.qtdeParcela > 0 ? (
          <span>
            <strong>DESPESA PARCELADA:</strong>
            <br />
            <br />
            Será removido todas parcelas, inclusive já PAGAS e competências
            anteriores.
            <br /> Sendo assim poderá influenciar em competências anteriores.
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
        onExcluir(props.despesa.id);
      }}
      onCancel={(event) => {
        event.stopPropagation();
      }}
    >
      <Button
        shape={props.shape}
        type="primary"
        style={props.style}
        danger
        title="Excluir"
        size="small"
        onClick={(event) => {
          event.stopPropagation();
        }}
        icon={<DeleteOutlined />}
      >
        {props.label}
      </Button>
    </Popconfirm>
  );

  const MarcarComoPagoButton = (props) => (
    <Popconfirm
      placement="bottom"
      title="Tem certeza que deseja marcar como pago essa despesa?"
      okText="Sim"
      cancelText="Não"
      onConfirm={(event) => {
        event.stopPropagation();
        onPagar(props.despesaId);
      }}
      onCancel={(event) => {
        event.stopPropagation();
      }}
    >
      <Button
        shape={props.shape}
        title="Marcar como pago"
        size="small"
        onClick={(event) => {
          event.stopPropagation();
        }}
        icon={<UploadOutlined />}
      >
        {props.label}
      </Button>
    </Popconfirm>
  );

  const MenuItem = (props) => (
    <Flex alignItems="center" gap={SPACER[2]} onClick={props.action}>
      <Icon>{props.icon}</Icon>
      <span>{props.label}</span>
    </Flex>
  );

  const editando = () => {
    onEditar(despesaSelecionada.id);
  };

  const items = [
    {
      key: "editar",
      label: (
        <Button
          title="Editar"
          size="small"
          onClick={editando}
          icon={<EditOutlined />}
          style={{width: '100%'}} 
        >
          Editar
        </Button>
      ),
    },
    {
      key: "marcar-como-pago",
      label: (
        <MarcarComoPagoButton
          despesaId={despesaSelecionada.id}
          label="Marcar como pago"
          style={{width: '100%'}} 
        />
      ),
    },
    {
      key: "excluir",
      label: <DeletarRegistro label="Excluir" despesa={despesaSelecionada} style={{width: '100%'}} />,
    },
  ];

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

  const rowsClassName = (despesa, index) => {
    if (despesa.situacao === "VENCIDA") {
      return "vencida";
    }
    if (
      despesa.situacao === "PAGO" ||
      despesa.situacao === "PARCIALMENTE_PAGO"
    ) {
      return "pago";
    }
    if (
      dayjs(despesa.dataVencimento, "DD/MM/YYYY").format("DD/MM/YYYY") ===
      dayjs(dayjs(), "DD/MM/YYYY").format("DD/MM/YYYY")
    ) {
      return "vence-hoje";
    }
    return "";
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
      className: "ocultar-para-sm",
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
        <div>
          <span className="ocultar-para-sm">
            <Button
              shape="circle"
              type="primary"
              title="Editar"
              size="small"
              onClick={() => {
                onEditar(despesa.id);
              }}
              icon={<EditOutlined />}
            />
            <Divider type="vertical" />
            <MarcarComoPagoButton despesaId={despesa.id} shape="circle"/>
            <Divider type="vertical" />
            <DeletarRegistro despesa={despesa} shape="circle"/>
          </span>
          <span>
            <Dropdown
              placement="bottomRight"
              menu={{ items }}
              trigger={["click"]}
            >
              <Button
                shape="circle"
                icon={<MoreOutlined />}
                onClick={() => {
                  setDespesaSelecionada(despesa);
                }}
              />
            </Dropdown>
          </span>
        </div>
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
      rowClassName={(despesa, index) => rowsClassName(despesa, index)}
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
          window.screen.width > 576 &&
          despesa.categorias &&
          despesa.categorias.length > 0,
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
