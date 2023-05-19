import React from "react";

function Asset(props) {
  return (
    <div className="Asset">
      <h4>{props.assetCode || "..."}</h4>
      <p>{props.amount || 215}</p>
      <p>${Number(props.value.toFixed(2)).toLocaleString("en-US")} USD</p>
    </div>
  );
}

export default Asset;
