import React from "react";
import Chart from "react-apexcharts";
import { COLORS } from "constants/ChartConstant";
import CardDashboard from "../componente/CardDashboard";

export const DashboardPieDespesa = () => {
  const valores = [500, 996.65, 99.9];
  const series = [7, 15, 2];
  const options = {
    colors: COLORS,
    labels: ["Paga", "Em aberto", "Vencida"],
    dataLabels: {
      formatter: function (value, opts) {
        return opts.w.config.series[opts.seriesIndex];
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
          return valores[seriesIndex].toLocaleString("pt-BR", {
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

  return (
    <CardDashboard title={"Despesa"} subtitle={"Quantidade x Situação"}>
      <Chart options={options} series={series} type="pie" />
    </CardDashboard>
  );
};

export default DashboardPieDespesa;
