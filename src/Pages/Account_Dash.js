import React from "react";
import Header from "../Components/Header";
import "../CSS/Dashboard.css";
import Value from "../Components/Value";
import Chart from "../Components/Chart";
import Asset_Values from "../Components/Asset_Values";
import { useLocation } from "react-router-dom";
import {
  useState,
  useEffect,
  useContext,
  createContext,
  useReducer,
} from "react";
import Income from "../Components/Income";
import Trades from "../Components/Trades";
import ClipAddr from "../Helpers/ClipAddr";
import GetOperations from "../Helpers/GetOperations";
import LoadAccount from "../Helpers/LoadAccount";
export const TotalContext = createContext();

function Account_Dash() {
  const location = useLocation();
  const [addressState, setAddress] = useState(location.state.address);
  const [stellarResp, setResp] = useState({});
  const [ops, setOps] = useState([]);
  const [comps, setComps] = useState([]);

  const initialState = 0;
  const reducer = (state, action) => {
    switch (action.type) {
      case "ADD_VAL_TO_TOTAL":
        return state + action.value;
      case "RESET":
        return 0;
      default:
        return state;
    }
  };

  const [total, dispatch] = useReducer(reducer, initialState);
  useEffect(() => {
    let accountID = "";
    dispatch({ type: "RESET", value: 0 });
    switch (addressState) {
      case "me":
        accountID = "GDDQHQEY65CGGDLR7Z5C437QNGNBYMXZL6RFAZ6FBGKY5V66D5YE2S7V";
        setAddress(accountID);
        break;
      default:
        break;
    }
    // block from stellar api docs
    let StellarSdk = require("stellar-sdk");
    let server = new StellarSdk.Server("https://horizon.stellar.org");
    server
      .loadAccount(addressState)
      .then((resp) => {
        setResp(resp);
      })
      .catch((err) => {
        console.log(err);
        alert(`${addressState} does not exist`);
      });
    // end stellar api docs block
    (async () => {
      let opsTemp = await GetOperations(addressState);
      setOps(opsTemp);
    })();
    // use addressState to query the stellar API? to get account data
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
      </div>
    </TotalContext.Provider>
  );
}

export default Account_Dash;
