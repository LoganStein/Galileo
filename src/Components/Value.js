import React, { useEffect, useState, useContext } from "react";
import "../CSS/Value.css";
import { TotalContext } from "../Pages/Account_Dash";
import { mainContext } from "../Pages/Account_Dash_E";

function Value(props) {
  const totalContext = useContext(TotalContext);
  // Value is incorrect (doubled) in development but on build it works correctly
  let totalNum = (totalContext.totalState).toFixed(2);
  let str = Number(totalNum).toLocaleString("en-US");
  console.log("str", str);
  return (
    <div className="value-container">
      <h1>${str || "Acct Value"} USD</h1>
    </div>
  );
}

export default Value;
