import { Button, Col, Divider, Input, Row, Table, Tooltip } from "antd";
import { MinusOutlined, EditOutlined } from "@ant-design/icons";
import React from "react";

export const TableCategoriaDespesa = ({
  categoriasDespesas,
  onRemoverDespesaCategoria,
  disabledOptionRemove,
  onEditarDespesaCategoria,
  isEdicao
}) => {
  const getDescReduzida = (descricao, tamanhoMax, tamnho) => {
    if (!!descricao && descricao.length > tamanhoMax) {
      return descricao.substring(0, tamnho) + "...";
    }
    return descricao;
  };

  const getValorFormatado = (valor) => {
    return valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const columns = [
    {
      title: "Categoria",
      dataIndex: "categoria",
      key: "categoria",
      render: (categoria) => (
        <Tooltip
          trigger={["hover"]}
          title={categoria.nome}
          placement="topLeft"
          overlayClassName="numeric-input"
        >
          {" "}
          <Input
            value={getDescReduzida(categoria.nome, 15, 19)}
            disabled
            ellipsis
          />
        </Tooltip>
      ),
      width: 180,
      ellipsis: true,
    },
    {
      title: "Descrição",
      dataIndex: "descricao",
      key: "descricao",
      render: (descricao) => (
        <Tooltip title={descricao} placement="topLeft">
          {" "}
          <Input value={getDescReduzida(descricao, 25, 27)} disabled ellipsis />
        </Tooltip>
      ),
      width: 240,
      ellipsis: true,
    },
    {
      title: "Valor",
      dataIndex: "valor",
      key: "valor",
      render: (valor) => <Input value={getValorFormatado(valor)} disabled />,
      width: 135,
    },
    {
      title: "",
      key: "action",
      render: (text, despesa, index) => (
        <span style={{ display: disabledOptionRemove ? "none" : "flex" }}>
          <Button
            shape="circle"
            type="dashed"
            onClick={() => onEditarDespesaCategoria(despesa, index)}
            size="small"
            icon={<EditOutlined />}
          />
          <Divider type="vertical" />
          <Button
            shape="circle"
            type="dashed"
            onClick={() => onRemoverDespesaCategoria(index)}
            size="small"
            icon={<MinusOutlined style={{ color: "red" }} />}
          />
        </span>
      ),
    },
  ];

  return (
    <Row gutter={16}>
      <Col>
        {!categoriasDespesas || categoriasDespesas.length === 0 ? null : (
          <Table
            showHeader={isEdicao}
            rowKey={(categoriaDespesa) => categoriaDespesa.categoria.id}
            columns={columns}
            dataSource={categoriasDespesas}
            size="small"
            pagination={false}
          />
        )}
      </Col>
    </Row>
  );
};

export default TableCategoriaDespesa;
