import React, { useState } from "react";

function Asset(props) {
  const [displaySats, setDisplaySats] = useState(true);
  if (props.assetCode === "BTC" && displaySats) {
    return (
      <div className="Asset">
        <h4>{props.assetCode || "..."}</h4>
        <p
          className="clickable"
          onClick={() => {
            setDisplaySats(!displaySats);
          }}
        >
          {(props.amount * 100000000).toLocaleString()} sats
        </p>
        <p>${Number(props.value.toFixed(2)).toLocaleString("en-US")} USD</p>
      </div>
    );
  } else {
    return (
      <div className="Asset">
        <h4>{props.assetCode || "..."}</h4>
        <p
          className="clickable"
          onClick={() => {
            setDisplaySats(!displaySats);
          }}
        >
          {props.amount || 215}
        </p>
        <p>${Number(props.value.toFixed(2)).toLocaleString("en-US")} USD</p>
      </div>
    );
  }
}

export default Asset;
