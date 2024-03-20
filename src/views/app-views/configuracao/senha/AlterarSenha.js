import { Button, Col, Form, Input, Row, notification } from "antd";
import { ROW_GUTTER } from "constants/ThemeConstant";
import { LockOutlined } from "@ant-design/icons";
import React from "react";
import { connect } from "react-redux";
import { atualizarSenha } from "store/slices/authSlice";

const formInicial = {
  atual: "",
  nova: "",
  confirmacao: "",
};

export const AlterarSenha = (props) => {
  const { atualizarSenha } = props;
  const [form] = Form.useForm();

  async function atualizarSenhaCleanForm(data) {
    await atualizarSenha(data).then((originalPromiseResult) => {
      if (originalPromiseResult.type === "auth/atualizarSenha/fulfilled") {
        form.resetFields();
      }
    });
  }

  function onFinish(values) {
    atualizarSenhaCleanForm(values);
  }

  return (
    <Form
      form={form}
      name="informacaoBasica"
      layout="vertical"
      initialValues={formInicial}
      onFinish={onFinish}
    >
      <Row>
        <Col xs={24} sm={24} md={24} lg={16}>
          <Row gutter={ROW_GUTTER}>
            <Col xs={24} sm={24} md={6}>
              <Form.Item
                label="Senha atual"
                name="atual"
                rules={[
                  {
                    required: true,
                    message: "Por favor, informe a senha atual!",
                  },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined className="text-primary" />}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={ROW_GUTTER}>
            <Col xs={24} sm={24} md={6}>
              <Form.Item
                label="Nova senha"
                name="nova"
                rules={[
                  {
                    required: true,
                    message: "Informe uma senha!",
                  },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined className="text-primary" />}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={ROW_GUTTER}>
            <Col xs={24} sm={24} md={6}>
              <Form.Item
                label="Confirme a nova senha"
                name="confirmacao"
                rules={[
                  {
                    required: true,
                    message: "Informe a senha de confirmação!",
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("nova") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject("As senhas não combinam!");
                    },
                  }),
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined className="text-primary" />}
                />
              </Form.Item>
            </Col>
          </Row>
          <Button type="primary" htmlType="submit">
            Salvar alterações
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

const mapStateToProps = ({ auth }) => {
  const { loading, message, showMessage } = auth;
  return {
    loading,
    message,
    showMessage,
  };
};

const mapDispatchToProps = {
  atualizarSenha,
};

export default connect(mapStateToProps, mapDispatchToProps)(AlterarSenha);
