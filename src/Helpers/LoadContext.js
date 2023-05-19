import GetAssetValue from "./GetAssetValue";
import GetPoolAssets from "./GetPoolAssets";
import GetPoolValue from "./GetPoolValue";

export function LoadContext(data, dispatch) {
  data.balances.forEach((bal) => {
    if (bal.balance > 0.0000001) {
      // only add non zero balances
      // value for liquidity pools
      if (bal.liquidity_pool_id != undefined) {
        // extracts Asset codes inside pool (ie. AQUA/USDC)
        let poolCode = "";
        GetPoolAssets(bal.liquidity_pool_id).then((val) => {
          poolCode = val;
        });
        // extracts dollar value of pool shares
        GetPoolValue(bal.liquidity_pool_id, bal.balance).then((val) => {
          dispatch({
            type: "ADD_ASSET",
            value: { code: poolCode, val: val, bal: Number(bal.balance) },
          });
        });
      }
      let assetCode = bal.asset_code;
      //   set asset code for lumens because stellar response just says "native"
      if (bal.asset_type === "native") {
        assetCode = "XLM";
      }
      //   extract dollar value of simple assets using liquidity pools with usdc in the helper function
      GetAssetValue(assetCode, bal.asset_issuer, bal.balance).then((val) => {
        dispatch({
          type: "ADD_ASSET",
          value: {
            code: assetCode,
            val: val,
            bal: Number(bal.balance),
          },
        });
      });
    }
  });
}
