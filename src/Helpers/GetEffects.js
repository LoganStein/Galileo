// async function GetEffects(acctID, limit = 15) {
//   const StellarSdk = require("stellar-sdk");
//   const server = new StellarSdk.Server("https://horizon.stellar.org");
//   let effects = await server
//     .effects()
//     .forAccount(acctID)
//     .order("desc")
//     .limit(limit)
//     .call();
//   console.log("something API CALL");
//   // console.count();
//   return effects.records;
// }
// export default GetEffects;

async function GetEffects(acctID, limit = 15) {
  const resp = await fetch(
    `https://horizon.stellar.org/accounts/${acctID}/effects?order=desc&limit=${limit}`
  );
  const data = await resp.json();
  return data;
}
export default GetEffects;
