import {
  Button,
  Checkbox,
  Col,
  Divider,
  Form,
  Input,
  InputNumber,
  Modal,
  Radio,
  Row,
  Tooltip,
  notification,
} from "antd";
import dayjs from "dayjs";
import React, { Fragment, useEffect } from "react";
import { useState } from "react";
import MetodoPagamentoService from "services/MetodoPagamentoService";

const formDefault = {
  nome: undefined,
  descricao: undefined,
  padrao: false,
  isCartaoCredito: false,
  diaVencimento: 10,
  diasParaFechamento: 7,
  tipoLancamentoCompetencia: "DENTRO_MES",
};

export const MetodosPagamentoModal = (props) => {
  const { open, handleCancel, isEdicao, cadastrar, fetch, metodoPagamento } =
    props;

  const [form] = Form.useForm();
  const [isCartaoCredito, setIsCartaoCredito] = useState(false);
  const [{ dataVencimento, dataCompetencia, lancamentoAte }, setDatas] = useState({
    dataVencimento: dayjs().format("DD/MM/YYYY"),
    dataCompetencia: dayjs().format("MM/YYYY"),
    lancamentoAte: dayjs().format("DD/MM/YYYY"),
  });

  function atualizarDatas() {
    if (isCartaoCredito) {
      buscarDataVencimento();
    }
  }

  async function buscarDataVencimento() {
    try {
      const data = {
        dataBase: dayjs().format("DD/MM/YYYY"),
        tipoLancamentoCompetencia: form.getFieldValue(
          "tipoLancamentoCompetencia"
        ),
        diaVencimento: form.getFieldValue("diaVencimento"),
        diasFechamento: form.getFieldValue("diasParaFechamento"),
      };
      const response =
        await MetodoPagamentoService.buscarDatasSemMetodoPagamento(data);
      setDatas({
        ...response,
        dataCompetencia: dayjs(response.dataCompetencia, "DD/MM/YYYY").isBefore(
          dayjs()
        )
          ? dayjs().format("MM/YYYY")
          : dayjs(response.dataCompetencia, "DD/MM/YYYY").format("MM/YYYY"),
      });
    } catch (err) {
      console.log(
        "Ocorreu um erro ao consultar a data de vencimento da forma de pagamento.",
        err
      );
    }
  }

  const onCancel = () => {
    form.resetFields();
    setIsCartaoCredito(false);
    handleCancel();
  };

  useEffect(() => {
    if (metodoPagamento?.id) {
      arrumarFieldsEdicao();
      if(metodoPagamento.tipoMetodoPagamento === 'CARTAO_CREDITO'){
        buscarDataVencimento();
      }
    }
  }, []);

  useEffect(() => {
    if (metodoPagamento?.id) {
      arrumarFieldsEdicao();
      if(metodoPagamento.tipoMetodoPagamento === 'CARTAO_CREDITO'){
        buscarDataVencimento();
      }
    }
  }, [metodoPagamento]);

  const arrumarFieldsEdicao = () => {
    const fieldsEdicao = [];
    if (metodoPagamento?.id) {
      fieldsEdicao.push({ name: ["nome"], value: metodoPagamento.nome });
      fieldsEdicao.push({
        name: ["descricao"],
        value: metodoPagamento.descricao,
      });
      fieldsEdicao.push({
        name: ["diaVencimento"],
        value: metodoPagamento.diaVencimento ? metodoPagamento.diaVencimento : formDefault.diaVencimento,
      });
      fieldsEdicao.push({
        name: ["diasParaFechamento"],
        value: metodoPagamento.diasParaFechamento ? metodoPagamento.diasParaFechamento : formDefault.diasParaFechamento,
      });
      fieldsEdicao.push({
        name: ["isCartaoCredito"],
        value: metodoPagamento?.tipoMetodoPagamento === "CARTAO_CREDITO",
      });
      fieldsEdicao.push({
        name: ["padrao"],
        value: metodoPagamento?.padrao,
      });
      fieldsEdicao.push({
        name: ["tipoLancamentoCompetencia"],
        value: metodoPagamento?.tipoLancamentoCompetencia,
      });

      form.setFields(fieldsEdicao);
      setIsCartaoCredito(
        metodoPagamento?.tipoMetodoPagamento === "CARTAO_CREDITO"
      );
    }
  };

  const onCadastrarAction = async (values) => {
    let metodoPagamentoAux = {
      ...metodoPagamento,
      ...values,
      tipoMetodoPagamento: values.isCartaoCredito ? "CARTAO_CREDITO" : "OUTROS",
    };
    if (!values.isCartaoCredito) {
      delete metodoPagamentoAux.diaVencimento;
      delete metodoPagamentoAux.diasParaFechamento;
    }
    delete metodoPagamentoAux.isCartaoCredito;

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

  const DescVencimento = () => {
    return (
      <div style={{ display: "flex", justifyContent: "start", width: "100%" }}>
        <span style={{ color: "#939393", fontStyle: "italic" }}>
          Cadastrando um despesa hoje({dayjs().format("DD/MM/YYYY")}) com essa forma de pagamento, ficaria assim:<br/>
          <strong>Data de lançamento até: {lancamentoAte}</strong><br/>
          <strong>Competência {dataCompetencia}</strong><br/>
          <strong>Vencimento: {dataVencimento}</strong><br/>
          <strong>Melhor dia: {dayjs(lancamentoAte, "DD/MM/YYYY").add(1, "day").format("DD/MM/YYYY")}</strong><br/>
        </span>
      </div>
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
        initialValues={formDefault}
        onFinish={(values) => onCadastrarAction(values)}
      >
        <Row gutter={16}>
          <Col xs={24} sm={24} md={24}>
            <Form.Item
              name="nome"
              label="Nome:"
              rules={[{ required: true, message: "Nome é obrigatório!" }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24}>
            <Form.Item
              name="descricao"
              label="Descrição:"
              rules={[{ required: false }]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col xs={24} sm={24} md={24}>
            <Form.Item
              name="tipoLancamentoCompetencia"
              label="Tipo lançamento da competência:"
              rules={[
                { required: true, message: "Tipo de despesa é obrigatório!" },
              ]}
            >
              <Radio.Group
                onChange={(e) => {
                  atualizarDatas();
                }}
                buttonStyle="solid"
                size="small"
              >
                <Tooltip
                  color="black"
                  title="Isso significa que a despesa será lançada na competência anterior ao mês do vencimento, por exemplo, suponhamos que estamos no dia 10/02/2024 ao cadastrar uma despesa com o vencimento para o dia 10/03/2024, a mesma será lançada na competência 02/2024, já ao cadastrar uma despesa com o vencimento 20/02/2024 a mesma será lançada na competência 02/2024."
                >
                  <Radio.Button value="ANTECIPADA">Antecipado</Radio.Button>
                </Tooltip>
                <Tooltip
                  color="black"
                  title="Isso significa que a despesa será lançada na competência do mesmo mês que o mês de vencimento, por exemplo, suponhamos que estamos no dia 10/02/2024 ao cadastrar uma despesa com o vencimento para o dia 10/03/2024, a mesma será lançada na competência 03/2024."
                >
                  <Radio.Button value="DENTRO_MES">Dentro do mês</Radio.Button>
                </Tooltip>
                <Tooltip
                  color="black"
                  title="Isso significa que a despesa será lançada na competência posterior ao mês do vencimento, por exemplo, suponhamos que estamos no dia 10/02/2024 ao cadastrar uma despesa com o vencimento para o dia 10/03/2024, a mesma será lançada na competência 04/2024, já ao cadastrar uma despesa com o vencimento 20/02/2024 a mesma será lançada na competência 03/2024."
                >
                  <Radio.Button value="POSTECIPADA">Postecipado</Radio.Button>
                </Tooltip>
              </Radio.Group>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col xs={12} sm={12} md={12}>
            <Form.Item
              name="isCartaoCredito"
              valuePropName="checked"
              rules={[{ required: false }]}
            >
              <Checkbox
                onChange={(event) => {
                  setIsCartaoCredito(event.target.checked);
                  if(event.target.checked){
                    buscarDataVencimento();
                  }
                }}
                value={isCartaoCredito}
              >Cartão de crédito</Checkbox>
            </Form.Item>
          </Col>
          <Col xs={12} sm={12} md={12}>
            <Form.Item
              name="padrao"
              valuePropName="checked"
              rules={[{ required: false }]}
            >
              <Checkbox>Padrão</Checkbox>
            </Form.Item>
          </Col>
          <div style={{ display: isCartaoCredito ? "flex" : "none", width: '100%' }}>
            <Col  xs={12} sm={12} md={12}>
              <Form.Item
                layout="vertical"
                name="diaVencimento"
                label="Dia do vencimento:"
                rules={[{ required: false }]}
              >
                <InputNumber
                  min={1}
                  max={31}
                  disabled={!isCartaoCredito}
                  onChange={() => atualizarDatas()}
                />
              </Form.Item>
            </Col>
            <Col xs={12} sm={12} md={12}>
              <Form.Item
                name="diasParaFechamento"
                label="Dias para fechamento:"
                rules={[{ required: false }]}
              >
                <InputNumber
                  min={1}
                  max={15}
                  disabled={!isCartaoCredito}
                  onChange={() => atualizarDatas()}
                />
              </Form.Item>
            </Col>
          </div>
        </Row>
        {isCartaoCredito ? <DescVencimento /> : null}
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
