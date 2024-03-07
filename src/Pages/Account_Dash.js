import React from "react";
import Header from "../Components/Header";
import "../CSS/Dashboard.css";
import Value from "../Components/Value";
import Chart from "../Components/Chart";
import Asset_Values from "../Components/Asset_Values";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useReducer } from "react";
import Income from "../Components/Income";
import Trades from "../Components/Trades";
import GetOperations from "../Helpers/GetOperations";
import {
  TotalContext,
  initialState,
  reducer,
} from "../Components/TotalContext";
import { FetchAccount } from "../Helpers/LoadAccount";
import { LoadContext } from "../Helpers/LoadContext";
import DexTrades from "../Components/DexTrades";

function Account_Dash() {
  const location = useLocation();
  const [addressState, setAddress] = useState(location.state.address);
  const [stellarResp, setResp] = useState({});
  const [ops, setOps] = useState([]);
  const navigate = useNavigate();

  const [total, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    // set values to empty before getting real data
    let accountID = "";
    dispatch({ type: "RESET", value: 0 });
    // var StellarSdk = require("stellar-sdk");
    // var server = new StellarSdk.Server("https://horizon.stellar.org");

    // some quick address lookup's instead of using the full address
    switch (addressState.toLowerCase()) {
      case "me":
        accountID = "GDDQHQEY65CGGDLR7Z5C437QNGNBYMXZL6RFAZ6FBGKY5V66D5YE2S7V";
        setAddress(accountID);
        break;
      case "mel":
        accountID = "GDRG7OKIRUGGVSYCRX65VFUCBNOF7PYVCII7UIDUS65Q7TOHFOEWQC2F";
        setAddress(accountID);
        break;
      case "dad":
        accountID = "GBT5N42UF5RU3C5G5GB5CD7JKMV77TGWUZN63UDZC6HMYZCR6D7YQK46";
        setAddress(accountID);
        break;
      case "whale":
        accountID = "GCB426VZ6DYX576HLZTA2X2C3CJT6ZDFNHCIIULPZYUNWC55QRFOFEI4";
        setAddress(accountID);
        break;
      case "earner":
        accountID = "GAC6AA2ADPOTPY2LUI7S27XKQZERQ2M5426N4OV6BIEN7TM64ABOSITA";
        setAddress(accountID);
        break;
      case "earner2":
        accountID = "GA2UEFPPYCANJSEI4X2BAUEJWF7DHXQWEDCAMEJGZ6ZNKTW2YSZXXQMK";
        setAddress(accountID);
        break;
      case "sdf enterprise":
        accountID = "GDUY7J7A33TQWOSOQGDO776GGLM3UQERL4J3SPT56F6YS4ID7MLDERI4";
        setAddress(accountID);
        break;
      case "sdf marketing":
        accountID = "GBI5PADO5TEDY3R6WFAO2HEKBTTZS4LGR77XM4AHGN52H45ENBWGDFOH";
        setAddress(accountID);
        break;
      default:
        accountID = addressState;
        break;
    }
    // loads the account and data we need
    (async () => {
      // wait for helper function to get account data
      let data = await FetchAccount(accountID);
      // if the response status is 400 (bad request) go back to search page
      if (data.status === 400) {
        alert("The wallet does not exist");
        navigate("/");
      }
      // set state with account data from helper function
      setResp(data);
      // set the account ID in the context
      dispatch({ type: "SET_ACCT", value: accountID });
      // use helper function to set context of balances and values
      LoadContext(data, dispatch);
      // set operations with helper function
      let opsTemp = await GetOperations(accountID);
      setOps(opsTemp);
    })();
  }, [addressState]);

  return (
    <TotalContext.Provider
      value={{ totalState: total, totalDispatch: dispatch }}
    >
      <div className="dash-container">
        <Header key={"1"} setAddress={setAddress} />
        <div className="account">
          <h2>
            <a
              title="View on Stellar Expert"
              href={
                "https://stellar.expert/explorer/public/account/" + addressState
              }
            >
              {addressState || "GEXAMPLE..."}
            </a>
          </h2>
        </div>
        <div className="val-chart">
          <Value key={"2"} dollarValue={0} balances={stellarResp.balances} />
          <Chart key={"3"} />
        </div>
        <div className="Assets">
          <Asset_Values key={"4"} acct_data={stellarResp} />
        </div>
        <div className="Income">
          <Income key={"5"} ops={ops} acctID={addressState} />
        </div>
        <div className="Trades">
          <Trades key={"6"} acctID={addressState} ops={ops} />
        </div>
        <div>
          <DexTrades />
        </div>
      </div>
    </TotalContext.Provider>
  );
}

export default Account_Dash;
