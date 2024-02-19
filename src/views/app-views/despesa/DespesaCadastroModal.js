import {
  Button,
  Checkbox,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
  Table,
  notification,
} from "antd";
import locale from "antd/es/date-picker/locale/pt_BR";
import dayjs from "dayjs";
import React, { Fragment, useEffect } from "react";
import metodoPagamentoService from "services/MetodoPagamentoService";
import { useState } from "react";
import FormCategoriaList from "../categoria/componentes/FormCategoriaList";
import categoriaService from "services/CategoriaService";
import TableCategoriaDespesa from "./componentes/TableCategoriaDespesa";

const { Option } = Select;
const { MonthPicker } = DatePicker;

const fieldsDefault = [
  { name: ["mesCompetencia"], value: dayjs(dayjs(), "MM/YYYY") },
  { name: ["dataLancamento"], value: dayjs(dayjs(), "DD/MM/YYYY") },
  { name: ["dataVencimento"], value: dayjs(dayjs(), "DD/MM/YYYY") },
  { name: ["descricao"], value: "" },
  { name: ["observacao"], value: "" },
  { name: ["situacao"], value: "EM_ABERTO" },
  { name: ["valorCategoria"], value: 0 },
  { name: ["qtdeParcela"], value: 2 },
  { name: ["numParcela"], value: 1 },
  { name: ["isParcelado"], value: false },
];

const situacaoMetodoPagamento = [
  { value: "EM_ABERTO", descricao: "Em aberto" },
  { value: "PAGO", descricao: "Pago" },
  //{ value: "PARCIALMENTE_PAGO", descricao: "Parcialmente pago" },
];

