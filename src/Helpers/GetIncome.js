import GetAssetValue from "./GetAssetValue";

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
  // check that ops contains at least 1 full day's worth of transactions
  // if not, use the link to prev to get more ops until we have at least 1 full day's worth
  ops.forEach((op) => {
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

export default GetIncome;
