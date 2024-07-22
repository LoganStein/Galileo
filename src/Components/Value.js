import React, { useEffect, useState, useContext } from "react";
import "../CSS/Value.css";
import { TotalContext } from "../Components/TotalContext";
import CircleChart from "./CircleChart";

function Value() {
  // fake data in case real data doesn't come through
  const data = [
    {
      id: "make",
      label: "make",
      value: 469,
      color: "hsl(104, 70%, 50%)",
    },
    {
      id: "c",
      label: "c",
      value: 56,
      color: "hsl(288, 70%, 50%)",
    },
    {
      id: "python",
      label: "python",
      value: 564,
      color: "hsl(179, 70%, 50%)",
    },
    {
      id: "sass",
      label: "sass",
      value: 207,
      color: "hsl(46, 70%, 50%)",
    },
    {
      id: "rust",
      label: "rust",
      value: 453,
      color: "hsl(348, 70%, 50%)",
    },
  ];

  const totalContext = useContext(TotalContext);

  const realData = totalContext.totalState.assets.map((asset) => {
    return {
      id: asset.code,
      label: asset.code,
      value: asset.val.toFixed(2),
    };
  });

  let totalNum = totalContext.totalState.total.toFixed(2);
  let str = Number(totalNum).toLocaleString("en-US");
  return (
    <div className="value-container">
      <h1>${str || "Acct Value"}</h1>
      <CircleChart data={realData ? realData : data} />
    </div>
  );
}

export default Value;
