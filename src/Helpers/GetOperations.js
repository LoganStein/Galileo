async function GetOperations(acctID, limit = 200) {
  const StellarSdk = require("stellar-sdk");
  const server = new StellarSdk.Server("https://horizon.stellar.org");
  let ops = await server
    .operations()
    .forAccount(acctID)
    .limit(limit)
    .order("desc")
    .call();
  console.log(ops.records);
  return ops.records;
}
export default GetOperations;
