// Aggrigate the historic value of the account
import StellarSdk from "stellar-sdk";
import moment from "moment";
import GetEffects from "./GetEffects";

function filterEffects(effects, days, currentBalance) {
  const filteredEffects = effects.filter((effect) => {
    return (
      (effect.type === "account_credited" ||
        effect.type === "account_debited") &&
      moment(effect.created_at).isSame(moment().subtract(days, "days"), "day")
    );
  });
  const heldAssets = filteredEffects.filter((effect) =>
    currentBalance.some((asset) => asset.code === effect.asset_code)
  );
  return heldAssets;
}

/**
 * Retrieves the balance history for a given number of days.
 * @param {Object} totalContext - The total context object.
 * @param {number} days - The number of days to retrieve the balance history for.
 * @returns {Array} - An array of objects representing the daily balances.
 */
async function GetBalanceHistory(totalContext, days) {
  let effects = await GetEffects(totalContext.totalState.acctID, 200);
  const currentBalance = totalContext.totalState.assets;
  let dailyBalances = [{ date: moment(), bals: [...currentBalance] }];

  for (let i = 1; i <= days; i++) {
    let newDate = moment().subtract(i, "days");
    let newBalance = dailyBalances[dailyBalances.length - 1].bals.map((bal) => {
      let effect = effects.find(
        (effect) =>
          moment(effect.created_at).isSame(newDate, "day") &&
          (effect.asset_code === bal.code ||
            effect.sold_asset_code === bal.code ||
            effect.bought_asset_code === bal.code)
      );
      if (effect) {
        if (effect.type === "account_credited") {
          console.log("credit", effect.asset_code, effect.amount, bal.bal);
          if (typeof bal.bal === "string") {
            // console.log("bal.bal is a string", bal.bal);
            // console.log("bal", bal);
            bal.bal = parseFloat(bal.bal);
          }
          return { ...bal, bal: bal.bal - effect.amount };
        } else if (effect.type === "account_debited") {
          return { ...bal, bal: bal.bal + effect.amount };
        } else if (effect.type === "trade") {
          // effect.sold_asset_code
          // effect.sold_amount
          // effect.bought_asset_type == "native" ? "XLM" : effect.bought_asset_code
          // effect.bought_amount
          // balance should be updated for both sold and bought assets
          console.log("what is bal", bal);
          if (effect.bought_asset_type == "native") {
            console.log(
              `Trade: bought ${effect.bought_amount} ${effect.bought_asset_type} for ${effect.sold_amount} ${effect.sold_asset_code} at ${effect.created_at}`
            );
            // subtract bought amount to balance

            // add sold amount to balance

            // return the new balance
          } else if (
            effect.sold_asset_type != "native" &&
            effect.bought_asset_type != "native"
          ) {
            console.log(
              `Trade: bought ${effect.bought_amount} ${effect.bought_asset_code} for ${effect.sold_amount} ${effect.sold_asset_code} at ${effect.created_at}`
            );
          } else {
            console.log(
              `Trade: bought ${effect.bought_amount} ${effect.bought_asset_code} for ${effect.sold_amount} ${effect.sold_asset_type} at ${effect.created_at}`
            );
          }
        }
      }
      return bal;
    });
    console.log("jester", newDate.format("MM/DD"), newBalance);
    // push new date and balance to dailyBalances
    dailyBalances.push({ date: newDate, bals: newBalance });
  }
  console.log("End daily balance", dailyBalances);
  return dailyBalances;
}

