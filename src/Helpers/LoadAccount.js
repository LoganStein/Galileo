async function LoadAccount(acctID) {
  const StellarSdk = require("stellar-sdk");
  const server = new StellarSdk.Server("https://horizon.stellar.org");
  if (acctID.length != 56) {
    return;
  }
  let resp = await server.loadAccount(acctID).catch(function (err) {
    console.error(err);
  });
  console.log("API Call Loading Account: ", acctID);
  return resp;
}
export default LoadAccount;
