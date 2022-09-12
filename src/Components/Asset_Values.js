import React, { useEffect } from "react";
import Asset from "./Asset";

function Asset_Values(props) {
  let assets = [];
  console.log("dude", assets)
  
  // useEffect(() => {
  if (Object.keys(props.acct_data).length != 0) {
    props.acct_data.balances.sort((a, b) => b.balance - a.balance);
    let i = 0;
    props.acct_data.balances.forEach((balance) => {
      // show non zero balance assets
      if (balance.balance > 0.0000001) {
        if (
          balance.asset_type == "credit_alphanum4" ||
          balance.asset_type == "credit_alphanum12"
        ) {
          //assets
          assets.push(
            <Asset
              key={Number(i++).toString()}
              assetCode={balance.asset_code}
              amount={balance.balance}
              assetIssuer={balance.asset_issuer}
              pool={false}
            />
          );
        } else if (balance.asset_type == "native") {
          // lumens
          assets.push(
            <Asset
              key={Number(i++).toString()}
              assetCode={"XLM"}
              amount={balance.balance}
              pool={false}
            />
          );
        } else if (balance.asset_type == "liquidity_pool_shares") {
          assets.push(
            <Asset
              key={Number(i++).toString()}
              assetCode={"Liquidity Pool shares"}
              amount={balance.balance}
              poolID={balance.liquidity_pool_id}
              pool={true}
            />
          );
        }
      }
    });
  }
  // });
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