async function GetBalanceHistory_new(totalContext, days) {
  let effects = await GetEffects(totalContext.totalState.acctID, 200);
  const currentBalance = totalContext.totalState.assets;
  let dailyBalances = [{ date: moment(), bals: [...currentBalance] }];

  // yesterday here refers to the day before the day being considered (i days in the past; i+1 days ago = yesterday)
  // for each day back in time
  for (let i = 1; i <= days; i++) {
    let yesterdaysDate = moment().subtract(i, "days");
    let todaysBalance = dailyBalances[dailyBalances.length - 1].bals;
    let yesterdaysBalance = todaysBalance;

    todaysBalance.forEach((balance) => {
      let effect = effects.find(
        (effect) =>
          moment(effect.created_at).isSame(yesterdaysDate, "day") &&
          (effect.asset_code === balance.code ||
            effect.sold_asset_code === balance.code ||
            effect.bought_asset_code === balance.code)
      );
      // update the balance for each asset
      console.log("ooga", todaysBalance);

      if (effect) {
        if (effect.type === "trade") {
          // effect.sold_asset_code
          // effect.sold_amount
          // effect.bought_asset_type == "native" ? "XLM" : effect.bought_asset_code
          // effect.bought_amount
          // balance should be updated for both sold and bought assets
          console.log("what is bal", balance);
          if (effect.bought_asset_type == "native") {
            console.log(
              `Trade: bought ${effect.bought_amount} ${effect.bought_asset_type} for ${effect.sold_amount} ${effect.sold_asset_code} at ${effect.created_at}`
            );
            // subtract bought amount to balance
            // find the asset bought in the balance array
            let boughtAssetIndex = yesterdaysBalance.findIndex(
              (asset) => asset.code === "XLM"
            );
            console.log(
              "Found bought asset",
              yesterdaysBalance[boughtAssetIndex]
            );
            // add sold amount to balance

            // return the new balance
          } else if (
            effect.sold_asset_type != "native" &&
            effect.bought_asset_type != "native"
          ) {
            console.log(
              `Trade: bought ${effect.bought_amount} ${effect.bought_asset_code} for ${effect.sold_amount} ${effect.sold_asset_code} at ${effect.created_at}`
            );
            let boughtAsset = todaysBalance.find(
              (asset) => asset.code === effect.bought_asset_code
            );
            console.log("Found bought asset", boughtAsset);
          } else {
            console.log(
              `Trade: bought ${effect.bought_amount} ${effect.bought_asset_code} for ${effect.sold_amount} ${effect.sold_asset_type} at ${effect.created_at}`
            );
          }
        }
      }
    });
    // push new days balances to dailyBalances
    dailyBalances.push({ date: yesterdaysDate, bals: yesterdaysBalance });
  }

  return dailyBalances;
}

/**
 * Transforms the asset history data into a desired format.
 * @param {Array} assets_history - The array of asset history data.
 * @returns {Array} - The transformed asset history data.
 */
function transform_asset_history(assets_history) {
  let transformedData = assets_history.map((assetData) => {
    if (assetData.length === 0) {
      return;
    }
    return {
      asset_code: assetData[0].asset_code,
      price_history: assetData.map((data) => {
        return {
          date: moment(data.date),
          usd_price: data.usd_price,
        };
      }),
    };
  });
  return transformedData;
}

export async function GetHistoricValue(totalContext, days) {
  var requestOptions = {
    method: "GET",
    redirect: "follow",
  };

  let balHist = await GetBalanceHistory(totalContext, days + 1);
  let value_history = await Promise.all(
    balHist.map(async (day) => {
      // get the value of the assets for the day
      let dayValue = 0;
      let currentDate;
      for (const asset of day.bals) {
        let ApiResp =
          asset.code == "XLM"
            ? await fetch(
                `http://loganjstein.com:8080/${
                  asset.code
                }/native/${day.date.format("YYYY-MM-DD")}`,
                requestOptions
              ).then((response) => response.json())
            : await fetch(
                `http://loganjstein.com:8080/${asset.code}/${
                  asset.issuer
                }/${day.date.format("YYYY-MM-DD")}`,
                requestOptions
              ).then((response) => response.json());
        console.log(ApiResp);
        let assetPrice = ApiResp.length != 0 ? ApiResp[0][2] : 0;
        currentDate = ApiResp.length != 0 ? ApiResp[0][1] : day.date;
        console.log("return", assetPrice, asset.bal, assetPrice * asset.bal);
        dayValue += assetPrice * asset.bal;
      }
      // add the value to the historic value
      return { date: moment(currentDate), value: dayValue };
    })
  );
  console.log("value_history", value_history);
  value_history[0].date = moment().startOf("day");
  value_history[0].value = totalContext.totalState.total;
  return value_history;
}
