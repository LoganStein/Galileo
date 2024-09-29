/**
 * Retrieves the asset pair from a Stellar liquidity pool given its ID.
 *
 * @param {string} id - The ID of the liquidity pool.
 * @returns {Promise<string>} A promise that resolves to a string representing the asset pair in the format "asset1/asset2".
 *
 * @example
 * const assetPair = await GetPoolAssets("abcdef123456");
 * console.log(assetPair); // Outputs: "XLM/USDC"
 */
async function GetPoolAssets(id) {
  const StellarSdk = require("stellar-sdk");
  const server = new StellarSdk.Server("https://horizon.stellar.org");
  const resp = await server.liquidityPools().liquidityPoolId(id).call();
  let asset1 = "...";
  let asset2 = "...";
  if (resp.reserves[0].asset != "native") {
    asset1 = resp.reserves[0].asset.substring(
      0,
      resp.reserves[0].asset.indexOf(":")
    );
  } else {
    asset1 = "XLM";
  }
  if (resp.reserves[1].asset != "native") {
    asset2 = resp.reserves[1].asset.substring(
      0,
      resp.reserves[1].asset.indexOf(":")
    );
  } else {
    asset2 = "XLM";
  }
  let assetPair = "/";

  assetPair = asset1 + "/" + asset2;
  return assetPair;
}

export default GetPoolAssets;
