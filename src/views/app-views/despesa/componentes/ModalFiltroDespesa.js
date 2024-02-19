import { Button, Modal, Row, Form, Col, Input, DatePicker, Select } from "antd";
import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import locale from "antd/es/date-picker/locale/pt_BR";
import metodoPagamentoService from "services/MetodoPagamentoService";

const { Option } = Select;
const { MonthPicker } = DatePicker;

const fielsDefault = [
  { name: ["competencia"], value: dayjs(dayjs(), "DD/MM/YYYY") },
  { name: ["vencimento"], value: null },
  { name: ["idMetodoPagamento"], value: undefined },
  { name: ["descricao"], value: undefined },
];

const situacaoMetodoPagamento = [
  { value: "EM_ABERTO", descricao: "Em aberto" },
  { value: "PAGO", descricao: "Pago" },
  { value: "PARCIALMENTE_PAGO", descricao: "Parcialmente pago" },
  { value: "VENCIDA", descricao: "Vencida" },
];

export const ModalFiltroDespesa = (props) => {
  const { open, handleCancel, handlerFiltro } = props;
  const [fields, setFields] = useState(fielsDefault);
  const filtroMetodoPagamento = { page: 0, size: 500, nome: "" };
  const [form] = Form.useForm();
  const [listaMetodoPagamento, setListaMetodoPagamento] = useState([]);

  useEffect(() => {
    fetchMetodoPagamento();
  }, []);

  const fetchMetodoPagamento = (filtro = filtroMetodoPagamento) => {
    metodoPagamentoService
      .listar({ ...filtroMetodoPagamento, nome: filtro.nome })
      .then((originalPromiseResult) => {
        if (originalPromiseResult.payload !== "Error") {
          const metodosPagamentos = originalPromiseResult.content;
          const metodoPagamentoPadrao = metodosPagamentos.find(
            (metodoPagamento) => metodoPagamento.padrao
          );
          setListaMetodoPagamento(metodosPagamentos);
        }
      })
      .catch((rejectedValueOrSerializedError) =>
        console.log(
          "Erro carregar formas pagamentos...",
          rejectedValueOrSerializedError
        )
      );
  };

  const onCancel = () => {
    handleCancel();
  };

  const onCadastrarAction = (values) => {
    let filtroAux = {...values}
    handlerFiltro(filtroAux);
    handleCancel();
  }

  const onLimparAction = () => {
    form.setFields(fielsDefault);
  }

  return (
    <Modal
      title="Filtros de despesa"
      open={open}
      footer={null}
      onCancel={onCancel}
      width={700}
    >
      <Form
        form={form}
        layout="vertical"
        name="control-hooks-filtro-despesas"
        fields={fields}
        onFieldsChange={(changedFields, allFields) => {
          setFields(allFields);
        }}
        onFinish={(values) => onCadastrarAction(values)}
      >
        <Row gutter={16}>
          <Col xs={24} sm={24} md={6}>
            <Form.Item
              name="competencia"
              label="Competência"
              rules={[
                { required: true, message: "Competência é obrigatório!" },
              ]}
            >
              <MonthPicker
                locale={locale}
                placeholder="Competência"
                format="MM/YYYY"
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
        <Col xs={24} sm={24} md={11}>
            <Form.Item
              name="idMetodoPagamento"
              label="Forma de pagamento"
              validateTrigger={["onChange", "onBlur"]}
            >
              <Select
                allowClear
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
                  <Option
                    diaFechamento={formaPagamento.diasParaFechamento}
                    diaVencimento={formaPagamento.diaVencimento}
                    tipoMetodoPagamento={formaPagamento.tipoMetodoPagamento}
                    key={index}
                    value={formaPagamento.id}
                  >
                    {formaPagamento.nome}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={6}>
            <Form.Item
              name="vencimento"
              label="Vencimento"
            >
              <DatePicker
                locale={locale}
                placeholder="Vencimento"
                format="DD/MM/YYYY"
                defaultValue={dayjs(dayjs(), "DD/MM/YYYY")}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={7}>
            <Form.Item
              name="tipoSituacao"
              label="Situação"
              validateTrigger={["onChange", "onBlur"]}
            >
              <Select
                allowClear
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
            >
              <Input placeholder="Descrição" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <div
            style={{ display: "flex", justifyContent: "end", width: "100%" }}
          >
            <div>
              <Form.Item>
                <Button
                  className="mr-2"
                  type="primary"
                  htmlType="submit"
                  size="small"
                >
                  Filtrar
                </Button>
              </Form.Item>
            </div>
            <div>
              <Form.Item>
                <Button
                  className="mr-2"
                  size="small"
                  onClick={() => onLimparAction()}
                >
                  Limpar
                </Button>
              </Form.Item>
            </div>
          </div>
        </Row>
      </Form>
    </Modal>
  );
};

export default ModalFiltroDespesa;
