import React, { useState } from "react";
import Chart from "../Components/Chart";

function Asset(props) {
  const [displaySats, setDisplaySats] = useState(true);
  var requestOptions = {
    method: "GET",
    redirect: "follow",
  };

  if (props.assetCode === "BTC") {
    return (
      <>
        <div
          className="Asset"
          onClick={() => {
            document
              .getElementById(props.assetCode + "AssetChart")
              .classList.toggle("hidden");
          }}
        >
          <h4>{props.assetCode || "..."}</h4>
          <p
            className="clickable"
            onClick={() => {
              setDisplaySats(!displaySats);
            }}
          >
            {displaySats
              ? (props.amount * 100000000).toLocaleString()
              : props.amount}{" "}
            sats
          </p>
          <p>${Number(props.value.toFixed(2)).toLocaleString("en-US")} USD</p>
        </div>
        <div
          id={props.assetCode + "AssetChart"}
          style={{ width: "90%" }}
          className="hidden"
        >
          <Chart
            key={props.assetCode + "AssetChart"}
            margin={{ top: 30, bottom: 30, left: 60, right: 30 }}
            data={[
              { date: new Date("2024-05-14"), value: 61524.950858 },
              { date: new Date("2024-05-15"), value: 66166.565942 },
              { date: new Date("2024-05-16"), value: 65224.896289 },
              { date: new Date("2024-05-17"), value: 66789.241129 },
              { date: new Date("2024-05-18"), value: 66893.026684 },
              { date: new Date("2024-05-19"), value: 66209.507304 },
              { date: new Date("2024-05-20"), value: 71095.111211 },
            ]}
            height={"200px"}
            width={"50%"}
          />
        </div>
      </>
    );
  } else {
    return (
      <div className="Asset">
        <h4>{props.assetCode || "..."}</h4>
        <p>{props.amount || 215}</p>
        <p>${Number(props.value.toFixed(2)).toLocaleString("en-US")} USD</p>
      </div>
    );
  }
}

export default Asset;
