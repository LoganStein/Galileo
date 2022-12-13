import React, { useEffect, useState } from "react";
import GetOperations from "../Helpers/GetOperations";
import "../CSS/Trade.css";
import Transaction from "./Transaction";
import GetMemo from "../Helpers/GetMemo";
import GetIncome from "../Helpers/GetIncome";

function Trades(props) {
  const [transactions, setTransactions] = useState([]);
  const [toDisplay, setToDisplay] = useState(24);
  const [ops, setOps] = useState([]);
  const [memos, setMemos] = useState([]);
  const unsupported = [
    "change_trust",
    "create_claimable_balance",
    "manage_sell_offer",
    // "manage_buy_offer",
  ];

  useEffect(() => {
    setOps(props.ops);
  }, [props.ops]);

  useEffect(() => {
    let i = 0;
    (async () => {
      let temp = [];
      for (let i = 0; i < toDisplay; i++) {
        // only perform this is the operation is supported
        console.log(ops);
        if (!unsupported.includes(ops[i].type)) {
          let token = ops[i].asset_code;
          let poolAsset1;
          let poolAsset2;
          let shares;
          let source;
          let dest;
          let selling_token;
          let price;
          let issuer = ops[i].asset_issuer;
          if (ops[i].type == "payment") {
            source = ops[i].from;
            dest = ops[i].to;
          } else if (ops[i].type == "claim_claimable_balance") {
            source = ops[i].source_account;
            console.log("op!", ops[i]);
          } else if (ops[i].type == "liquidity_pool_deposit") {
            let poolReserves = ops[i].reserves_max;
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
                poolReserves[1].asset.indexOf(":")
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
          } else if (ops[i].type == "manage_buy_offer") {
            console.log("operation", ops[i]);
            console.log(
              "buying",
              ops[i].buying_asset_code,
              "with",
              ops[i].selling_asset_code,
              "at",
              ops[i].price,
              ops[i].buying_asset_code,
              "/",
              ops[i].selling_asset_code
            );
            token = ops[i].buying_asset_code;
            selling_token = ops[i].selling_asset_code;
            price = ops[i].price;
            issuer = ops[i].selling_asset_issuer;
          }
          if (ops[i].asset_type == "native") {
            token = "XLM";
          }
          let srcToken;
          if (ops[i].source_asset_type == "native") {
            srcToken = "XLM";
          } else {
            srcToken = ops[i].source_asset_code;
          }
          temp.push(
            <Transaction
              key={i}
              type={ops[i].type}
              amount={ops[i].amount}
              asset={token}
              selling_asset={selling_token}
              price={price}
              issuer={issuer}
              time={ops[i].created_at}
              memo={memos[i]}
              acctID={props.acctID}
              srcAcct={source}
              destAcct={dest}
              srcAsset={srcToken}
              poolAsset1={poolAsset1}
              poolAsset2={poolAsset2}
              poolID={ops[i].liquidity_pool_id}
              poolShares={shares}
              transHash={ops[i].transaction_hash}
            />
          );
        }
      }
      setTransactions(temp);
    })();
  }, [toDisplay, ops, memos]);
  return (
    <div>
      <h1>Trades</h1>
      {transactions}
      <button
        id="showMore"
        onClick={(e) => {
          // console.log("showing more");
          setToDisplay(48);
          document.getElementById("showMore").classList.add("hidden");
        }}
      >
        Show More
      </button>
    </div>
  );
}

export default Trades;
