import "../dashboards.css"
import React from "react";

export const CardDashboard = ({ title, subtitle, children }) => {
  return (
    <div className="Card" >
      <div className="CardTitle" >
        <span className="Title" >{title}</span>
      </div>
      <div>
        <span className="Subtitle" >{subtitle}</span></div>
      <div className="CardChildren" >{children}</div>
    </div>
  );
};

export default CardDashboard;
