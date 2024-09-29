import GetAssetValue from "./GetAssetValue";

/**
 * Retrieves the value of a liquidity pool based on the provided pool ID and owned shares.
 *
 * @param {string} id - The ID of the liquidity pool.
 * @param {number} ownedShares - The number of shares owned in the liquidity pool.
 * @returns {Promise<number>} - The calculated value of the owned shares in the liquidity pool.
 *
 * @example
 * const poolValue = await GetPoolValue('abcdef123456', 100);
 * console.log(poolValue); // Outputs the value of the owned shares in the liquidity pool
 */
async function GetPoolValue(id, ownedShares) {
  const StellarSdk = require("stellar-sdk");
  const server = new StellarSdk.Server("https://horizon.stellar.org");
  const resp = await server.liquidityPools().liquidityPoolId(id).call();
  let assetCode = "";
  let assetIssuer = "";
  if (resp.reserves[0].asset != "native") {
    // only parse the asset if it isnt xlm
    assetCode = resp.reserves[0].asset.substring(
      0,
      resp.reserves[0].asset.indexOf(":")
    );

    if (resp.reserves[0].asset != "native") {
      assetIssuer = resp.reserves[0].asset.substring(
        resp.reserves[0].asset.indexOf(":") + 1
      );
    }
  } else {
    // otherwise just pass xlm to get the value
    assetCode = "XLM";
  }
  const assetValue = await GetAssetValue(assetCode, assetIssuer, 1);
  const totalPoolValue = resp.reserves[0].amount * assetValue * 2;
  const retVal = totalPoolValue * (ownedShares / resp.total_shares);
  return retVal;
}
export default GetPoolValue;
