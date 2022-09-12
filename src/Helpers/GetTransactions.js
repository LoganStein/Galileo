async function GetTransactions(acctID) {
  const StellarSdk = require("stellar-sdk");
  const server = new StellarSdk.Server("https://horizon.stellar.org");
  const resp = await server
    .transactions()
    .forAccount(acctID)
    .order("desc")
    .limit(10)
    .call();
  console.log("API CALL");
  // console.count();
  return resp;
}

export default GetTransactions;
