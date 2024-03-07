import { React, useContext } from "react";
import Asset from "./Asset";
import { TotalContext } from "../Components/TotalContext";

function Asset_Values() {
  let assets = [];
  const totalContext = useContext(TotalContext);
  if (totalContext.totalState.assets.length != 0) {
    totalContext.totalState.assets.sort((a, b) => b.val - a.val);
    let i = 0;
    totalContext.totalState.assets.forEach((balance) => {
      //assets
      assets.push(
        <Asset
          key={Number(i++).toString()}
          assetCode={balance.code}
          amount={balance.bal}
          value={balance.val}
          pool={false}
        />
      );
    });
  }

  return (
    <div className="assets-container" id="testing">
      <div className="assets-header">
        <h4>Asset</h4>
        <h4>Amount</h4>
        <h4>Value</h4>
      </div>
      {assets}
    </div>
  );
}

export default Asset_Values;
