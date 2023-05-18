import React, { useContext, useEffect, useState } from "react";
import { TotalContext } from "../Components/TotalContext";

// check for usdc and use the amount as the value because there is no usdc:usdc LP to calculate value from

function Asset(props) {
  const totalContext = useContext(TotalContext);
  const [value, setValue] = useState(0);
  const [assetCode, setAssetCode] = useState("...");

  return (
    <div className="Asset">
      <h4>{props.assetCode || "..."}</h4>
      <p>{props.amount || 215}</p>
      <p>${Number(props.value.toFixed(2)).toLocaleString("en-US")} USD</p>
    </div>
  );
}

export default Asset;
