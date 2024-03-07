async function GetMemo(hash) {
  const StellarSdk = require("stellar-sdk");
  const server = new StellarSdk.Server("https://horizon.stellar.org");
  // console.log(hash);
  const trans = await server.transactions().transaction(hash).call();
  // console.log(trans);
  // console.log("API CALL");
  // console.count();
  // console.log(trans.memo);
  return trans.memo;
}
export default GetMemo;
