import {
  Button,
  Col,
  Divider,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  notification,
} from "antd";
import React, { Fragment, useEffect } from "react";
import { useState } from "react";

const fielsDefault = [
  { name: ["nome"], value: undefined },
  { name: ["descricao"], value: undefined },
  { name: ["diaVencimento"], value: undefined },
  { name: ["diasParaFechamento"], value: undefined },
];

export const MetodosPagamentoModal = (props) => {
  const { open, handleCancel, isEdicao, cadastrar, fetch, metodoPagamento } =
    props;

  const [form] = Form.useForm();
  const [fields, setFields] = useState([]);

  const onCancel = () => {
    form.resetFields();
    form.setFields(fielsDefault);
    handleCancel();
  };

  useEffect(() => {
    arrumarFieldsEdicao();
  }, []);

  useEffect(() => {
    arrumarFieldsEdicao();
  }, [metodoPagamento]);

  const arrumarFieldsEdicao = () => {
    const fieldsEdicao = [];
    if (metodoPagamento?.id) {
      fieldsEdicao.push({ name: ["nome"], value: metodoPagamento.nome });
      fieldsEdicao.push({ name: ["descricao"], value: metodoPagamento.descricao });
      fieldsEdicao.push({ name: ["diaVencimento"], value: metodoPagamento.diaVencimento });
      fieldsEdicao.push({ name: ["diasParaFechamento"], value: metodoPagamento.diasParaFechamento });

      setFields(fieldsEdicao)
    }
  };

  const onCadastrarAction = async (values) => {
    const metodoPagamentoAux = { ...metodoPagamento, ...values };
    await cadastrar(metodoPagamentoAux)
      .then((originalPromiseResult) => {
        notification.success({
          message: "Cadastro realizado com sucesso!",
        });
        fetch();
        onCancel();
      })
      .catch((rejectedValueOrSerializedError) =>
        notification.error({ message: "Ocorreu um erro ao tentar cadastrar!" })
      );
  };

  const getTitle = () => {
    const title = isEdicao
      ? "Editar método de pagamento"
      : "Novo método de pagamento";
    return (
      <Fragment>
        <h2>{title}</h2>
        <Divider />
      </Fragment>
    );
  };

  return (
    <Modal title={getTitle()} open={open} footer={null} onCancel={onCancel}>
      <Form
        layout="vertical"
        form={form}
        name="cadastroMetodoPagamento"
        fields={fields}
        onFieldsChange={(changedFields, allFields) => {
          setFields(allFields);
        }}
        onFinish={(values) => onCadastrarAction(values)}
      >
        <Row gutter={16}>
          <Col xs={24} sm={24} md={12}>
            <Form.Item
              name="nome"
              label="Nome"
              rules={[{ required: true, message: "Nome é obrigatório!" }]}
            >
              <Input disabled={isEdicao} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12}>
            <Form.Item
              name="descricao"
              label="Descrição"
              rules={[{ required: false }]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col xs={24} sm={24} md={12}>
            <Form.Item
              layout="vertical"
              name="diaVencimento"
              label="Dia do vencimento"
              rules={[{ required: false }]}
            >
              <InputNumber min={1} max={31} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12}>
            <Form.Item
              name="diasParaFechamento"
              label="Dias para fechamento"
              rules={[{ required: false }]}
            >
              <InputNumber min={1} max={15} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col xs={24} sm={24} md={24}>
            <div style={{ display: "flex", justifyContent: "end" }}>
              <Form.Item>
                <Button className="mr-2" type="primary" htmlType="submit">
                  {isEdicao ? "Salvar" : "Cadastrar"}
                </Button>
              </Form.Item>
            </div>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default MetodosPagamentoModal;
