// helper function that returns 30 days worth of historic account value data based on the account's public key
import moment from "moment/moment";
import GetAssetValue from "./GetAssetValue";

const StellarSdk = require("stellar-sdk");
const server = new StellarSdk.Server("https://horizon.stellar.org");

function filterEffects(effects, days) {
  const filteredEffects = effects.filter((effect) => {
    return (
      (effect.type === "account_credited" ||
        effect.type === "account_debited") &&
      moment(effect.created_at).isSame(moment().subtract(days, "days"), "day")
    );
  });
  return filteredEffects;
}

export async function GetHistoricValue(totalContext, effects, days) {
  let historicValues = [];
  console.log("effects", effects);
  const currentBalance = totalContext.totalState.assets;
  const today = moment();
  let dailyBalances = [{ date: today, bals: [...currentBalance] }]; //might not need to start with today
  console.log("first daily balances", dailyBalances);

  for (let i = 1; i < days; i++) {
    console.log(
      "test day: ",
      moment().subtract(i, "days").format("MM/DD/YYYY")
      //   "current balances",
      //   currentBalance
    );
    const dailyEffects = filterEffects(effects, i);
    // only include effects that involve assets in currentBalance
    const filteredDailyEffects = dailyEffects.filter((effect) =>
      currentBalance.some((asset) => asset.code === effect.asset_code)
    );

    let prevBalances = dailyBalances[dailyBalances.length - 1].bals;
    console.log(
      "test prev bals",
      moment().subtract(i, "days").format("MM/DD/YYYY"),
      prevBalances
    );
    let daysBalance = [...prevBalances];

    filteredDailyEffects.forEach((effect) => {
      if (effect.type === "account_credited") {
        // prev days balance minus effect amount
        let newBalances = daysBalance.map((asset) => {
          if (asset.code === effect.asset_code) {
            // console.log(
            //   "test effect: subtracting",
            //   effect.amount,
            //   effect.asset_code,
            //   moment(effect.created_at).format("MM/DD/YY HH:mm:ss")
            // );
            return {
              code: asset.code,
              issuer: asset.issuer,
              bal: asset.bal - Number(effect.amount),
            };
          } else {
            return asset;
          }
        });
        daysBalance = [...newBalances];
        // console.log(
        //   "test account credited",
        //   effect.amount,
        //   effect.asset_code,
        //   moment(effect.created_at).format("MM/DD/YYYY"),
        //   filteredDailyEffects.length
        // );
      }
      //   else if (effect.type === "account_debited") {
      //     // prev days balance plus effect amount
      //     let prevBalances = dailyBalances[dailyBalances.length - 1].bals;
      //     let newBalances = prevBalances.map((asset) => {
      //       if (asset.code === effect.asset_code) {
      //         return {
      //           code: asset.code,
      //           issuer: asset.issuer,
      //           bal: asset.bal + Number(effect.amount),
      //         };
      //       } else {
      //         return asset;
      //       }
      //     });
      //     daysBalance.push(...newBalances);
      //   }
    });
    dailyBalances.push({
      date: moment().subtract(i, "days"),
      bals: daysBalance,
    });
  }
  //   console.log("test daily bals", dailyBalances);

  //   calculate the total value from dailyBalances
  const totalValue = await Promise.all(
    dailyBalances.map(async (day) => {
      const assetValues = await Promise.all(
        day.bals.map(async (asset) => {
          const val = await GetAssetValue(asset.code, asset.issuer, asset.bal);
          return val;
        })
      );
      const total = assetValues.reduce((acc, val) => acc + val, 0);
      historicValues.push({
        date: day.date,
        val: total,
      });
    })
  );

  console.log("historic values", historicValues);

  //     dailyBalances.push({
  //       date: moment().subtract(i, "days"),
  //       effects: daysBalance,
  //     });
  //   }
  //   console.log("test daily bals", dailyBalances);

  // for (let i = 0; i < 2; i++) {
  //   const acctEffects = filterEffects(effects, i);
  //   console.log("acct effects", acctEffects);

  //   //   filter acctEffects to only include effects that involve assets in currentBalance
  //   const filteredAcctEffects = acctEffects.filter((effect) =>
  //     currentBalance.some((asset) => asset.code === effect.asset_code)
  //   );
  //   console.log("filtered acct effects", filteredAcctEffects);
  //   filteredAcctEffects.forEach((effect) => {
  //     // if the effect is a credit, add the effect to the historicValue array
  //     if (effect.type === "account_credited") {
  //       // if the effect is a credit, add the effect to the historicValue array
  //       let prevBalances = dailyBalances[dailyBalances.length - 1].bals;
  //       let newBalances = prevBalances.map((asset) => {
  //         if (asset.code === effect.asset_code) {
  //           return {
  //             code: asset.code,
  //             issuer: asset.issuer,
  //             bal: asset.bal - Number(effect.amount),
  //           };
  //         } else {
  //           return asset;
  //         }
  //       });
  //       dailyBalances.push({
  //         date: moment().subtract(i, "days"),
  //         bals: newBalances,
  //       });
  //     } else if (effect.type === "account_debited") {
  //       // if the effect is a debit, add the effect to the historicValue array
  //       let prevBalances = dailyBalances[dailyBalances.length - 1].bals;
  //       let newBalances = prevBalances.map((asset) => {
  //         if (asset.code === effect.asset_code) {
  //           return {
  //             code: asset.code,
  //             issuer: asset.issuer,
  //             bal: asset.bal + Number(effect.amount),
  //           };
  //         } else {
  //           return asset;
  //         }
  //       });
  //       console.log("daily historic balances", dailyBalances);
  //       //   dailyBalances.forEach((asset) => {
  //       //     GetAssetValue(asset.code, asset.issuer, asset.bal).then((val) => {});
  //       //   });
  //     }
  //   });
  //   console.log("daily historic balances", dailyBalances);
  //   // dailyBalances.forEach((asset) => {
  //   //   GetAssetValue(asset.code, asset.issuer, asset.bal).then((val) => {});
  //   // });
  // }
  return historicValues;
}
