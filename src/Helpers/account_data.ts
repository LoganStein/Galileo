import type { AssetPrice } from "../Types/asset_types";
import type {
  AccountData,
  Balance,
  Payment,
  StellarAccount,
  StellarPayment,
} from "../Types/stellar_account_types";
import { FetchAssetPrices } from "./asset_data";
import { tryCatch } from "./try_catch";

export function getBalance(
  asset_code: string,
  issuer: string,
  accountData: AccountData,
) {
  // search through accountData.balances for the asset code and issuer
  const balance = accountData.balances.find(
    (balance) => balance.asset_code === asset_code && balance.issuer === issuer,
  );
  return balance;
}

export function mapAccountData(data: StellarAccount): AccountData {
  // create a new AccountData object with the data from the StellarAccount
  const newData = {} as AccountData;
  newData.address = data.account_id;
  newData.balances = data.balances.map((bal) => {
    if (bal.asset_type === "native") {
      return {
        asset_code: "XLM",
        issuer: "native",
        balance: Number(bal.balance),
      };
    } else {
      return {
        asset_code: bal.asset_code || "", // Ensure asset_code is never undefined
        issuer: bal.asset_issuer || "", // Ensure issuer is never undefined
        balance: Number(bal.balance),
      };
    }
  });
  newData.trustline_count = data.balances.length;
  return newData;
}

export function mapPaymetsData(data: StellarPayment): Payment[] {
  const newData = [] as Payment[];
  for (const payment of data._embedded.records) {
    const newPayment = {} as Payment;
    newPayment.id = payment.transaction_hash;
    newPayment.amount = parseFloat(payment.amount);
    newPayment.asset_code = payment.asset_code || "";
    newPayment.issuer = payment.asset_issuer || "";
    newPayment.to = payment.to || "";
    newPayment.from = payment.from || "";
    newPayment.created = payment.created_at;
    newPayment.successful = payment.transaction_successful;
    newPayment.asset_type = payment.asset_type;
    newPayment.next_page = data._links.next?.href; // I don't like this design. We shouldn't be putting this on each payment but for the page.
    newPayment.prev_page = data._links.prev?.href;
    newData.push(newPayment);
  }
  return newData;
}

export async function getWalletValue(data: AccountData): Promise<number> {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split("T")[0];

  const pricePromises = data.balances.map(async (balance) => {
    if (!balance.asset_code || !balance.issuer) return 0;

    const fetchResult = await tryCatch<AssetPrice[]>(
      FetchAssetPrices(
        balance.asset_code,
        balance.issuer,
        yesterdayStr,
        yesterdayStr,
      ),
    );

    if (fetchResult.error) {
      console.error(
        `Failed to fetch price for ${balance.asset_code}:`,
        fetchResult.error,
      );
      return 0;
    }

    return fetchResult.data.length > 0
      ? Number(balance.balance) * fetchResult.data[0].usd_price
      : 0;
  });

  const values = await Promise.all(pricePromises);
  return values.reduce((sum, val) => sum + val, 0); // Sum the resolved values
}
