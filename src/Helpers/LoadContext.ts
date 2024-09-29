import GetAssetValue from "./GetAssetValue";
import GetPoolAssets from "./GetPoolAssets";
import GetPoolValue from "./GetPoolValue";
import { AccountData } from "./Types";
// LoadContext takes in the data from the stellar api call and dispatches the ADD_ASSET action to the reducer to provide access to the account's asset data
/**
 * Loads the context by processing account data and dispatching actions to add assets.
 *
 * @param {AccountData} data - The account data containing balances and other information.
 * @param {Function} dispatch - The dispatch function to send actions to the store.
 *
 * This function iterates over the balances in the account data and performs the following:
 * - If the balance is greater than 0.0000001, it processes the balance.
 * - If the balance is part of a liquidity pool, it extracts the asset codes and dollar value of the pool shares,
 *   then dispatches an action to add the asset.
 * - If the balance is a simple asset with an asset code and issuer, it extracts the dollar value of the asset
 *   and dispatches an action to add the asset.
 *
 * The function handles special cases such as setting the asset code for lumens (native asset) to "XLM".
 */
export function LoadContext(data: AccountData, dispatch) {
  data.balances.forEach((bal) => {
    if (Number(bal.balance) > 0.0000001) {
      // only add non zero balances
      // value for liquidity pools
      if (bal.liquidity_pool_id != undefined) {
        // extracts Asset codes inside pool (ie. AQUA/USDC)
        let poolCode = "";
        GetPoolAssets(bal.liquidity_pool_id).then((val) => {
          poolCode = val;
        });
        // extracts dollar value of pool shares
        GetPoolValue(bal.liquidity_pool_id, Number(bal.balance)).then((val) => {
          dispatch({
            type: "ADD_ASSET",
            value: { code: poolCode, val: val, bal: Number(bal.balance) },
          });
        });
      } else {
        let assetCode = bal.asset_code;
        //   set asset code for lumens because stellar response just says "native"
        if (bal.asset_type === "native") {
          assetCode = "XLM";
        }
        //   extract dollar value of simple assets using liquidity pools with usdc in the helper function
        GetAssetValue(assetCode, bal.asset_issuer, Number(bal.balance)).then(
          (val) => {
            dispatch({
              type: "ADD_ASSET",
              value: {
                code: assetCode,
                issuer: bal.asset_issuer,
                val: val,
                bal: Number(bal.balance),
              },
            });
          }
        );
      }
    }
  });
}
