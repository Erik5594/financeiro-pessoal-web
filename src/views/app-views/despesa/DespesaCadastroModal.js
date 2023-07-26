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
import categoriaService from "services/CategoriaService";

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
  const { open, cadastrar, isEdicao, handleCancel, fetchDespesas, despesa } =
    props;

  const [form] = Form.useForm();
  const [fields, setFields] = useState(fielsDefault);
  const [listaMetodoPagamento, setListaMetodoPagamento] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const filtroMetodoPagamento = { page: 0, size: 500, nome: "" };
  const [cadastrarAndContinuar, setCadastrarAndContinuar] = useState(false);
  const filtroCategoria = { natureza: "DESPESA", ultimaFilha: true, nome: "" };

  useEffect(() => {
    fetchMetodoPagamento();
    fetchCategorias();
    arrumarFieldsEdicao();
  }, []);

  useEffect(() => {
    arrumarFieldsEdicao();
  }, [despesa]);

  const fetchCategorias = (filtro = filtroCategoria) => {
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

  const fetchMetodoPagamento = (filtro = filtroMetodoPagamento) => {
    metodoPagamentoService
      .listar({ ...filtroMetodoPagamento, nome: filtro.nome })
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

  const arrumarFieldsEdicao = () => {
    const fieldsEdicao = [];
    if (despesa?.id) {
      fieldsEdicao.push({
        name: ["mesCompetencia"],
        value: dayjs(despesa.mesCompetencia, "MM/YYYY"),
      });
      fieldsEdicao.push({
        name: ["dataLancamento"],
        value: dayjs(despesa.dataLancamento, "DD/MM/YYYY"),
      });
      fieldsEdicao.push({
        name: ["dataVencimento"],
        value: dayjs(despesa.dataVencimento, "DD/MM/YYYY"),
      });
      fieldsEdicao.push({
        name: ["formaPagamento"],
        value: despesa.idMetodoPagamento,
      });
      fieldsEdicao.push({ name: ["descricao"], value: despesa.descricao });
      fieldsEdicao.push({ name: ["observacao"], value: despesa.observacao });
      fieldsEdicao.push({ name: ["situacao"], value: despesa.situacao });
      fieldsEdicao.push({
        name: ["idCategoria"],
        value: despesa.categorias[0].idCategoria,
      });
      fieldsEdicao.push({
        name: ["descricaoCategoria"],
        value: despesa.categorias[0].descricao,
      });
      fieldsEdicao.push({
        name: ["valorCategoria"],
        value: despesa.categorias[0].valor,
      });

      setFields(fieldsEdicao)
    }
  };

  const onCancel = () => {
    form.resetFields();
    form.setFields(fielsDefault);
    handleCancel();
  };

  const onResetContinuar = () => {
    form.resetFields([
      "descricao",
      "observacao",
      "idCategoria",
      "descricaoCategoria",
    ]);
    form.setFieldValue("valorCategoria", 0);
  };

  const onCadastrarAndContinuar = async (values) => {
    setCadastrarAndContinuar(true);
  };

  const onCadastrarAndFechar = async (values) => {
    setCadastrarAndContinuar(false);
  };
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

  const formatarDespesaRest = (values) => {
    const categorias = [
      {
        idCategoria: values.idCategoria,
        descricao: values.descricaoCategoria,
        valor: values.valorCategoria,
      },
    ];
    const value = {
      ...despesa,
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

  const onMetodoPagamento = (value, option) => {
    console.log(`Metodo Pagamento [${value}]...`, option);
    if(option.diaVencimento){
      console.log('Calculando nova data de vencimento...')
    console.log('Setando nova data de vencimento...')
    }else{
      console.log('Forma de pagamento não tem dia de vencimento...')
    }
    
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
                onChange={(value, option) => onMetodoPagamento(value, option)}
                filterOption={(input, option) => {
                  return (
                    option.props.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  );
                }}
              >
                {listaMetodoPagamento.map((formaPagamento, index) => (
                  <Option diaVencimento={formaPagamento.diaVencimento} key={index} value={formaPagamento.id}>
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
        <FormCategoriaList categorias={categorias}/>
        <Row gutter={16}>
          <div style={{display: 'flex', justifyContent: 'end', width: '100%'}}>
            <div>
          <Form.Item>
              <Button
                className="mr-2"
                type={isEdicao ? "default":"primary"}
                onClick={() => onCadastrarAndFechar()}
                htmlType="submit"
              >
                {isEdicao ? "Salvar e fechar" : "Cadastrar e fechar"}
              </Button>
            </Form.Item>
            </div>
            <div>
            {!isEdicao ? (
              <Form.Item>
                <Button
                  className="mr-2"
                  type="primary"
                  onClick={() => onCadastrarAndContinuar()}
                  htmlType="submit"
                >
                  {isEdicao ? "Salvar e fechar" : "Cadastrar e continuar"}
                </Button>
              </Form.Item>
            ) : null}
            </div>
          </div>
        </Row>
      </Form>
    </Modal>
  );
};

export default DespesaCadastroModal;
