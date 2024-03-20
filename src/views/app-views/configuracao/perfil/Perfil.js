import {
  Avatar,
  Button,
  Col,
  Form,
  Input,
  Row,
  Tooltip,
  Upload,
  message,
} from "antd";
import Flex from "components/shared-components/Flex";
import React, { Fragment, useEffect } from "react";
import { UserOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { AUTH_TOKEN, TENANT_ID } from "constants/AuthConstant";
import { buscar, atualizar } from "store/slices/perfilSlice";
import PerfilService from "services/PerfilService";
import { ROW_GUTTER } from "constants/ThemeConstant";
import { connect } from "react-redux";

const formInicial = {
  nome: "",
  email: "",
  username: "",
  sobrenome: "",
  descricao: "",
};

export const Perfil = (props) => {

    const {
        buscar,
        atualizar,
        perfil
      } = props;

      let urlImagemPerfil = '';

  const [form] = Form.useForm();

  useEffect(() => {
    arrumarFieldsEdicao();
  }, []);

  useEffect(() => {
    arrumarFieldsEdicao();
  }, [perfil]);

  async function excluirImagemPerfil() {
    const key = "excluindo";
    message.loading({ content: "Removendo...", key, duration: 1000 });
    PerfilService.excluirImagem()
      .then((_) => {
        urlImagemPerfil = '';
        message.success({ content: "Removida...", key, duration: 1.5 });
        buscar();
      })
      .catch((error) => {
        message.error({ content: "Falhou...", key, duration: 1.5 });
        console.log("Ocorreu um erro ao excluir imagem perfil!", error);
      });
  }

  const salvarImagemEndpoint =
    "http://192.168.100.20:8100/api/v1/perfil/imagem";

  const getHeaders = () => {
    const jwtToken = localStorage.getItem(AUTH_TOKEN) || null;
    const tenantId = localStorage.getItem(TENANT_ID) || null;
    const headers = {
      authorization: "Bearer " + jwtToken,
      "X-Tenant-Id": tenantId,
    };
    return headers;
  };

  function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
  }

  const onUploadAavater = (info) => {
    const key = "atualizando";
    if (info.file.status === "uploading") {
      message.loading({ content: "Salvando...", key, duration: 1000 });
      return;
    }
    if (info.file.status === "done") {
      getBase64(info.file.originFileObj, (imageUrl) => {
        urlImagemPerfil = imageUrl;
        buscar();
      });
      message.success({ content: "Salva!", key, duration: 1.5 });
    }
  };

  const onRemoveAvatar = () => {
    excluirImagemPerfil();
  };

  function onFinish(values) {
    atualizarPerfil(values);
  }

  async function atualizarPerfil(data) {
    await atualizar(data);
    buscar();
  }

  function onFinishFailed(values) {
    console.log("Falhou ao salvar perfil...", values);
  }

  function arrumarFieldsEdicao() {
    const fieldsEdicao = [];
    fieldsEdicao.push({ name: ["nome"], value: perfil?.nome });
    fieldsEdicao.push({ name: ["sobrenome"], value: perfil?.sobrenome });
    fieldsEdicao.push({ name: ["email"], value: perfil?.usuario?.email });
    fieldsEdicao.push({ name: ["username"], value: perfil?.usuario?.username });
    fieldsEdicao.push({ name: ["descricao"], value: perfil?.descricao });
    form.setFields(fieldsEdicao);
  }

  return (
    <Fragment>
      <Flex
        alignItems="center"
        mobileFlex={false}
        className="text-center text-md-left"
      >
        <Avatar
          size={90}
          src={perfil?.urlImagemPerfil}
          icon={<UserOutlined />}
        />
        <div className="ml-3 mt-md-0 mt-3">
          <Upload
            onChange={onUploadAavater}
            showUploadList={false}
            action={salvarImagemEndpoint}
            headers={getHeaders()}
          >
            <Tooltip title="Alterar imagem">
              <Button type="primary" icon={<EditOutlined />} />
            </Tooltip>
          </Upload>
          <Tooltip title="Remover imagem">
            <Button
              className="ml-2"
              onClick={onRemoveAvatar}
              icon={<DeleteOutlined />}
            />
          </Tooltip>
        </div>
      </Flex>
      <div className="mt-4">
        <Form
        form={form}
          name="informacaoBasica"
          layout="vertical"
          initialValues={formInicial}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Row>
            <Col xs={24} sm={24} md={24} lg={16}>
              <Row gutter={ROW_GUTTER}>
                <Col xs={24} sm={24} md={6}>
                  <Form.Item
                    label="Nome"
                    name="nome"
                    rules={[
                      {
                        required: true,
                        message: "Por favor, informe o nome!",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={12}>
                  <Form.Item label="Sobrenome" name="sobrenome">
                    <Input />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={12}>
                  <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                      {
                        required: true,
                        type: "email",
                        message: "Por favor, informe um email válido!",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={6}>
                  <Form.Item
                    label="Username"
                    name="username"
                    rules={[
                      {
                        required: true,
                        message: "Por favor, informe o username!",
                      },
                    ]}
                  >
                    <Input disabled />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={18}>
                  <Form.Item label="Descrição" name="descricao">
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
              <Button type="primary" htmlType="submit">
                Salvar alterações
              </Button>
            </Col>
          </Row>
        </Form>
      </div>
    </Fragment>
  );
};

const mapStateToProps = ({ perfilReducer }) => {
    const {
      loading,
      message,
      showMessage,
      perfil,
    } = perfilReducer;
    return {
      loading,
      message,
      showMessage,
      perfil,
    };
  };

const mapDispatchToProps = {
    buscar,
    atualizar,
  };

export default connect(mapStateToProps, mapDispatchToProps)(Perfil);
