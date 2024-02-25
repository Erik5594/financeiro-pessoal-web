import { Col, Divider, Form, Input, InputNumber, Row } from "antd";
import React, { Fragment, useEffect } from "react";

export const FormParcelamento = ({
  isEdicao,
  tableCategoriaDespesa,
  form,
}) => {
  useEffect(() => {
    valorCadaParcelaFormatado();
  }, [tableCategoriaDespesa]);

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
    const infoParcelamento = `${qtdeParcela}x de ${totalParcelaFormatado}`;
    form.setFieldValue("infoParcelamento", infoParcelamento);
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
              onChange={(event) => {
                console.log("Alterou", event);
                valorCadaParcelaFormatado();
              }}
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
      </Row>
    </Fragment>
  );
};

export default FormParcelamento;
