import type { StellarAccount, StellarPayment } from "../Types/stellar_account_types";

/**
 * Fetches a Stellar account from the Horizon API.
 * @param {string} acctID - The account ID of the Stellar account to fetch.
 * @returns {Promise<StellarAccount>} A promise that resolves to the fetched Stellar account.
 */
export async function FetchAccount(acctID: string): Promise<StellarAccount> {
  const resp: Response = await fetch("https://horizon.stellar.org/accounts/" + acctID);
  if(resp.status !== 200){
    throw new Error("Failed to fetch account.");
  }
  const data: Promise<StellarAccount> = await resp.json();
  return data;
}

/**
 * Fetches all payments associated with a Stellar account from the Horizon API.
 * @param {string} acctID - The account ID of the Stellar account to fetch payments for.
 * @returns {Promise<StellarPayment[]>} A promise that resolves to an array of Stellar payments.
 * @throws {Error} If the request to fetch payments fails.
 */
export async function FetchPayments(acctID: string): Promise<StellarPayment> {
  const resp: Response = await fetch(`https://horizon.stellar.org/accounts/${acctID}/payments?order=desc&limit=25`);
  if(resp.status !== 200){
    throw new Error("Failed to fetch payments.");
  }
  const data: Promise<StellarPayment> = await resp.json();
  return data;
}

export async function FetchFromUrl(url: string) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}