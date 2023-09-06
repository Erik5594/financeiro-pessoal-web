import "./dashboards.css";
import DashboardPieDespesa from "./despesas/DashboardPieDespesa";
import React from "react";

const styles = {
  card: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    width: "300px",
  },
};

export const DefaultDashboard = () => {
  return (
    <div className="Cards">
      <DashboardPieDespesa />
      <DashboardPieDespesa />
      <DashboardPieDespesa />
      <DashboardPieDespesa />
      <DashboardPieDespesa />
    </div>
  );
};

export default DefaultDashboard;
