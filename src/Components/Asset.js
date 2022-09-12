import React, { useContext, useEffect, useState } from "react";
import GetAssetValue from "../Helpers/GetAssetValue";
import GetPoolAssets from "../Helpers/GetPoolAssets";
import GetPoolValue from "../Helpers/GetPoolValue";
import { TotalContext } from "../Pages/Account_Dash";

// check for usdc and use the amount as the value because there is no usdc:usdc LP to calculate value from

function Asset(props) {
  const totalContext = useContext(TotalContext);
  const [value, setValue] = useState(0);
  const [assetCode, setAssetCode] = useState("...");
  useEffect(() => {
    setAssetCode(props.assetCode);
    if (props.pool == false) {
      // asset is not LP shares
      if (props.assetCode != "USDC") {
        // usdc doesnt have an lp to get value from
        GetAssetValue(props.assetCode, props.assetIssuer, props.amount).then(
          (val) => {
            setValue(val.toFixed(2));
            //set elevated state (total) with total + val
            totalContext.totalDispatch({
              type: "ADD_VAL_TO_TOTAL",
              value: val,
            });
            // console.log(props.assetCode, val);
          }
        );
      } else {
        // instead value is just the amount (1:1 with dollar)
        setValue(Number(props.amount).toFixed(2));
        let val = Number(props.amount);
        totalContext.totalDispatch({
          type: "ADD_VAL_TO_TOTAL",
          value: val,
        });
      }
    } else if (props.pool == true) {
      // asset is LP shares
      GetPoolValue(props.poolID, props.amount).then((val) => {
        setValue(val.toFixed(2));
        //set elevated state (total) with total + val
        totalContext.totalDispatch({ type: "ADD_VAL_TO_TOTAL", value: val });
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
