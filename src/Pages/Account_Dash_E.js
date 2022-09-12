import React, { createContext, useEffect, useReducer, useState } from "react";
import { useLocation } from "react-router-dom";
import Header from "../Components/Header";
import Value from "../Components/Value";
import Chart from "../Components/Chart";
import Income from "../Components/Income";
import Trades from "../Components/Trades_E";
import "../CSS/Dashboard.css";
import Asset_Values from "../Components/Asset_Values";
import GetOperations from "../Helpers/GetOperations";
import LoadAccount from "../Helpers/LoadAccount";
export const mainContext = createContext();

function Account_Dash_E() {
  const location = useLocation();
  const [addressState, setAddress] = useState(location.state.address);
  const [stellarResp, setResp] = useState({});
  const initialState = { value: 0, acctID: "abc", ops: [1, 2, 3] };
  const reducer = (state, action) => {
    switch (action.type) {
      case "ADD_VAL_TO_TOTAL":
        state.value += action.value / 2;
        return state;
      case "SET_ADDR_ID":
        state.acctID = action.acctID;
        // console.log("addr set to:", state.acctID);
        return state;
      case "GET_OPS":
        state.ops = action.arr;
        return state;
      case "RESET":
        state = { value: 0, acctID: "", ops: [] };
        // console.log("reset");
        return state;
      default:
        // console.log("cases not working");

        return state;
    }
  };
  const [main, dispatch] = useReducer(reducer, initialState);
  useEffect(() => {
    dispatch({ type: "RESET" });
    dispatch({ type: "SET_ADDR_ID", acctID: addressState });
    let ops = [];
    (async () => {
      ops = await GetOperations(addressState);
      dispatch({ type: "GET_OPS", arr: ops });
      let resp = await LoadAccount(addressState);
      setResp(resp);
    })();
  }, []);
  console.log(main);
  return (
    <mainContext.Provider value={{ mainState: main, mainDispatch: dispatch }}>
      <div className="dash-container">
        <Header key={"1"} />
        <div className="account">
          <h2>{addressState || "GEXAMPLE..."}</h2>
        </div>
        <div className="val-chart">
          <Value key={"2"} dollarValue={0} />
          <Chart key={"3"} />
        </div>
        <div className="Assets">
          <Asset_Values key={"4"} acct_data={stellarResp} />
        </div>
        <div className="Income">{/* <Income key={"5"} /> */}</div>
        <div className="Trades">{/* <Trades key={"6"} /> */}</div>
      </div>
    </mainContext.Provider>
  );
}

export default Account_Dash_E;
