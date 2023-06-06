import { Button, Form, Input, Modal } from "antd";
import React from "react";

const layout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 18 },
};

const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

export const CategoriaCadastroModal = (props) => {
  const {
    form,
    onFinish,
    open,
    fields,
    onChange,
    handleCancel,
    tipo,
    idCategoriaPai,
    isEdicao
  } = props;

  return (
    <Modal
      title={`${isEdicao ? 'Editar':'Cadastrar'} categoria de ${tipo}`}
      open={open}
      footer={null}
      onCancel={handleCancel}
    >
      <Form
        {...layout}
        form={form}
        name="control-hooks"
        fields={fields}
        onFieldsChange={(changedFields, allFields) => {
          onChange(allFields);
        }}
        onFinish={(values) =>
          onFinish({
            ...values,
            idCategoriaPai,
            natureza: tipo === "receita" ? "RECEITA" : "DESPESA",
          })
        }
      >
        <Form.Item
          name="nome"
          label="Nome"
          rules={[{ required: true, message: "Nome é obrigatório!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="descricao"
          label="Descrição"
          rules={[{ required: false }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="categoriaPai"
          label="Categoria Pai"
          rules={[{ required: false }]}
        >
          <Input disabled />
        </Form.Item>
        <Form.Item {...tailLayout}>
          <Button className="mr-2" type="primary" htmlType="submit">
            {isEdicao ? 'Editar':'Cadastrar'}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CategoriaCadastroModal;
