import React, { useEffect, useState, useContext } from "react";
import GetOperations from "../Helpers/GetOperations";
import "../CSS/Trade.css";
import Transaction from "./Transaction";
import GetMemo from "../Helpers/GetMemo";
import { mainContext } from "../Pages/Account_Dash_E";

function Trades(props) {
  const context = useContext(mainContext);
  console.log(context.mainState.ops);
  const [transactions, setTransactions] = useState([]);
  const unsupported = [
    "change_trust",
    "claim_claimable_balance",
    "create_claimable_balance",
    "manage_sell_offer",
  ];
  useEffect(() => {
    let i = 0;
    let ops = context.mainContext.ops;
    for (let i = 0; i < ops.length; i++) {
      if (!unsupported.includes(ops[i].type)) {
        //get memo

        let token = ops[i].asset_code;
        let poolAsset1;
        let poolAsset2;
        let shares;

        if (ops[i].type == "liquidity_pool_deposit") {
          let poolReserves = ops[i].reservers_max;
          shares = ops[i].shares_received;
          if (poolReserves[0].asset != "native") {
            poolAsset1 = poolReserves[0].asset.substring(
              0,
              poolReserves[0].asset.indexOf(":")
            );
          } else {
            poolAsset1 = "XLM";
          }
          if (poolReserves[1].asset != "native") {
            poolAsset2 = poolReserves[1].asset.substring(
              0,
              poolReserves[0].substring.indexOf(":")
            );
          } else {
            poolAsset2 = "XLM";
          }
        } else if (ops[i].type == "liquidity_pool_withdraw") {
          let poolReserves = ops[i].reserves_min;
          shares = ops[i].shares;
          if (poolReserves[0].asset != "native") {
            poolAsset1 = poolReserves[0].asset.substring(
              0,
              poolReserves[0].asset.indexOf(":")
            );
          } else {
            poolAsset1 = "XLM";
          }
          if (poolReserves[1].asset != "native") {
            poolAsset2 = poolReserves[1].asset.substring(
              0,
              poolReserves[1].asset.indexOf(":")
            );
          } else {
            poolAsset2 = "XLM";
          }
        }
        if (ops[i].asset_type == "native") {
          token = "XLM";
        }
      }
    }
  }, []);
  return (
    <div>
      <h1>Trades</h1>
      {transactions}
    </div>
  );
}

export default Trades;
