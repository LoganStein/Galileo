async function GetOperations(acctID, limit = 75) {
  const StellarSdk = require("stellar-sdk");
  const server = new StellarSdk.Server("https://horizon.stellar.org");
  let ops = await server
    .operations()
    .forAccount(acctID)
    .limit(limit)
    .order("desc")
    .call();
  return ops.records;
}
export default GetOperations;
