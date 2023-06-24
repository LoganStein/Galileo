import React, { useEffect, useState } from "react";
import "../CSS/Trade.css";
import Transaction from "./Transaction";
import GetOperations from "../Helpers/GetOperations";
import Filter from "./Filter";

function Trades(props) {
  const [transactions, setTransactions] = useState([]);
  const [toDisplay, setToDisplay] = useState(50);
  const [ops, setOps] = useState([]);
  const [memos, setMemos] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const unsupported = [
    "change_trust",
    "create_claimable_balance",
    "set_trust_line_flags",
    "clawback",
    // "manage_sell_offer",
    // "manage_buy_offer",
  ];

  useEffect(() => {
    setOps(props.ops);
    console.log("my ops", ops);
  }, [props.ops]);

  useEffect(() => {
    // console.log("useEffect", ops);
    let i = 0;
    (async () => {
      let temp = [];
      for (let i = 0; i < toDisplay; i++) {
        // console.log("adding transaction");
        // only perform if this operation is supported
        if (ops[i]) {
          if (!unsupported.includes(ops[i].type)) {
            let token = ops[i].asset_code;
            let poolAsset1;
            let poolAsset2;
            let shares;
            let source;
            let dest;
            let selling_token;
            let buying_token;
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
              if (ops[i].buying_asset_type !== "native") {
                token = ops[i].buying_asset_code;
              } else {
                token = "XLM";
              }
              if (ops[i].selling_asset_type !== "native") {
                selling_token = ops[i].selling_asset_code;
              } else {
                selling_token = "XLM";
              }
              price = ops[i].price;
              issuer = ops[i].selling_asset_issuer;
            } else if (ops[i].type == "manage_sell_offer") {
              if (ops[i].selling_asset_type !== "native") {
                token = ops[i].selling_asset_code;
              } else {
                token = "XLM";
              }
              buying_token = ops[i].buying_asset_code;
              price = ops[i].price;
              issuer = ops[i].buying_asset_issuer;
              selling_token = token;
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
                buying_asset={buying_token}
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
      }
      setTransactions(temp);
      // console.log("useEffect", temp);
    })();
  }, [toDisplay, ops]);
  return (
    <div>
      <h1>Trades</h1>
      {/* filter icon */}
      <span
        onClick={() => {
          let toggleFilter = showFilter;
          setShowFilter(!toggleFilter);
        }}
      >
        F
      </span>
      {showFilter ? <Filter /> : <></>}
      {transactions}
      <button
        id="showMore"
        onClick={(e) => {
          let curDisp = toDisplay;
          setToDisplay(curDisp + 50);
          (async () => {
            let more_ops = await GetOperations(props.acctID, toDisplay);
            setOps(more_ops);
          })();
        }}
      >
        Show More
      </button>
    </div>
  );
}

export default Trades;
