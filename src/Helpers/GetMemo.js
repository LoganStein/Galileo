/**
 * Retrieves the memo field from a Stellar transaction using its hash.
 *
 * @param {string} hash - The hash of the Stellar transaction.
 * @returns {Promise<string>} - A promise that resolves to the memo of the transaction.
 */
async function GetMemo(hash) {
  const StellarSdk = require("stellar-sdk");
  const server = new StellarSdk.Server("https://horizon.stellar.org");
  const trans = await server.transactions().transaction(hash).call();
  return trans.memo;
}
export default GetMemo;
