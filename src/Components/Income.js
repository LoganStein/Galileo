import React, { useState, useEffect, useContext } from "react";
import GetAssetValue from "../Helpers/GetAssetValue";
import GetIncome from "../Helpers/GetIncome";
import { TotalContext } from "../Pages/Account_Dash";

function Income(props) {
  const [hr, setHr] = useState(0);
  const [day, setDay] = useState(0);
  const [month, setMonth] = useState(0);
  const totalContext = useContext(TotalContext);
  useEffect(() => {
    // console.log("income", totalContext.income);
    let incomes = GetIncome(props.ops, props.acctID);
    // console.log("income:", incomes);
    (async () => {
      let hrly = 0;
      let daily = 0;
      for (let i = 0; i < incomes.hr.length; i++) {
        hrly += await GetAssetValue(
          incomes.hr[i].asset,
          incomes.hr[i].issuer,
          incomes.hr[i].amount
        );
      }
      for (let i = 0; i < incomes.day.length; i++) {
        daily += await GetAssetValue(
          incomes.day[i].asset,
          incomes.day[i].issuer,
          incomes.day[i].amount
        );
      }
      daily += hrly * 24;
      setHr(Number(hrly).toFixed(4));
      setDay(Number(daily).toFixed(4));
      setMonth(Number(daily * 30).toFixed(4));
    })();
  }, [props.ops]);

  return (
    <div className="assets-container">
      <h2>
        Income <i>UNRELIABLE</i>
      </h2>
      <div className="assets-header">
        <p>$/hr</p>
        <p>$/day</p>
        <p>$/month</p>
      </div>
      <div className="Asset">
        <p>${hr}</p>
        <p>${day}</p>
        <p>${month}</p>
      </div>
    </div>
  );
}

export default Income;
