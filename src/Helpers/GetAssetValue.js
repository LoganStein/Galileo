async function GetAssetValue(assetCode, assetIssuer, amount) {
  let total;
  let ASSET = "";
  if (assetCode == "XLM") {
    ASSET = "native";
  } else {
    ASSET = assetCode + ":" + assetIssuer;
  }
  const USDC = "USDC:GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN";
  const yUSDC =
    "yUSDC:GDGTVWSM4MGS4T7Z6W4RPWOCHE2I6RDFCIFZGS3DOA63LWQTRNZNTTFF";
  const StellarSdk = require("stellar-sdk");
  const server = new StellarSdk.Server("https://horizon.stellar.org");
  let resp;
  let reserves;
  if (assetCode != "yBTC" && assetCode != "yETH" && assetCode != "USDC") {
    resp = await server.liquidityPools().forAssets([ASSET, USDC]).call();
    reserves = resp.records[0].reserves; // getting empty response for pool with ybtc
  } else {
    if (assetCode == "yBTC") {
      // console.log("ybtc using id");
      resp = await server
        .liquidityPools()
        .liquidityPoolId(
          "62bb53db3efc980b673c795fc8835675a59f230ecab2014e5dddc5e2f03d0833"
        )
        .call();
      // console.log(resp.reserves[0]);
      reserves = resp.reserves;
    } else if (assetCode == "USDC") {
      return Number(amount);
    } else {
      resp = await server
        .liquidityPools()
        .liquidityPoolId(
          "f653e598a9e39d4d5a94b3357811c8015eadc5c2de3634a6d6decb7b5c502a65"
        )
        .call();
      // console.log(resp);
      reserves = resp.reserves;
    }
  }

  if (reserves[1].asset == USDC || reserves[1].asset == yUSDC) {
    let val = (reserves[1].amount / reserves[0].amount) * amount;
    // console.log("val", val, ASSET);
    total = val;
  } else {
    let val = (reserves[0].amount / reserves[1].amount) * amount;
    // console.log("val", val, ASSET);
    total = val;
  }
  console.log("API CALL");
  // console.count();
  return total;
}
export default GetAssetValue;
