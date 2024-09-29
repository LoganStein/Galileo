/**
 * Fetches the latest transactions for a given Stellar account.
 *
 * @param {string} acctID - The ID of the Stellar account to fetch transactions for.
 * @returns {Promise<Object>} A promise that resolves to the response object containing the transactions.
 *
 * @example
 * GetTransactions('GCFX4Q2Q3J2Q3J2Q3J2Q3J2Q3J2Q3J2Q3J2Q3J2Q3J2Q3J2Q3J2Q3J2Q3J2')
 *   .then(transactions => console.log(transactions))
 *   .catch(error => console.error(error));
 */
async function GetTransactions(acctID) {
  const StellarSdk = require("stellar-sdk");
  const server = new StellarSdk.Server("https://horizon.stellar.org");
  const resp = await server
    .transactions()
    .forAccount(acctID)
    .order("desc")
    .limit(10)
    .call();
  return resp;
}

export default GetTransactions;
