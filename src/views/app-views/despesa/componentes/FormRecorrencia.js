import {
  Button,
  Checkbox,
  Col,
  DatePicker,
  Divider,
  Form,
  Row,
  Select,
  Tooltip,
} from "antd";
import {
  EyeOutlined,
  CheckOutlined,
  LoadingOutlined,
  UnlockOutlined,
} from "@ant-design/icons";
import locale from "antd/es/date-picker/locale/pt_BR";
import dayjs from "dayjs";
import { Option } from "antd/es/mentions";
import React, { Fragment, useEffect } from "react";

const frequencia = [
  { value: "DIARIA", descricao: "Diária" },
  { value: "SEMANAL", descricao: "Semanal" },
  { value: "QUINZENAL", descricao: "Quinzenal" },
  { value: "MENSAL", descricao: "Mensal" },
];

export const FormRecorrencia = ({
  onOpenModalPrevia,
  previas,
  isGerandoPrevias,
  gerarPrevias,
  limparPrevias,
}) => {
  function desabilitarData(current) {
    return (
      current &&
      (current < dayjs().endOf("day") ||
        current > dayjs().add(12, "month").endOf("day"))
    );
  }

  return (
    <Fragment>
      <Divider orientation="left">Recorrência</Divider>
      <Row gutter={16}>
        <Col xxl>
          <Form.Item
            name="frenquencia"
            label="Frequência"
            validateTrigger={["onChange", "onBlur"]}
          >
            <Select
              disabled={previas?.length > 0}
              showSearch
              placeholder="Selecionar frequência"
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.props.children
                  .toLowerCase()
                  .indexOf(input.toLowerCase()) >= 0
              }
            >
              {frequencia.map((frequencia, index) => (
                <Option key={index} value={frequencia.value}>
                  {frequencia.descricao}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col xxl>
          <Form.Item name="dataLimiteFrequencia" label="Limite frequência">
            <DatePicker
              disabled={previas?.length > 0}
              locale={locale}
              disabledDate={desabilitarData}
              placeholder="Limite frequência"
              format="DD/MM/YYYY"
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={4}>
          <Form.Item label=" ">
            <div style={{ display: "flex" }}>
              {isGerandoPrevias ? (
                <Fragment>
                  <LoadingOutlined style={{ marginRight: "5px" }} />
                  Gerando...
                </Fragment>
              ) : previas?.length < 1 ? (
                <Tooltip title={"Gerar previas"} placement="topLeft">
                  <Button
                    type="dashed"
                    shape="circle"
                    onClick={() => gerarPrevias()}
                    size="small"
                    icon={<CheckOutlined style={{ color: "green" }} />}
                  />
                </Tooltip>
              ) : (
                <Fragment>
                  <Tooltip
                    title={"Liberar edição para refazer as prévias."}
                    placement="topLeft"
                  >
                    <Button
                      style={{ marginLeft: "5px" }}
                      shape="circle"
                      type="dashed"
                      onClick={() => limparPrevias()}
                      size="small"
                      icon={<UnlockOutlined />}
                    />
                  </Tooltip>
                  <Tooltip title={"Ver previas"} placement="topLeft">
                    <Button
                      style={{ marginLeft: "5px" }}
                      shape="circle"
                      type="dashed"
                      onClick={() => onOpenModalPrevia()}
                      size="small"
                      icon={<EyeOutlined />}
                    />
                  </Tooltip>
                </Fragment>
              )}
            </div>
          </Form.Item>
        </Col>
      </Row>
    </Fragment>
  );
};

export default FormRecorrencia;
