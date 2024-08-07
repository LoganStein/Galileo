/*
  This function gets the dollar value of an asset based on the account's holding. It uses one API call everytime it's called.
*/

async function GetAssetValue(assetCode, assetIssuer, amount) {
  let total;
  let ASSET = "";
  if (assetCode == "XLM") {
    ASSET = "native";
  } else {
    ASSET = assetCode + ":" + assetIssuer;
  }
  // asset:issuer codes for usdc and yusdc
  const USDC = "USDC:GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN";
  const yUSDC =
    "yUSDC:GDGTVWSM4MGS4T7Z6W4RPWOCHE2I6RDFCIFZGS3DOA63LWQTRNZNTTFF";

  const StellarSdk = require("stellar-sdk");
  const server = new StellarSdk.Server("https://horizon.stellar.org");

  let resp;
  let reserves;

  if (
    assetCode == "ICE" ||
    assetCode == "governICE" ||
    assetCode == "upvoteICE" ||
    assetCode == "downvoteICE"
  ) {
    return 0;
  }

  if (assetCode != "yBTC" && assetCode != "yETH" && assetCode != "USDC") {
    resp = await server.liquidityPools().forAssets([ASSET, USDC]).call();
    // console.log("resp", resp);
    if (resp.records.length == 0) {
      return 0;
    }
    reserves = resp.records[0].reserves; // getting empty response for pool with ybtc
  } else {
    // hard code yBTC liquidity pool because records.reserves wasn't working for yBTC
    if (assetCode == "yBTC") {
      resp = await server
        .liquidityPools()
        .liquidityPoolId(
          "62bb53db3efc980b673c795fc8835675a59f230ecab2014e5dddc5e2f03d0833"
        )
        .call();
      reserves = resp.reserves;
    } else if (assetCode == "USDC") {
      // usdc dollar value is 1:1 with USD
      return Number(amount);
    } else if (assetCode === "yETH") {
      // hard code yETH liquidity pool because records.reserves wasn't working for yETH
      resp = await server
        .liquidityPools()
        .liquidityPoolId(
          "f653e598a9e39d4d5a94b3357811c8015eadc5c2de3634a6d6decb7b5c502a65"
        )
        .call();
      reserves = resp.reserves;
    }
  }
  try {
    if (reserves[1].asset == USDC || reserves[1].asset == yUSDC) {
      let val = (reserves[1].amount / reserves[0].amount) * amount;
      total = val;
    } else {
      let val = (reserves[0].amount / reserves[1].amount) * amount;
      total = val;
    }
  } catch (err) {
    console.log("err", err, reserves, assetCode);
    return 0;
  }
  // console.log("API CALL");
  return total;
}
export default GetAssetValue;
