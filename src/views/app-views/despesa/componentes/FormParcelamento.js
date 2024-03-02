import { Checkbox, Col, Divider, Form, Input, InputNumber, Row } from "antd";
import React, { Fragment, useEffect } from "react";

export const FormParcelamento = ({
  isEdicao,
  tableCategoriaDespesa,
  form,
  onChangeSelectDividir,
  setQtdeParcela,
  isDividir,
}) => {
  useEffect(() => {
    valorCadaParcelaFormatado();
  }, [tableCategoriaDespesa, isDividir]);

  const valorCadaParcelaFormatado = () => {
    let total = 0;
    const valores = tableCategoriaDespesa.map(
      (despesaCategoria) => despesaCategoria.valor
    );
    for (let i = 0; i < valores.length; i++) {
      total += valores[i];
    }
    const qtdeParcela = form.getFieldValue("qtdeParcela");
    const totalParcela = isDividir ? total / qtdeParcela : total;
    const totalParcelaFormatado = totalParcela.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
    const infoParcelamento = `${qtdeParcela}x de ${totalParcelaFormatado}`;
    form.setFieldValue("infoParcelamento", infoParcelamento);
    setQtdeParcela(qtdeParcela);
    return infoParcelamento;
  };

  return (
    <Fragment>
      <Divider orientation="left">Parcelamento</Divider>
      <Row gutter={16}>
        <Col xxl>
          <Form.Item
            layout="vertical"
            name="qtdeParcela"
            label="Qtde de parcelas"
            rules={[{ required: false }]}
          >
            <InputNumber
              min={2}
              max={24}
              disabled={isEdicao}
              onChange={valorCadaParcelaFormatado}
            />
          </Form.Item>
        </Col>
        <Col xxl>
          <Form.Item
            name="numParcela"
            label="N° da parcela"
            rules={[{ required: false }]}
          >
            <InputNumber min={1} max={24} disabled={isEdicao} />
          </Form.Item>
        </Col>
        <Col xxl>
          <Form.Item label="Valor da parcela" name="infoParcelamento">
            <Input disabled />
          </Form.Item>
        </Col>
        <Col xxl>
          <Form.Item label="Informei o valor total" name="dividir">
            <Checkbox onChange={onChangeSelectDividir} />
          </Form.Item>
        </Col>
      </Row>
    </Fragment>
  );
};

export default FormParcelamento;
