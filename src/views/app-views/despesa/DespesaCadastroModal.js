import {
  Button,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  Modal,
  Row,
  Select,
  notification,
} from "antd";
import locale from "antd/es/date-picker/locale/pt_BR";
import dayjs from "dayjs";
import React, { Fragment, useEffect } from "react";
import metodoPagamentoService from "services/MetodoPagamentoService";
import { useState } from "react";
import FormCategoriaList from "../categoria/componentes/FormCategoriaList";

const { Option } = Select;
const { MonthPicker } = DatePicker;

const fielsDefault = [
  { name: ["mesCompetencia"], value: dayjs(dayjs(), "MM/YYYY") },
  { name: ["dataLancamento"], value: dayjs(dayjs(), "DD/MM/YYYY") },
  { name: ["dataVencimento"], value: dayjs(dayjs(), "DD/MM/YYYY") },
  { name: ["situacao"], value: "EM_ABERTO" },
  { name: ["valorCategoria"], value: 0 },
];

const situacaoMetodoPagamento = [
  { value: "EM_ABERTO", descricao: "Em aberto" },
  { value: "PAGO", descricao: "Pago" },
  { value: "PARCIALMENTE_PAGO", descricao: "Parcialmente pago" },
];

export const DespesaCadastroModal = (props) => {
  const { open, cadastrar, isEdicao, handleCancel, fetchDespesas } = props;

  const [form] = Form.useForm();
  const [fields, setFields] = useState(fielsDefault);
  const [listaMetodoPagamento, setListaMetodoPagamento] = useState([]);
  const filtroMetodoPagamento = { page: 0, size: 500, nome: "" };
  const [cadastrarAndContinuar, setCadastrarAndContinuar] = useState(false);

  useEffect(() => {
    fetchMetodoPagamento("");
  }, []);

  const onCancel = () => {
    form.resetFields();
    form.setFields(fielsDefault);
    handleCancel();
  };

  const onResetContinuar = () => {
    form.resetFields(["descricao","observacao","idCategoria","descricaoCategoria"])
    form.setFieldValue("valorCategoria", 0);
  };

  const onCadastrarAndContinuar = async (values) => {
    setCadastrarAndContinuar(true);
  }

  const onCadastrarAndFechar = async (values) => {
    setCadastrarAndContinuar(false);
  }
  const onCadastrarAction = async (values) => {
    const valoresFormatados = formatarDespesaRest(values);
    await cadastrar(valoresFormatados)
      .then((originalPromiseResult) => {
        notification.success({
          message: "Cadastro realizado com sucesso!",
        });
        fetchDespesas();
        cadastrarAndContinuar ? onResetContinuar() : onCancel();
      })
      .catch((rejectedValueOrSerializedError) =>
        notification.error({ message: "Ocorreu um erro ao tentar cadastrar!" })
      );
  };

  const fetchMetodoPagamento = (filtro) => {
    metodoPagamentoService
      .listar({ ...filtroMetodoPagamento, nome: filtro })
      .then((originalPromiseResult) => {
        if (originalPromiseResult.payload !== "Error") {
          setListaMetodoPagamento(originalPromiseResult.content);
        }
      })
      .catch((rejectedValueOrSerializedError) =>
        console.log(
          "Erro carregar formas pagamentos...",
          rejectedValueOrSerializedError
        )
      );
  };

  const formatarDespesaRest = (values) => {
    const categorias = [
      {
        idCategoria: values.idCategoria,
        descricao: values.descricaoCategoria,
        valor: values.valorCategoria,
      },
    ];
    const value = {
      ...values,
      dataLancamento: dayjs(values.dataLancamento).format("DD/MM/YYYY"),
      mesCompetencia: dayjs(values.mesCompetencia).format("DD/MM/YYYY"),
      dataVencimento: dayjs(values.dataVencimento).format("DD/MM/YYYY"),
      situacao: values.situacao,
      idMetodoPagamento: values.formaPagamento,
      categorias,
      qtdeParcela: 0,
      recorrente: false,
    };
    delete value.descricaoCategoria;
    delete value.valorCategoria;
    delete value.categoria;
    delete value.formaPagamento;

    return value;
  };

  const onChangeDate = (date, dateString) => {
    console.log("Data...", date, dateString);
  };

  const getTitle = () => {
    const title = isEdicao ? "Editar despesa" : "Cadastrar nova despesa";
    return (
      <Fragment>
        <h2>{title}</h2>
        <Divider />
      </Fragment>
    );
  };

  return (
    <Modal
      title={getTitle()}
      open={open}
      footer={null}
      onCancel={onCancel}
      width={700}
    >
      <Form
        form={form}
        layout="vertical"
        name="control-hooks"
        fields={fields}
        onFieldsChange={(changedFields, allFields) => {
          setFields(allFields);
        }}
        onFinish={(values) => onCadastrarAction(values)}
      >
        <Row gutter={16}>
          <Col xs={24} sm={24} md={6}>
            <Form.Item
              name="mesCompetencia"
              label="Competência"
              rules={[
                { required: true, message: "Competência é obrigatório!" },
              ]}
            >
              <MonthPicker
                locale={locale}
                onChange={onChangeDate}
                placeholder="Competência"
                format="MM/YYYY"
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={6}>
            <Form.Item
              name="dataLancamento"
              label="Lançamento"
              rules={[{ required: true, message: "Lançamento é obrigatório!" }]}
            >
              <DatePicker
                locale={locale}
                onChange={onChangeDate}
                placeholder="Data do lançamento"
                format="DD/MM/YYYY"
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col xs={24} sm={24} md={11}>
            <Form.Item
              name="formaPagamento"
              label="Forma de pagamento"
              validateTrigger={["onChange", "onBlur"]}
              rules={[
                {
                  required: true,
                  whitespace: true,
                  message: "Selecione uma forma de pagamento.",
                },
              ]}
            >
              <Select
                showSearch
                placeholder="Selecionar forma de pagamento"
                optionFilterProp="children"
                filterOption={(input, option) => {
                  return (
                    option.props.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  );
                }}
              >
                {listaMetodoPagamento.map((formaPagamento, index) => (
                  <Option key={index} value={formaPagamento.id}>
                    {formaPagamento.nome}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={6}>
            <Form.Item
              name="dataVencimento"
              label="Vencimento"
              rules={[{ required: true, message: "Vencimento é obrigatório!" }]}
            >
              <DatePicker
                locale={locale}
                onChange={onChangeDate}
                placeholder="Vencimento"
                format="DD/MM/YYYY"
                defaultValue={dayjs(dayjs(), "DD/MM/YYYY")}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={7}>
            <Form.Item
              name="situacao"
              label="Situação"
              validateTrigger={["onChange", "onBlur"]}
              rules={[
                {
                  required: true,
                  whitespace: true,
                  message: "Selecione uma situação.",
                },
              ]}
            >
              <Select
                showSearch
                placeholder="Selecionar situação"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.props.children
                    .toLowerCase()
                    .indexOf(input.toLowerCase()) >= 0
                }
              >
                {situacaoMetodoPagamento.map((situacao, index) => (
                  <Option key={index} value={situacao.value}>
                    {situacao.descricao}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col xs={24} sm={24} md={14}>
            <Form.Item
              name="descricao"
              label="Descrição"
              rules={[{ required: true }]}
            >
              <Input placeholder="Descrição" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={10}>
            <Form.Item
              name="observacao"
              label="Observação"
              rules={[{ required: false }]}
            >
              <Input placeholder="Observação" />
            </Form.Item>
          </Col>
        </Row>
        <FormCategoriaList />
        <Row gutter={16}>
          <Col xs={24} sm={24} md={10}>
            <Form.Item>
              <Button className="mr-2" type="primary" onClick={() => onCadastrarAndFechar()} htmlType="submit">
                {isEdicao ? "Salvar e fechar" : "Cadastrar e fechar"}
              </Button>
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={10}>
            {!isEdicao ? (<Form.Item>
              <Button className="mr-2" type="primary" onClick={() => onCadastrarAndContinuar()} htmlType="submit">
                {isEdicao ? "Salvar e fechar" : "Cadastrar e continuar"}
              </Button>
            </Form.Item>) : null}
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default DespesaCadastroModal;