export const DespesaCadastroModal = (props) => {
  const { open, cadastrar, isEdicao, handleCancel, fetchDespesas, despesa } =
    props;

  const [form] = Form.useForm();
  const [fields, setFields] = useState(fieldsDefault);
  const [listaMetodoPagamento, setListaMetodoPagamento] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [tableCategoriaDespesa, setTableCategoriaDespesa] = useState([]);
  const filtroMetodoPagamento = { page: 0, size: 500, nome: "" };
  const [cadastrarAndContinuar, setCadastrarAndContinuar] = useState(false);
  const filtroCategoria = { natureza: "DESPESA", ultimaFilha: true, nome: "" };
  const [isParcelado, setIsParcelado] = useState(false);
  const [isCartaoCredito, setIsCartaoCredito] = useState(false);

  useEffect(() => {
    fetchMetodoPagamento();
    fetchCategorias();
    arrumarFieldsEdicao();
    setarMetodoPagamentoDefault(listaMetodoPagamento);
  }, []);

  useEffect(() => {
    arrumarFieldsEdicao();
  }, [despesa]);

  const onAddCategoria = () => {
    const categoriaDespesa = {
      idCategoria: form.getFieldValue("idCategoria"),
      categoria: categorias.find(
        (categoria) => categoria.id === form.getFieldValue("idCategoria")
      ),
      descricao: form.getFieldValue("descricaoCategoria"),
      valor: form.getFieldValue("valorCategoria"),
    };
    if (
      !!categoriaDespesa.idCategoria &&
      !!categoriaDespesa.valor &&
      categoriaDespesa.valor > 0
    ) {
      const despesaExistente = tableCategoriaDespesa.find(
        (despesaTable) =>
          despesaTable.idCategoria === categoriaDespesa.idCategoria
      );
      if (!!despesaExistente) {
        notification.error({
          message: "Já existe essa categoria!",
        });
      } else {
        setTableCategoriaDespesa([...tableCategoriaDespesa, categoriaDespesa]);
        form.setFieldValue("idCategoria", undefined);
        form.setFieldValue("descricaoCategoria", undefined);
        form.setFieldValue("valorCategoria", 0);
      }
    } else {
      notification.error({
        message: "Campos obrigatorios não informados[Categoria, Valor]",
      });
    }
  };

  const onRemover = (index) => {
    const categoriaDespesaTable = [...tableCategoriaDespesa];
    categoriaDespesaTable.splice(index, 1);
    setTableCategoriaDespesa(categoriaDespesaTable);
  };

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

  const setarMetodoPagamentoDefault = (metodosPagamento) => {
    const metodoPagamentoPadrao = metodosPagamento.find(
      (metodoPagamento) => metodoPagamento.padrao
    );
    if(metodoPagamentoPadrao){
      onChangeMetodoPagamento(
        metodoPagamentoPadrao.id,
        metodoPagamentoPadrao
      );
    }
  }

  const fetchMetodoPagamento = (filtro = filtroMetodoPagamento) => {
    metodoPagamentoService
      .listar({ ...filtroMetodoPagamento, nome: filtro.nome })
      .then((originalPromiseResult) => {
        if (originalPromiseResult.payload !== "Error") {
          const metodosPagamentos = originalPromiseResult.content;
          setListaMetodoPagamento(metodosPagamentos);
          setarMetodoPagamentoDefault(metodosPagamentos);
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
      const parcelado = despesa.qtdeParcela > 0;
      fieldsEdicao.push({
        name: ["mesCompetencia"],
        value: dayjs(despesa.mesCompetencia, "DD/MM/YYYY"),
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
      fieldsEdicao.push({
        name: ["descricao"],
        value:
          isEdicao && parcelado
            ? `${despesa.descricao} - [${despesa.numParcela}/${despesa.qtdeParcela}]`
            : despesa.descricao,
      });
      fieldsEdicao.push({ name: ["observacao"], value: despesa.observacao });
      fieldsEdicao.push({ name: ["situacao"], value: despesa.situacao });
      fieldsEdicao.push({ name: ["qtdeParcela"], value: despesa.qtdeParcela });
      fieldsEdicao.push({ name: ["numParcela"], value: despesa.numParcela });
      fieldsEdicao.push({ name: ["isParcelado"], value: parcelado });

      setFields(fieldsEdicao);
      const categoriasAux = despesa.categorias.map((categoria) => {
        return {
          ...categoria,
          categoria: categorias.find(
            (categoriaAux) => categoriaAux.id === categoria.idCategoria
          ),
        };
      });
      setTableCategoriaDespesa(categoriasAux);
      setIsParcelado(parcelado);
    }
  };

  const onCancel = () => {
    form.resetFields([
      "mesCompetencia",
      "dataLancamento",
      "dataVencimento",
      "descricao",
      "observacao",
      "idCategoria",
      "descricaoCategoria",
      "qtdeParcela",
      "numParcela",
      "valorCadaParcela",
      "isParcelado"
    ]);
    setarMetodoPagamentoDefault(listaMetodoPagamento);
    setTableCategoriaDespesa([]);
    handleCancel();
  };

  const onResetContinuar = () => {
    form.resetFields([
      "descricao",
      "observacao",
      "idCategoria",
      "descricaoCategoria",
      "qtdeParcela",
      "numParcela",
      "valorCadaParcela",
    ]);
    form.setFieldValue("valorCategoria", 0);
    setTableCategoriaDespesa([]);
  };

  const onCadastrarAndContinuar = async (values) => {
    setCadastrarAndContinuar(true);
  };

  const onCadastrarAndFechar = async (values) => {
    setCadastrarAndContinuar(false);
  };

  const onCadastrarAction = async (values) => {
    try {
      const valoresFormatados = formatarDespesaRest(values);
      await cadastrar(valoresFormatados)
        .then((originalPromiseResult) => {
          notification.success({
            message: "Cadastro realizado com sucesso!",
          });
          fetchDespesas();
          cadastrarAndContinuar ? onResetContinuar() : onCancel();
        })
        .catch((rejectedValueOrSerializedError) => {
          console.log('Error', rejectedValueOrSerializedError)
          notification.error({
            message: "Ocorreu um erro ao tentar cadastrar!",
          });
        });
    } catch (e) {
      notification.error({ message: e });
    }
  };

  const valorCadaParcelaFormatado = () => {
    let total = 0;
    const valores = tableCategoriaDespesa.map(
      (despesaCategoria) => despesaCategoria.valor
    );
    for (let i = 0; i < valores.length; i++) {
      total += valores[i];
    }
    const qtdeParcela = form.getFieldValue("qtdeParcela");
    const totalParcela = total / qtdeParcela;
    const totalParcelaFormatado = totalParcela.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
    return `${qtdeParcela}x de ${totalParcelaFormatado}`;
  };

  const formatarDespesaRest = (values) => {
    const categorias = [...tableCategoriaDespesa];
    let categoriasParcelada = [];
    if (values.isParcelado) {
      categoriasParcelada = categorias.map((catgoriaDespesa) => ({
        ...catgoriaDespesa,
        valor: catgoriaDespesa.valor / values.qtdeParcela,
      }));
    }
    if (categorias.length < 1) {
      throw "Deve ser preenchido pelo menos 1 categoria!!!";
    }

    if (values.isParcelado && !values.qtdeParcela) {
      throw "Deve ser preenchido a Qtde de parcela.";
    }

    if (values.isParcelado && !values.numParcela) {
      throw "Deve ser preenchido o N° da parcela.";
    }

    if (values.isParcelado && values.numParcela > values.qtdeParcela) {
      throw "N° da parcela deve ser igual ou menor que a Qtde de parcela.";
    }
    const categoriasAux = values.isParcelado ? categoriasParcelada : categorias;

    const value = {
      ...despesa,
      ...values,
      dataLancamento: dayjs(values.dataLancamento).format("DD/MM/YYYY"),
      mesCompetencia: dayjs(values.mesCompetencia).format("DD/MM/YYYY"),
      dataVencimento: dayjs(values.dataVencimento).format("DD/MM/YYYY"),
      situacao: values.situacao,
      idMetodoPagamento: values.formaPagamento,
      categorias: categoriasAux,
      recorrente: false,
      numParcela: values.isParcelado ? values.numParcela : 0,
      qtdeParcela: values.isParcelado ? values.qtdeParcela : 0,
    };
    delete value.descricaoCategoria;
    delete value.valorCategoria;
    delete value.categoria;
    delete value.formaPagamento;

    console.log("Despesa...", value);

    return value;
  };

  const onChangeMetodoPagamento = (value, option) => {
    const fieldsEdicao = [...fields];
    fieldsEdicao.push({
      name: ["formaPagamento"],
      value: value,
    });
    setIsCartaoCredito(option.tipoMetodoPagamento === "CARTAO_CREDITO");
    if (option.diaVencimento) {
      if (option.diaFechamento) {
        const diaBase = option.diaVencimento - option.diaFechamento;
        if (diaBase <= 0) {
          if (diaBase === 0) {
            /*
             * diaBase = 0: Indica que a fatura fecha sempre no 1° dia do mês.
             */
            fieldsEdicao.push({
              name: ["dataVencimento"],
              value: dayjs(
                dayjs()
                  .set("M", dayjs().month() + 1)
                  .set("D", option.diaVencimento),
                "DD/MM/YYYY"
              ),
            });
          } else if (diaBase === -1) {
            /*
             * diaBase = -1: Indica que a fatura fecha sempre no ultimo dia do mês anterior ao de vencimento.
             */
            if (dayjs().date() === dayjs().endOf("M").date()) {
              /**
               * Ultimo dia do mês
               */
              fieldsEdicao.push({
                name: ["dataVencimento"],
                value: dayjs(
                  dayjs()
                    .set("M", dayjs().month() + 2)
                    .set("D", option.diaVencimento),
                  "DD/MM/YYYY"
                ),
              });
            } else {
              /**
               * Qualquer outro do mês
               */
              fieldsEdicao.push({
                name: ["dataVencimento"],
                value: dayjs(
                  dayjs()
                    .set("M", dayjs().month() + 1)
                    .set("D", option.diaVencimento),
                  "DD/MM/YYYY"
                ),
              });
            }
          } else {
            /*
              
                 diaBase < -1: Indica que a fatura fecha sempre no mês anterior ao de vencimento.
                 Dia de vencimento (V): 4
                 Dias para fechamento (F): 7
                 Dia do cadastro: 30/07

                 V - F = -3
                 Dia do fechamento = 28/07
                 Data vencimento = 04/09/2023

                 -----------------------------------

                 Dia de vencimento (V): 4
                 Dias para fechamento (F): 7
                 Dia do cadastro: 02/08

                 V - F = -3
                 Dia do fechamento = 28/07
                 Data vencimento = 04/09/2023 

               */
            const ultimoDiaMes = dayjs().endOf("M").date();
            const diaFechamento = ultimoDiaMes - Math.abs(diaBase);
            const diaHoje = dayjs().date();
            if (diaHoje >= diaFechamento) {
              fieldsEdicao.push({
                name: ["dataVencimento"],
                value: dayjs(
                  dayjs()
                    .set("M", dayjs().month() + 2)
                    .set("D", option.diaVencimento),
                  "DD/MM/YYYY"
                ),
              });
            } else {
              fieldsEdicao.push({
                name: ["dataVencimento"],
                value: dayjs(
                  dayjs()
                    .set("M", dayjs().month() + 1)
                    .set("D", option.diaVencimento),
                  "DD/MM/YYYY"
                ),
              });
            }
          }
        } else {
          if (dayjs().date() >= option.diaVencimento - option.diaFechamento) {
            fieldsEdicao.push({
              name: ["dataVencimento"],
              value: dayjs(
                dayjs()
                  .set("M", dayjs().month() + 1)
                  .set("D", option.diaVencimento),
                "DD/MM/YYYY"
              ),
            });
          } else {
            fieldsEdicao.push({
              name: ["dataVencimento"],
              value: dayjs(
                dayjs().set("D", option.diaVencimento),
                "DD/MM/YYYY"
              ),
            });
          }
        }
      } else {
        if (dayjs().date() >= option.diaVencimento) {
          fieldsEdicao.push({
            name: ["dataVencimento"],
            value: dayjs(
              dayjs()
                .set("M", dayjs().month() + 1)
                .set("D", option.diaVencimento),
              "DD/MM/YYYY"
            ),
          });
        } else {
          fieldsEdicao.push({
            name: ["dataVencimento"],
            value: dayjs(dayjs().set("D", option.diaVencimento), "DD/MM/YYYY"),
          });
        }
      }
    } else {
      fieldsEdicao.push({
        name: ["dataVencimento"],
        value: dayjs(dayjs(), "DD/MM/YYYY"),
      });
    }

    setFields(fieldsEdicao);
  };

  const getTitle = () => {
    const title = isEdicao ? "Editar despesa" : "Nova despesa";
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
                disabled={isEdicao && isParcelado}
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
                disabled={isEdicao && isParcelado}
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
                disabled={isEdicao && isParcelado}
                showSearch
                placeholder="Selecionar forma de pagamento"
                optionFilterProp="children"
                onChange={(value, option) =>
                  onChangeMetodoPagamento(value, option)
                }
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
              name="dataVencimento"
              label="Vencimento"
              rules={[{ required: true, message: "Vencimento é obrigatório!" }]}
            >
              <DatePicker
                disabled={isEdicao && isParcelado}
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
              <Input
                placeholder="Descrição"
                disabled={isEdicao && isParcelado}
              />
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
        <div style={{ display: isEdicao && isParcelado ? "none" : "flex" }}>
          <FormCategoriaList
            categorias={categorias}
            onAddCategoria={onAddCategoria}
            form={form}
          />
        </div>
        <TableCategoriaDespesa
          categoriasDespesas={tableCategoriaDespesa}
          disabledOptionRemove={isEdicao && isParcelado}
          onRemover={onRemover}
        />
        <div
          style={{
            display:
              !isCartaoCredito || (isEdicao && isParcelado) ? "none" : "flex",
          }}
        >
          <Row gutter={16}>
            <Col xxl>
              <Form.Item
                name="isParcelado"
                label="Parcelado?"
                valuePropName="checked"
                rules={[{ required: false }]}
              >
                <Checkbox
                  onChange={(event) => setIsParcelado(event.target.checked)}
                  value={isParcelado}
                />
              </Form.Item>
            </Col>
            <div style={{ display: isParcelado ? "flex" : "none" }}>
              <Col xxl>
                <Form.Item
                  layout="vertical"
                  name="qtdeParcela"
                  label="Qtde de parcelas"
                  rules={[{ required: false }]}
                >
                  <InputNumber min={1} max={24} disabled={!isParcelado} />
                </Form.Item>
              </Col>
              <Col xxl>
                <Form.Item
                  name="numParcela"
                  label="N° da parcela"
                  rules={[{ required: false }]}
                >
                  <InputNumber min={1} max={24} disabled={!isParcelado} />
                </Form.Item>
              </Col>
              <Col xxl>
                <Form.Item label="Valor da parcela">
                  <Input value={valorCadaParcelaFormatado()} disabled />
                </Form.Item>
              </Col>
            </div>
          </Row>
        </div>
        <Row gutter={16}>
          <div
            style={{ display: "flex", justifyContent: "end", width: "100%" }}
          >
            <div>
              <Form.Item>
                <Button
                  className="mr-2"
                  type={!isEdicao ? "default" : "primary"}
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
