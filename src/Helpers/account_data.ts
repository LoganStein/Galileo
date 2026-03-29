import type {
  AccountData,
  Payment,
  StellarAccount,
  StellarPayment,
} from "../Types/stellar_account_types";

export function getBalance(
  asset_code: string,
  issuer: string,
  accountData: AccountData
) {
  // search through accountData.balances for the asset code and issuer
  const balance = accountData.balances.find(
    (balance) => balance.asset_code === asset_code && balance.issuer === issuer
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
    newPayment.amount = parseFloat(payment.amount);
    newPayment.asset_code = payment.asset_code || "";
    newPayment.issuer = payment.asset_issuer || "";
    newPayment.to = payment.to || "";
    newPayment.from = payment.from || "";
    newPayment.created = payment.created_at;
    newPayment.successful = payment.transaction_successful;
    newPayment.asset_type = payment.asset_type;
    newPayment.next_page = data._links.next?.href; // I don't like this design. We shouldn't be putting this on each payment but for the page.
    newPayment.prev_page = data._links.prev?.href.replace("order=asc", "order=desc") // we need to make sure we still have desc instead of asc
    newData.push(newPayment);
  }
  return newData;
}
