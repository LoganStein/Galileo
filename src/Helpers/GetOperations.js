async function GetOperations(acctID, hash) {
  const StellarSdk = require("stellar-sdk");
  const server = new StellarSdk.Server("https://horizon.stellar.org");
  let ops = await server
    .operations()
    .forAccount(acctID)
    .limit(50)
    .order("desc")
    .call();
  // console.log("API CALL");
  // console.log(ops);
  return ops.records;
}
export default GetOperations;
