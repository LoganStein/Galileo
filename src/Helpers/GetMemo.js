async function GetMemo(hash) {
  const StellarSdk = require("stellar-sdk");
  const server = new StellarSdk.Server("https://horizon.stellar.org");
  const trans = await server.transactions().transaction(hash).call();
  return trans.memo;
}
export default GetMemo;
