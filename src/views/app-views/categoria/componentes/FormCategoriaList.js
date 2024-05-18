import { Button, Col, Form, Input, InputNumber, Row, Select } from "antd";
import { CheckOutlined } from "@ant-design/icons";
import React from "react";

const { Option } = Select;

export const FormCategoriaList = (props) => {
  const { categorias, onAddCategoria, valorParcela=true } = props;

  return (
    <Row gutter={16}>
      <Col xs={24} sm={24} md={7}>
        <Form.Item
          name="idCategoria"
          label="Categoria"
          validateTrigger={["onChange", "onBlur"]}
          rules={[
            {
              required: false,
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
          <Input placeholder="Algo que justifique estar nessa categoria." />
        </Form.Item>
      </Col>
      <Col xs={18} sm={18} md={5}>
        <Form.Item
          validateTrigger={["onChange", "onBlur"]}
          name="valorCategoria"
          label="Valor"
          rules={[{ required: false }]}
        >
          <InputNumber
            style={{ width: "100%" }}
            controls={false}
            prefix="R$"
            decimalSeparator=","
            precision={2}
            step={1.0}
          />
        </Form.Item>
      </Col>
      <Col xs={6} sm={6} md={2}>
        <Form.Item label=" ">
          <Button
            shape="circle"
            type="dashed"
            onClick={() => onAddCategoria()}
            size="small"
            icon={<CheckOutlined style={{ color: "green" }} />}
          />
        </Form.Item>
      </Col>
    </Row>
  );
};

export default FormCategoriaList;
