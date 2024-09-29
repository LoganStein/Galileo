/**
 * Fetches operations for a given Stellar account in descending chronological order (most recent first).
 *
 * @param {string} acctID - The ID of the Stellar account to fetch operations for.
 * @param {number} [limit=200] - The maximum number of operations to fetch. Defaults to 200.
 * @returns {Promise<Array>} A promise that resolves to an array of operation records.
 */
async function GetOperations(acctID, limit = 200) {
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
