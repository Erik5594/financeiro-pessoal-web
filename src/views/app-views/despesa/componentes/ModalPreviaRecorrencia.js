import { Modal, Table } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import React from "react";

export const ModalPreviaRecorrencia = ({
  isOpen,
  handleCancel,
  handleOk,
  previas,
}) => {
  const columns = [
    {
      title: "Competência",
      dataIndex: "competencia",
      key: "competencia",
      render: (competencia) => (
        <span>{dayjs(competencia, "DD/MM/YYYY").format("MM/YYYY")}</span>
      ),
    },
    {
      title: "Lançamento",
      dataIndex: "lancamento",
      key: "lancamento",
    },
    {
      title: "Vencimento",
      dataIndex: "vencimento",
      key: "vencimento",
    },
  ];

  return (
    <Modal
      title="Previa despesas recorrentes"
      open={isOpen}
      onCancel={handleCancel}
      onOk={handleOk}
    >
      {previas?.length < 1 ? (
        <p>
          <LoadingOutlined /> Carregando...
        </p>
      ) : (
        <Table
          rowKey={(previa) => previa.id}
          columns={columns}
          dataSource={previas}
          size="small"
          pagination={false}
        />
      )}
    </Modal>
  );
};

export default ModalPreviaRecorrencia;
