export async function LoadAccount(acctID) {
  const StellarSdk = require("stellar-sdk");
  const server = new StellarSdk.Server("https://horizon.stellar.org");
  let resp = await server.loadAccount(acctID).catch(function (err) {
    console.error(err);
  });
  // console.log("API CALL");
  return resp;
}

export async function FetchAccount(acctID) {
  const resp = await fetch("https://horizon.stellar.org/accounts/" + acctID);
  const data = await resp.json();
  console.log("hmm", data);
  return data;
}
