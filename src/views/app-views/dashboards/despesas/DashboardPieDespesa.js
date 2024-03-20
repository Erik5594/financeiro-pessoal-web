import React from "react";
import Chart from "react-apexcharts";
import { COLORS } from "constants/ChartConstant";
import CardDashboard from "../componente/CardDashboard";
import { buscar } from "store/slices/dashboardTotalizadorDespesaSlice";
import { connect } from "react-redux";
import { useEffect } from "react";
import dayjs from "dayjs";
import { useState } from "react";
import { Empty, notification } from "antd";

export const DashboardPieDespesa = (props) => {
  const { buscar, totalizador, loading, content } = props;
  const [valores, setValores] = useState([]);
  const [zerado, setZerado] = useState(true);

  const fetchTotalizador = (competencia) => {
    buscar(competencia)
      .then((originalPromiseResult) => {
        if (originalPromiseResult.payload !== "Error") {
          const retorno = originalPromiseResult.payload;
          const zeradoAux = retorno.qtdePago === 0 && retorno.qtdeEmAberto === 0 && retorno.qtdeVencido === 0;
          setZerado(zeradoAux)
          setarValores(retorno);
        }
      })
      .catch((rejectedValueOrSerializedError) =>
        notification.error({ message: "Ocorreu um erro ao tentar cadastrar!" })
      );
  };

  useEffect(() => {
    fetchTotalizador(dayjs(dayjs(), "DD/MM/YYYY"));
  }, []);

  const options = {
    colors: COLORS,
    labels: ["Em aberto", "Paga", "Vencida"],
    dataLabels: {
      textAnchor: "end",
      distributed: false,
      offsetX: 0,
      offsetY: 0,
      style: {
        fontSize: "14px",
        fontFamily: "Helvetica, Arial, sans-serif",
        fontWeight: "bold",
        colors: undefined,
      },
      background: {
        enabled: true,
        foreColor: "#fff",
        padding: 4,
        borderRadius: 2,
        borderWidth: 1,
        borderColor: "#fff",
        opacity: 0.9,
        dropShadow: {
          enabled: true,
          top: 1,
          left: 1,
          blur: 1,
          color: "#000",
          opacity: 0.45,
        },
      },
      dropShadow: {
        enabled: false,
        top: 1,
        left: 1,
        blur: 1,
        color: "#000",
        opacity: 0.45,
      },
      pie: {
        expandOnClick: true,
      },
    },
    tooltip: {
      enabled: true,
      y: {
        formatter: function (
          value,
          { series, seriesIndex, dataPointIndex, w }
        ) {
          return value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          });
        },
      },
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
    plotOptions: {
      pie: {
        customScale: 1,
      },
    },
  };

  const setarValores = (totalizadorAux) => {
    const valoresAux = [
      totalizadorAux.totalEmAberto | 0,
      totalizadorAux.totalPago | 0,
      totalizadorAux.totalVencido | 0,
    ];

    setValores(valoresAux);
  };

  return (
    <CardDashboard title={"Despesa"} subtitle={"Quantidade x Situação"}>
        {zerado ? <Empty /> : <Chart options={options} series={valores} type="pie" />}
      </CardDashboard>
  );
};

const mapStateToProps = ({ totalizadorDespesaReducer }) => {
  const { loading, message, showMessage, totalizador, content } =
    totalizadorDespesaReducer;
  return {
    loading,
    message,
    showMessage,
    totalizador,
    content,
  };
};

const mapDispatchToProps = {
  buscar,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DashboardPieDespesa);
