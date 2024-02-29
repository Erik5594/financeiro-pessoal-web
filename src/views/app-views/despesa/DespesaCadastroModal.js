import {
  Button,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  Modal,
  Radio,
  Row,
  Select,
  notification,
} from "antd";
import locale from "antd/es/date-picker/locale/pt_BR";
import dayjs from "dayjs";
import React, { Fragment, useEffect } from "react";
import metodoPagamentoService from "services/MetodoPagamentoService";
import { useState } from "react";
import categoriaService from "services/CategoriaService";
import FormDespesaCategoria from "./componentes/FormDespesaCategoria";
import FormParcelamento from "./componentes/FormParcelamento";
import FormRecorrencia from "./componentes/FormRecorrencia";
import ModalPreviaRecorrencia from "./componentes/ModalPreviaRecorrencia";
import RecorrenciaService from "services/RecorrenciaService";

const { Option } = Select;
const { MonthPicker } = DatePicker;

const formDefault = {
  mesCompetencia: dayjs(dayjs(), "MM/YYYY"),
  dataLancamento: dayjs(dayjs(), "DD/MM/YYYY"),
  dataVencimento: dayjs(dayjs(), "DD/MM/YYYY"),
  situacao: "EM_ABERTO",
  descricao: "",
  observacao: "",
  valorCategoria: 0,
  qtdeParcela: 2,
  numParcela: 1,
  isParcelado: false,
  tipoDespesa: 0,
  dataLimiteFrequencia: dayjs(
    dayjs().set("M", dayjs().month() + 3),
    "DD/MM/YYYY"
  ),
};

const situacaoMetodoPagamento = [
  { value: "EM_ABERTO", descricao: "Em aberto" },
  { value: "PAGO", descricao: "Pago" },
];

const listaTipoLancamentoCompetencia = [
  { value: "ANTECIPADA", descricao: "Antecipada" },
  { value: "DENTRO_MES", descricao: "Dentro do mês" },
  { value: "POSTECIPADA", descricao: "Postecipado" },
];

