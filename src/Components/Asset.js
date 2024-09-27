import React, { useEffect, useState } from "react";
import Chart from "../Components/Chart";
import moment from "moment";
import GetAssetValue from "../Helpers/GetAssetValue";

function getPercentChange(Asset_Values) {
  if (Asset_Values.length === 0) return 0;
  const startPrice = Asset_Values[0].value;
  const endPrice = Asset_Values[Asset_Values.length - 1].value;
  const percentChange = ((endPrice - startPrice) / startPrice) * 100;
  return percentChange.toFixed(2);
}

function Asset(props) {
  const [displaySats, setDisplaySats] = useState(true);
  const [Asset_Values, setAsset_Values] = useState([]);
  const [percentChange, setPercentChange] = useState(0);
  const [valueChange, setValueChange] = useState(0);
  const [classList, setClassList] = useState("Asset clickable");
  const [TimeFrame, setTimeFrame] = useState(7);
  var requestOptions = {
    method: "GET",
    redirect: "follow",
  };
  useEffect(() => {
    (async () => {
      const currentPrice = await GetAssetValue(
        props.assetCode,
        props.assetIssuer,
        1
      );

      let values = await fetch(
        `http://loganjstein.com:8080/${props.assetCode}/${
          props.assetIssuer || "native"
        }/${moment()
          .subtract(TimeFrame, "days")
          .startOf("day")
          .format("YYYY-MM-DD")}/${moment()
          .startOf("day")
          .format("YYYY-MM-DD")}`,
        requestOptions
      ).then((response) => response.json());

      values = values.map(({ date, usd_price }) => ({
        date: moment(date),
        value: Number(usd_price),
      }));
      values.push({
        date: moment(),
        value: Number(currentPrice),
      });
      setAsset_Values(values);
      setPercentChange(getPercentChange(values));
      setValueChange(
        values.length != 0
          ? (values[values.length - 1].value - values[0].value) * props.amount
          : 0
      );
    })();
    if (props.assetCode == "USDC") {
      setClassList("Asset");
    }
  }, [props.assetCode, props.assetIssuer, TimeFrame]);

  return (
    <>
      <div
        className={classList}
        onClick={() => {
          if (props.assetCode != "USDC") {
            document
              .getElementById(props.assetCode + "AssetChart")
              .classList.toggle("hidden");
          }
        }}
      >
        <h4>{props.assetCode || "..."}</h4>
        <p>
          {props.assetCode == "BTC" ? (
            <p
              style={{ position: "relative", zIndex: 1000 }}
              className="clickable"
              onClick={() => {
                setDisplaySats(!displaySats);
              }}
            >
              {displaySats
                ? (props.amount * 100000000).toLocaleString() + " sats"
                : props.amount}{" "}
            </p>
          ) : (
            props.amount
          )}
        </p>
        <p>${Number(props.value.toFixed(2)).toLocaleString("en-US")} USD</p>
      </div>
      <div id={props.assetCode + "AssetChart"} className="hidden asset-chart">
        <Chart
          key={props.assetCode + "AssetChart"}
          margin={{ top: 10, bottom: 10, left: 60, right: 0 }}
          data={Asset_Values}
          height={"40vh"}
          width={"70%"}
        ></Chart>
        <div className="asset-stats">
          <p>
            Percent Change: {percentChange > 0 ? "+" : ""}
            {percentChange}% in the last {TimeFrame} days
          </p>
          <p>
            {percentChange > 0 ? "Increased" : "Decreased"} portfolio value by $
            {valueChange.toLocaleString("en-US")} in the last {TimeFrame} days
          </p>
          <div className="chart-control">
            <p
              onClick={() => {
                let tmp_time = TimeFrame;
                setTimeFrame(tmp_time + 1);
              }}
            >
              Increase
            </p>
            <p
              onClick={() => {
                let tmp_time = TimeFrame;
                setTimeFrame(tmp_time - 1);
              }}
            >
              Decrease
            </p>
            <p onClick={() => setTimeFrame(7)}>Reset</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Asset;
