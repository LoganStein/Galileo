import GetAssetValue from "./GetAssetValue";

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
