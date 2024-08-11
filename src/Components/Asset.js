import React, { useEffect, useState } from "react";
import Chart from "../Components/Chart";
import moment from "moment";

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
  var requestOptions = {
    method: "GET",
    redirect: "follow",
  };
  useEffect(() => {
    (async () => {
      let values = await fetch(
        `http://loganjstein.com:8080/${props.assetCode}/${
          props.assetIssuer || "native"
        }/${moment()
          .subtract(7, "days")
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
      // TODO: prepend current price so we have today's price too
      setAsset_Values(values);
      setPercentChange(getPercentChange(values));
    })();
  }, [props.assetCode, props.assetIssuer]);

  return (
    <>
      <div
        className="Asset clickable"
        onClick={() => {
          document
            .getElementById(props.assetCode + "AssetChart")
            .classList.toggle("hidden");
          console.log("SomethingImportant", Asset_Values);
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
          <p>Percent Change: {percentChange}% in the last 7 days</p>
          <p>
            {percentChange > 0 ? "Increased" : "Decreased"} portfolio value by $
            {"x"} in the last 7 days
          </p>
        </div>
      </div>
    </>
  );
}

export default Asset;
