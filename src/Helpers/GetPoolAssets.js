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
  // console.log("API CALL");
  // console.count();
  return assetPair;
}

export default GetPoolAssets;