export const DespesaCadastroModal = (props) => {
  const { open, cadastrar, isEdicao, handleCancel, fetchDespesas, despesa } =
    props;

  const [form] = Form.useForm();
  const [listaMetodoPagamento, setListaMetodoPagamento] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [tableCategoriaDespesa, setTableCategoriaDespesa] = useState([]);
  const filtroMetodoPagamento = { page: 0, size: 500, nome: "" };
  const [cadastrarAndContinuar, setCadastrarAndContinuar] = useState(false);
  const filtroCategoria = { natureza: "DESPESA", ultimaFilha: true, nome: "" };
  const [isParcelado, setIsParcelado] = useState(false);
  const [isCartaoCredito, setIsCartaoCredito] = useState(false);
  const [recorrente, setRecorrente] = useState(false);
  const [isModalPreviaRecorrenteOpen, setIsModalPreviaRecorrenteOpen] =
    useState(false);
  const [tipoDespesa, setTipoDespesa] = useState(0);
  const [isDividir, setIsDividir] = useState(false);

  const [isGerandoPrevias, setIsGerandoPrevias] = useState(false);
  const [previas, setPrevias] = useState([]);
  const [tipoLancamento, setTipoLancamento] = useState("Antecipada");

  const gerarPrevias = async () => {

    const diaLancamento = dayjs(form.getFieldValue("dataLancamento")).format(
      "D"
    );

    const filtro = {
      uuidFormaPagamento: form.getFieldValue("formaPagamento"),
      frequencia: form.getFieldValue("frenquencia"),
      dataLimite: dayjs(form.getFieldValue("dataLimiteFrequencia")).format(
        "DD/MM/YYYY"
      ),
      primeiroLancamento: dayjs().set('date', diaLancamento).format("DD/MM/YYYY"),
      primeiroVencimento: dayjs(form.getFieldValue("dataVencimento")).format(
        "DD/MM/YYYY"
      ),
    };

    try {
      setIsGerandoPrevias(true);
      const response = await RecorrenciaService.buscarPrevia(filtro);
      setPrevias([...response]);
      setIsGerandoPrevias(false);
    } catch (err) {
      console.log(
        "Ocorreu um erro ao consultar as previas de recorrencia",
        err
      );
    }
  };

  const buscarDataDatas = async () => {
    try {
      const data = {
        id: form.getFieldValue("formaPagamento"),
        dataBase:
          !!form.getFieldValue("dataLancamento") && tipoDespesa !== 1
            ? dayjs(form.getFieldValue("dataLancamento")).format("DD/MM/YYYY")
            : dayjs().format("DD/MM/YYYY"),
      };
      const response = await metodoPagamentoService.buscarDatas(data);
      form.setFieldValue(
        "dataVencimento",
        dayjs(response.dataVencimento, "DD/MM/YYYY")
      );

      form.setFieldValue(
        "mesCompetencia",
        dayjs(response.dataCompetencia, "DD/MM/YYYY").isBefore(dayjs())
          ? dayjs()
          : dayjs(response.dataCompetencia, "DD/MM/YYYY")
      );
    } catch (err) {
      console.log(
        "Ocorreu um erro ao consultar a data de vencimento da forma de pagamento.",
        err
      );
    }
  };

  const limparPrevias = () => {
    setPrevias([]);
  };

  useEffect(() => {
    fetchMetodoPagamento();
    fetchCategorias();
    arrumarFieldsEdicao();
  }, []);

  useEffect(() => {
    arrumarFieldsEdicao();
  }, [despesa]);

  useEffect(() => {
    setarMetodoPagamentoDefault(listaMetodoPagamento);
  }, [listaMetodoPagamento]);

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

  const onChangeTipoDespesa = (event) => {
    setTipoDespesa(event.target.value);
  };

  const onRemoverDespesaCategoria = (index) => {
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
    if (metodoPagamentoPadrao) {
      onChangeMetodoPagamento(metodoPagamentoPadrao.id, metodoPagamentoPadrao);
    }
  };

  const fetchMetodoPagamento = (filtro = filtroMetodoPagamento) => {
    metodoPagamentoService
      .listar({ ...filtroMetodoPagamento, nome: filtro.nome })
      .then((originalPromiseResult) => {
        if (originalPromiseResult.payload !== "Error") {
          const metodosPagamentos = originalPromiseResult.content;
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

  function setarTipoLancamento(idMetodoPagamento) {
    if (listaMetodoPagamento.length > 0) {
      const metodoPagamento = listaMetodoPagamento.find(
        (metodoPagamento) => metodoPagamento.id === idMetodoPagamento
      );
      const tipoLancamentoAux = listaTipoLancamentoCompetencia.find(
        (tipoLancamentoCompetencia) =>
          tipoLancamentoCompetencia.value ===
          metodoPagamento.tipoLancamentoCompetencia
      );
      setTipoLancamento(tipoLancamentoAux.descricao);
    }
  }

  const arrumarFieldsEdicao = () => {
    const fieldsEdicao = [];
    if (despesa?.id) {
      const parcelado = despesa.qtdeParcela > 0;
      let tipoDespesa = 0;

      setarTipoLancamento(despesa.idMetodoPagamento);
      if (parcelado) {
        tipoDespesa = 1;
      } else if (despesa.recorrencia) {
        tipoDespesa = 2;
      }

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
      fieldsEdicao.push({ name: ["tipoDespesa"], value: tipoDespesa });

      form.setFields(fieldsEdicao);
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
      setIsCartaoCredito(despesa.tipoMetodoPagamento === "CARTAO_CREDITO");
    }
  };

  const onCancel = () => {
    form.resetFields();
    setarMetodoPagamentoDefault(listaMetodoPagamento);
    setTableCategoriaDespesa([]);
    setIsParcelado(false);
    setTipoDespesa(0);
    setPrevias([]);
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
      "valorCategoria",
    ]);
    setPrevias([]);
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
          console.log("Error", rejectedValueOrSerializedError);
          notification.error({
            message: "Ocorreu um erro ao tentar cadastrar!",
          });
        });
    } catch (e) {
      notification.error({ message: e });
    }
  };

  const preValidar = (values) => {
    const categorias = [...tableCategoriaDespesa];
    const recorrencias = [...previas];
    if (categorias.length < 1) {
      throw "Deve ser preenchido pelo menos 1 categoria!";
    }
    if (values.tipoDespesa === 1) {
      if (!values.qtdeParcela) {
        throw "Deve ser preenchido a Qtde de parcela.";
      }

      if (!values.numParcela) {
        throw "Deve ser preenchido o N° da parcela.";
      }

      if (values.numParcela > values.qtdeParcela) {
        throw "N° da parcela deve ser igual ou menor que a Qtde de parcela.";
      }
    }

    if (values.tipoDespesa === 2) {
      if (!dayjs(values.dataLimiteFrequencia).isValid()) {
        throw "Data limite da frequência da recorrência deve ser preenchida.";
      }
      if (!values.frenquencia) {
        throw "Selecione a frequência da recorrência.";
      }
      if (recorrencias.length < 2) {
        throw `Deve ser gerado no minimo 2 recorrências, atual (${recorrencias.length})!`;
      }
    }
  };

  const formatarDespesaRest = (values) => {
    preValidar(values);

    const categorias = [...tableCategoriaDespesa];

    let categoriasParcelada = [];
    let recorrencia = {};

    if (values.tipoDespesa === 1) {
      //parcelado
      console.log("DESPESA PARCELADA");
      categoriasParcelada = categorias.map((categoriaDespesa) => ({
        ...categoriaDespesa,
        valor: categoriaDespesa.valor / values.qtdeParcela,
      }));
    } else if (values.tipoDespesa === 2) {
      //recorrente

      recorrencia = {
        frequencia: values.frenquencia,
        dataLimite: dayjs(values.dataLimiteFrequencia).format("DD/MM/YYYY"),
        datasRecorrencias: [...previas],
      };
      console.log("DESPESA RECORRENTE", recorrencia);
    } else {
      //simples
      console.log("DESPESA SIMPLES");
    }

    const categoriasAux =
      values.tipoDespesa === 1 ? categoriasParcelada : categorias;

    const value = {
      ...despesa,
      ...values,
      dataLancamento: dayjs(values.dataLancamento).format("DD/MM/YYYY"),
      mesCompetencia: dayjs(values.mesCompetencia).format("DD/MM/YYYY"),
      dataVencimento: dayjs(values.dataVencimento).format("DD/MM/YYYY"),
      idMetodoPagamento: values.formaPagamento,
      categorias: categoriasAux,
      recorrencia: values.tipoDespesa === 2 ? recorrencia : null,
      numParcela: values.tipoDespesa === 1 ? values.numParcela : 0,
      qtdeParcela: values.tipoDespesa === 1 ? values.qtdeParcela : 0,
    };

    delete value.descricaoCategoria;
    delete value.valorCategoria;
    delete value.categoria;
    delete value.formaPagamento;
    delete value.dataLimiteFrequencia;
    delete value.frenquencia;
    delete value.tipoDespesa;
    delete value.infoParcelamento;

    return value;
  };

  const onChangeMetodoPagamento = (value, option) => {
    form.setFieldValue("formaPagamento", value);
    const cartaoCredito = option.tipoMetodoPagamento === "CARTAO_CREDITO";
    setIsCartaoCredito(cartaoCredito);
    buscarDataDatas();
    setarTipoLancamento(value);
  };

  const getTitle = () => {
    const title = isEdicao ? "Editar despesa" : "Nova despesa";
    return (
      <Fragment>
        <div style={{ display: "flex" }}>
          <h2>{title}</h2>
          <span
            style={{
              fontSize: "10px",
              color: "blue",
              fontStyle: "italic",
            }}
          >
            **{tipoLancamento}
          </span>
        </div>
        <Divider />
      </Fragment>
    );
  };

  const onEditarDespesaCategoria = (despesaCategoria, index) => {
    form.setFieldValue("idCategoria", despesaCategoria.idCategoria);
    form.setFieldValue("descricaoCategoria", despesaCategoria.descricao);
    form.setFieldValue("valorCategoria", despesaCategoria.valor);
    onRemoverDespesaCategoria(index);
  };

  const FormCadastroDespesa = () => {
    return (
      <Fragment>
        <Row gutter={16}>
          <Col xs={24} sm={24} md={5}>
            <Form.Item
              name="mesCompetencia"
              label="Competência"
              rules={[
                { required: true, message: "Competência é obrigatório!" },
              ]}
            >
              <MonthPicker
                disabled={(isEdicao && isParcelado) || isCartaoCredito}
                locale={locale}
                placeholder="Competência"
                format="MM/YYYY"
                renderExtraFooter={() => (
                  <div style={{ textAlign: "center" }}>
                    <Button
                      onClick={() => {
                        form.setFieldValue(
                          "mesCompetencia",
                          dayjs(dayjs(), "DD/MM/YYYY")
                        );
                      }}
                    >
                      Competência atual
                    </Button>
                  </div>
                )}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={5}>
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
                onChange={() => buscarDataDatas()}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={2}></Col>
          <Col xs={24} sm={24} md={12}>
            <Form.Item
              name="tipoDespesa"
              label="Tipo de despesa"
              rules={[
                { required: true, message: "Tipo de despesa é obrigatório!" },
              ]}
            >
              <Radio.Group
                onChange={onChangeTipoDespesa}
                buttonStyle="solid"
                disabled={isEdicao}
              >
                <Radio.Button value={0}>Simples</Radio.Button>
                <Radio.Button value={1}>Parcelada</Radio.Button>
                <Radio.Button value={2}>Recorrente</Radio.Button>
              </Radio.Group>
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
                disabled={(isEdicao && isParcelado) || isCartaoCredito}
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
      </Fragment>
    );
  };

  const AcoesModal = () => {
    return (
      <Row gutter={16} style={{ marginTop: "10px" }}>
        <div style={{ display: "flex", justifyContent: "end", width: "100%" }}>
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
      </Row>
    );
  };

  const calcularTotal = (categorias, multiplicador) => {
    let total = 0;
    for (let i = 0; i < categorias.length; i++) {
      total = total + categorias[i].valor;
    }
    total = total * multiplicador;
    return total.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const calcularTotalAux = (categorias, multiplicador) => {
    let total = 0;
    for (let i = 0; i < categorias.length; i++) {
      total = total + (categorias[i].valor/multiplicador);
    }
    total = total * multiplicador;
    return total.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const DescTotal = () => {
    let qtdeParcela = 2;
    let total = "R$ 0,00";
    let totalGeral = "R$ 0,00";
    if (isEdicao) {
      total = calcularTotal(despesa.categorias, 1);
      qtdeParcela = despesa.qtdeParcela;
      totalGeral = calcularTotal(tableCategoriaDespesa, qtdeParcela);
    } else {
      total = calcularTotalAux(tableCategoriaDespesa, 1);
      qtdeParcela = form.getFieldValue("qtdeParcela");
      if (tipoDespesa === 1 || isParcelado) {
        totalGeral = calcularTotalAux(tableCategoriaDespesa, qtdeParcela);
      }
    }
    
    return tipoDespesa === 1 || isParcelado ? (
      <div style={{ display: "flex", justifyContent: "start", width: "100%" }}>
        <strong>
          Total: {qtdeParcela}x {total}
        </strong>
        <span
          style={{ color: "#939393", fontStyle: "italic" }}
        >{`-> (${totalGeral})`}</span>
      </div>
    ) : (
      <div style={{ display: "flex", justifyContent: "start", width: "100%" }}>
        <strong>Total: {total}</strong>
      </div>
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
        initialValues={formDefault}
        onFinish={(values) => onCadastrarAction(values)}
      >
        <FormCadastroDespesa />
        <FormDespesaCategoria
          isEdicao={isEdicao}
          isParcelado={isParcelado}
          categorias={categorias}
          onAddCategoria={onAddCategoria}
          form={form}
          tableCategoriaDespesa={tableCategoriaDespesa}
          onRemoverDespesaCategoria={onRemoverDespesaCategoria}
          onEditarDespesaCategoria={onEditarDespesaCategoria}
        />
        {tipoDespesa === 2 ? (
          <FormRecorrencia
            isEdicao={isEdicao}
            setRecorrente={setRecorrente}
            recorrente={recorrente}
            onOpenModalPrevia={() => setIsModalPreviaRecorrenteOpen(true)}
            onCloseModalPrevia={() => setIsModalPreviaRecorrenteOpen(false)}
            openModalRecorrente={isModalPreviaRecorrenteOpen}
            previas={previas}
            isGerandoPrevias={isGerandoPrevias}
            gerarPrevias={gerarPrevias}
            limparPrevias={limparPrevias}
          />
        ) : null}
        {tipoDespesa === 1 ? (
          <FormParcelamento
            isParcelado={isParcelado}
            isEdicao={isEdicao}
            tableCategoriaDespesa={tableCategoriaDespesa}
            form={form}
          />
        ) : null}
        <DescTotal />
        <AcoesModal />
      </Form>
      <ModalPreviaRecorrencia
        isOpen={isModalPreviaRecorrenteOpen}
        previas={previas}
        handleCancel={() => {
          limparPrevias();
          setIsModalPreviaRecorrenteOpen(false);
        }}
        handleOk={() => setIsModalPreviaRecorrenteOpen(false)}
      />
    </Modal>
  );
};

export default DespesaCadastroModal;
