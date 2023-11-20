// Aggrigate the historic value of the account

export async function GetHistoricValue(totalContext, days) {
  // we need the account's assets
  const currentBalance = totalContext.totalState.assets;
  // console.log(currentBalance);
  let historic_prices = [];
  currentBalance.forEach(async (asset) => {
    if (asset.code === "XLM") {
      asset.issuer = "native";
    }
    try {
      const response = await fetch(
        `http://loganjstein.com:8080/${asset.code}/${asset.issuer}`
      );
      const data = await response.json();
      console.log("data from api for ", asset.code, data);
      // historic prices: [{asset_code: XLM, prices: [{date: 2020-01-01, price: 0.01}, {date: 2020-01-02, price: 0.02}]}]
      let prices = [];
      data.forEach((day) => {
        prices.push({ date: day.date, price: day.usd_price });
      });
      historic_prices.push({ asset_code: asset.code, prices: prices });
    } catch (error) {
      console.error("my error", error);
    }
  });
  console.log("historic prices", historic_prices);
  // we can then query the new api for the historic values of each asset
  // multiply the value by the amount of the asset the account has for each day

  // add the values together for each day
  // return the array of values (array of days);
}
