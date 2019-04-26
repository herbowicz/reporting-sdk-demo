import React from "react";

const Dashboard = props => {
  const { width, height, color, text } = props;
  return (
    <div
      style={{
        width: width || 600,
        height: height || 300,
        backgroundColor: color || "blue"
      }}
    >
      <h1>Dashboard boilerplate: {text}</h1>
    </div>
  );
};

export default Dashboard;
