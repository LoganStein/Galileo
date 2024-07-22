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

async function getHistoricAssetValues(totalContext, days) {
  let assets_history = [];

  var requestOptions = {
    method: "GET",
    redirect: "follow",
  };

  let urls = [];
  console.log(totalContext.totalState.assets);
  totalContext.totalState.assets.forEach((asset) => {
    if (asset.code === "XLM") {
      urls.push(`http://loganjstein.com:8080/${asset.code}/native`);
    } else {
      urls.push(`http://loganjstein.com:8080/${asset.code}/${asset.issuer}`);
    }
  });

  Promise.all(urls.map((url) => fetch(url, requestOptions)))
    .then((responses) =>
      Promise.all(responses.map((response) => response.json()))
    )
    .then((data) => {
      console.log("hello");
      assets_history = data;
      console.log("assets_history", assets_history);
    })
    .catch((error) => console.log("error", error));
  return assets_history;
}

export async function GetHistoricValue(totalContext, effects, days) {
  let historicValues = [];
  console.log("effects", effects);
  const currentBalance = totalContext.totalState.assets;
  const today = moment();
  let dailyBalances = [{ date: today, bals: [...currentBalance] }]; //might not need to start with today
  console.log("first daily balances", dailyBalances);

  for (let i = 1; i < days; i++) {
    const dailyEffects = filterEffects(effects, i);
    // only include effects that involve assets in currentBalance
    const filteredDailyEffects = dailyEffects.filter((effect) =>
      currentBalance.some((asset) => asset.code === effect.asset_code)
    );

    let prevBalances = dailyBalances[dailyBalances.length - 1].bals;

    let daysBalance = [...prevBalances];

    filteredDailyEffects.forEach((effect) => {
      if (effect.type === "account_credited") {
        // prev days balance minus effect amount
        let newBalances = daysBalance.map((asset) => {
          if (asset.code === effect.asset_code) {
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
      } else if (effect.type === "account_debited") {
        // prev days balance plus effect amount
        let prevBalances = dailyBalances[dailyBalances.length - 1].bals;
        let newBalances = prevBalances.map((asset) => {
          if (asset.code === effect.asset_code) {
            return {
              code: asset.code,
              issuer: asset.issuer,
              bal: asset.bal + Number(effect.amount),
            };
          } else {
            return asset;
          }
        });
        daysBalance.push(...newBalances);
      }
    });
    dailyBalances.push({
      date: moment().subtract(i, "days"),
      bals: daysBalance,
    });
    // calculate the total value from dailyBalances
    const totalValue = await Promise.all(
      dailyBalances.map(async (day) => {
        const assetValues = await Promise.all(
          day.bals.map(async (asset) => {
            const val = await GetAssetValue(
              asset.code,
              asset.issuer,
              asset.bal
            );
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

    dailyBalances.push({
      date: moment().subtract(i, "days"),
      effects: daysBalance,
    });
  }

  console.log("test daily bals", dailyBalances);

  for (let i = 0; i < 2; i++) {
    const acctEffects = filterEffects(effects, i);
    console.log("acct effects", acctEffects);

    //   filter acctEffects to only include effects that involve assets in currentBalance
    const filteredAcctEffects = acctEffects.filter((effect) =>
      currentBalance.some((asset) => asset.code === effect.asset_code)
    );
    console.log("filtered acct effects", filteredAcctEffects);
    filteredAcctEffects.forEach((effect) => {
      // if the effect is a credit, add the effect to the historicValue array
      if (effect.type === "account_credited") {
        // if the effect is a credit, add the effect to the historicValue array
        let prevBalances = dailyBalances[dailyBalances.length - 1].bals;
        let newBalances = prevBalances.map((asset) => {
          if (asset.code === effect.asset_code) {
            return {
              code: asset.code,
              issuer: asset.issuer,
              bal: asset.bal - Number(effect.amount),
            };
          } else {
            return asset;
          }
        });
        dailyBalances.push({
          date: moment().subtract(i, "days"),
          bals: newBalances,
        });
      } else if (effect.type === "account_debited") {
        // if the effect is a debit, add the effect to the historicValue array
        let prevBalances = dailyBalances[dailyBalances.length - 1].bals;
        let newBalances = prevBalances.map((asset) => {
          if (asset.code === effect.asset_code) {
            return {
              code: asset.code,
              issuer: asset.issuer,
              bal: asset.bal + Number(effect.amount),
            };
          } else {
            return asset;
          }
        });
        console.log("daily historic balances", dailyBalances);
        dailyBalances.forEach((asset) => {
          GetAssetValue(asset.code, asset.issuer, asset.bal).then((val) => {});
        });
      }
    });
    console.log("daily historic balances", dailyBalances);
    dailyBalances.forEach((asset) => {
      GetAssetValue(asset.code, asset.issuer, asset.bal).then((val) => {});
    });

    // calculate the total value from dailyBalances and historic asset values
    let assetValues = await getHistoricAssetValues(totalContext, days);
    console.log("jester assets", assetValues);
    console.log("jester balances", dailyBalances);
    console.log("jester historic values", historicValues);

    return historicValues;
  }
}
