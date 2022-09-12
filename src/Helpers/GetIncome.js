// this method of calculating income is EXTREMELY UNRELIABLE
// it only works for my account semi-reliably
// it doesnt use any data analytics and is customized to my account's
// type of activity

function GetIncome(ops, acctID) {
  //   console.log("in income", ops);
  let recieved = [];
  let uniqueOps = [{ amount: 10, asset: "test", sender: "me" }];
  ops.forEach((op) => {
    if (op.type == "payment" && op.from != acctID) {
      recieved.push(op);
    }
  });
  recieved.forEach((op) => {
    let amount = op.amount;
    let asset = op.asset_code;
    let assetIss = op.asset_issuer;
    let sender = op.from;
    let parsed = {
      amount: amount,
      asset: asset,
      sender: sender,
      issuer: assetIss,
    };

    let shit = uniqueOps.find((e) => {
      if (e.asset == asset && e.sender == sender) {
        return true;
      }
      /*
      if (Number(e.amount).toFixed(3) == Number(amount).toFixed(3)) {
        console.log("uni found");
        return true;
      }
      */
      return false;
    });
    if (shit == undefined) {
      uniqueOps.push(parsed);
    }
  });
  uniqueOps.shift();
  console.log("unique", uniqueOps);

  //count up each one
  let countArr = [];
  uniqueOps.forEach((e) => {
    let count = 0;
    for (let i = 0; i < recieved.length; i++) {
      if (recieved[i].from == e.sender && recieved[i].asset_code == e.asset) {
        count++;
      }
    }
    countArr.push(count);
  });
  console.log("uni", countArr);
  let hourly = [];
  let daily = [];
  for (let i = 0; i < countArr.length; i++) {
    if (countArr[i] > 10) {
      hourly.push(uniqueOps[i]);
    } else if (countArr[i] <= 2) {
      daily.push(uniqueOps[i]);
    }
  }
  console.log("uni hourly", hourly);
  console.log("uni daily", daily);
  return { hr: hourly, day: daily };
}
export default GetIncome;
