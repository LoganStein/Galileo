async function GetEffects(acctID) {
  const StellarSdk = require("stellar-sdk");
  const server = new StellarSdk.Server("https://horizon.stellar.org");
  let effects = await server
    .effects()
    .forAccount(acctID)
    .order("desc")
    .limit(15)
    .call();
  console.log("API CALL");
  // console.count();
  return effects.records;
}
export default GetEffects;
