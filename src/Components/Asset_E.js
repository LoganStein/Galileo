import React, { useContext, useEffect, useState } from "react";
import GetAssetValue from "../Helpers/GetAssetValue";
import GetPoolAssets from "../Helpers/GetPoolAssets";
import GetPoolValue from "../Helpers/GetPoolValue";
import { mainContext } from "../Pages/Account_Dash_E";

function Asset(props) {
  const context = useContext(mainContext);
  const [value, setValue] = useState(0);
  const [assetCode, setAssetCode] = useState("...");
  useEffect(() => {
    setAssetCode(props.assetCode);
    if (props.pool == false) {
      GetAssetValue(props.assetCode, props.assetIssuer, props.amount).then(
        (val) => {
          setValue(val.toFixed(2));
          //set elevated state (total) with total + val
          context.mainDispatch({ type: "ADD_VAL_TO_TOTAL", value: val });
          console.log("added $", val, " to context: ", context.mainState.value);
          // console.log(props.assetCode, val);
        }
      );
    } else if (props.pool == true) {
      GetPoolValue(props.poolID, props.amount).then((val) => {
        setValue(val.toFixed(2));
        //set elevated state (total) with total + val
        context.mainDispatch({ type: "ADD_VAL_TO_TOTAL", value: val });
        console.log("added $", val, " to context: ", context.mainState.value);
      });
      GetPoolAssets(props.poolID).then((assets) => {
        setAssetCode(assets);
      });
    }
  }, []);
  return (
    <div className="Asset">
      <h4>{assetCode || "..."}</h4>
      <p>{props.amount || 215}</p>
      <p>${Number(value).toLocaleString("en-US")} USD</p>
    </div>
  );
}

export default Asset;
