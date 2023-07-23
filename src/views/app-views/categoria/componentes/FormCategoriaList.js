import { Col, Form, Input, InputNumber, Row, Select } from "antd";
import categoriaService from "services/CategoriaService";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";

const { Option } = Select;

export const FormCategoriaList = (props) => {
  const [categorias, setCategorias] = useState([]);
  const filtroCategoria = { natureza: "DESPESA", ultimaFilha: true, nome: "" };

  useEffect(() => {
    fetchCategorias("");
  }, []);

  const fetchCategorias = (filtro) => {
    categoriaService
      .buscarTodas({ ...filtroCategoria, nome: filtro.nome })
      .then((originalPromiseResult) => {
        if (originalPromiseResult.payload !== "Error") {
          setCategorias(originalPromiseResult);
        }
      })
      .catch((rejectedValueOrSerializedError) =>
        console.log(
          "Erro carregar formas pagamentos...",
          rejectedValueOrSerializedError
        )
      );
  };

  return (
    <Row gutter={8}>
      <Col xs={24} sm={24} md={8}>
        <Form.Item
          name="idCategoria"
          label="Categoria"
          validateTrigger={["onChange", "onBlur"]}
          rules={[
            {
              required: true,
              whitespace: true,
              message: "Selecione uma categoria.",
            },
          ]}
        >
          <Select
            showSearch
            placeholder="Selecionar categoria"
            optionFilterProp="children"
            filterOption={(input, option) => {
              return (
                option.props.children
                  .toLowerCase()
                  .indexOf(input.toLowerCase()) >= 0
              );
            }}
          >
            {categorias
              ? categorias.map((categoria, index) => (
                  <Option key={index} value={categoria.id}>
                    {categoria.nome}
                  </Option>
                ))
              : null}
          </Select>
        </Form.Item>
      </Col>
      <Col xs={24} sm={24} md={10}>
        <Form.Item
          name="descricaoCategoria"
          label="Descrição"
          rules={[{ required: false }]}
        >
          <Input placeholder="Descrição" />
        </Form.Item>
      </Col>
      <Col xs={24} sm={24} md={6}>
        <Form.Item
          validateTrigger={["onChange", "onBlur"]}
          name="valorCategoria"
          label="Valor"
          rules={[{ required: false }]}
        >
          <InputNumber
            controls={false}
            prefix="R$"
            decimalSeparator=","
            precision={2}
            step={0.01}
          />
        </Form.Item>
      </Col>
    </Row>
  );
};

export default FormCategoriaList;
