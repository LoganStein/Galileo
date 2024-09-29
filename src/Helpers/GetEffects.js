/**
 * Fetches the effects for a given Stellar account in descending chronological order (most recent first).
 *
 * @param {string} acctID - The ID of the Stellar account.
 * @param {number} [limit=15] - The maximum number of effects to retrieve. Defaults to 15.
 * @returns {Promise<Array>} A promise that resolves to an array of effect records.
 */
async function GetEffects(acctID, limit = 15) {
  const StellarSdk = require("stellar-sdk");
  const server = new StellarSdk.Server("https://horizon.stellar.org");
  let effects = await server
    .effects()
    .forAccount(acctID)
    .order("desc")
    .limit(limit)
    .call();
  // console.count();
  return effects.records;
}
export default GetEffects;
