import { AccountData } from "./Types";

export async function LoadAccount(acctID) {
  const StellarSdk = require("stellar-sdk");
  const server = new StellarSdk.Server("https://horizon.stellar.org");
  let resp = await server.loadAccount(acctID).catch(function (err) {
    console.error(err);
  });
  console.log(resp);
  return resp;
}

/**
 * Fetches account data from the Stellar Horizon server.
 *
 * @param acctID - The ID of the account to fetch.
 * @returns A promise that resolves to the account data.
 *
 * @example
 * ```typescript
 * const accountData = await FetchAccount("GABCD1234...");
 * console.log(accountData);
 * ```
 */
export async function FetchAccount(acctID): Promise<AccountData> {
  const resp = await fetch("https://horizon.stellar.org/accounts/" + acctID);
  const data = await resp.json();
  return data;
}
