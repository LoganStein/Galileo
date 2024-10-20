import GetAssetValue from "./GetAssetValue";
import OperationResponse from "./Types.ts";

/*
  There are a lot of issues with this function. It fails completely if an account is too complex.
  If the account is too active it won't show accurate information because there are no ops from
  yesterday passed in. They are buried by today's ops. 

  this also does not exclude one time transactions. If an account is credited $1,000 in a one time transaction
  it will appear as if their income for the hr day and month is 41.66 1k and 30k respectively.

  This can be fixed by only allowing for certain transactions to be counted as income
  for example looking for "SDEX MM" or "AMM LP" or "Bribe" in the memo as these transactions are recurring
  credits.
*/

async function GetIncome(ops, acctID) {
  let recieved = [];
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10); // Get yesterday's date in ISO format (YYYY-MM-DD)
  // const monthAgo = new Date(Date.now() - 2592000000).toISOString(); // Get a month ago's date in ISO format (YYYY-MM-DD)
  let records = ops.records;
  let cur = ops;
  let count = 0;
  // collect all the operations we need by adding records from ops and ops.next until we have a month's worth of data
  while (yesterday < records[records.length - 1].created_at && count < 70) {
    cur = await ops.next(); // ops needs to update each time we call next though
    console.log(cur);
    records = records.concat(cur.records);
    count++;
  }
  console.log("after", records);
  ops.records.forEach((op) => {
    if (op.type == "payment" && op.from != acctID) {
      const date = new Date(op.created_at).toISOString().slice(0, 10); // Get transaction date in ISO format (YYYY-MM-DD)
      if (date === yesterday) {
        recieved.push(op);
      }
    }
  });

  // Group transactions by hour
  const incomeByHour = [];
  for (let i = 0; i < 24; i++) {
    incomeByHour.push([]);
  }
  recieved.forEach((op) => {
    const {
      amount,
      asset_code: asset,
      asset_issuer: issuer,
      from: sender,
      created_at: date,
    } = op;
    let parsed = { amount, asset, issuer, sender, date };
    if (op.asset_type === "native") {
      parsed = { amount, asset: "XLM", issuer, sender, date };
    }
    const hour = new Date(date).getHours();
    incomeByHour[hour].push(parsed);
  });

  let dailyTotal = 0;

  // use Promise.all to wait for all promises to resolve before continuing with calculation
  const promises = incomeByHour.flatMap((hourlyBatch) => {
    return hourlyBatch.map((payment) => {
      return GetAssetValue(payment.asset, payment.issuer, payment.amount);
    });
  });
  const values = await Promise.all(promises);
  dailyTotal = values.reduce((acc, val) => acc + val, 0);

  let hourly = dailyTotal / 24;
  return { hr: hourly, day: dailyTotal };
}

/**
 * Fetches income data from a given template link.
 *
 * The link should be from the Horizon API account data.
 * Ex.
 *
 * @param {string} link - The template link to fetch income data from - Ex. AccountData._links.operations.href
 * @returns {Promise<OperationResponse>} - A promise that resolves when the operations data is fetched.
 */
export async function GetIncomeFromTemplate(link) {
  // https://horizon.stellar.org/accounts/GDDQHQEY65CGGDLR7Z5C437QNGNBYMXZL6RFAZ6FBGKY5V66D5YE2S7V/operations{?cursor,limit,order}
  const formatedLink = link.split("{")[0] + "?limit=200&order=desc";
  const accountId = link.split("/")[4];
  const operations = await fetch(formatedLink);
  return GetIncome(operations, accountId);
}

export default GetIncome;
