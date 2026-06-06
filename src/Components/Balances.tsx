import { useEffect, useState } from "react";
import type { AccountData } from "../Types/stellar_account_types";
import { tryCatch } from "../Helpers/try_catch";
import { FetchAssetPrices } from "../Helpers/asset_data";

interface BalancesProps {
  accountData: AccountData;
}

type priceData = {
  assetCode: string;
  usdPrice: number;
};

type balanceData = {
  assetCode?: string;
  assetIssuer?: string;
  balance: number;
  price: number;
  value: number;
};
// TODO: account balances are doubled
function Balances({ accountData }: BalancesProps) {
  const [prices, setPrices] = useState<priceData[]>([]); // probably not necessary because balance has the asset price included.
  const [balanceData, setBalanceData] = useState<balanceData[]>([]);
  useEffect(() => {
    setBalanceData([]);
    accountData.balances.forEach((bal, idx) => {
      if (bal.asset_code && bal.issuer) {
        Promise.all([
          tryCatch(
            FetchAssetPrices(
              bal.asset_code,
              bal.issuer,
              "2026-06-03",
              "2026-06-03",
            ),
          ), // TODO: date should be string rep like this of the current date minus 1 day
        ]).then(([assetPriceData]) => {
          if (!assetPriceData.error && assetPriceData.data[0]) {
            const assetPrice = assetPriceData.data[0].usd_price;
            console.log("adding", bal.asset_code, idx);
            setBalanceData((prevBalances) =>
              prevBalances.some(
                (b) =>
                  b.assetCode === bal.asset_code &&
                  b.assetIssuer === bal.issuer,
              )
                ? prevBalances
                : [
                    ...prevBalances,
                    {
                      assetCode: bal.asset_code,
                      assetIssuer: bal.issuer,
                      balance: bal.balance,
                      price: assetPrice,
                      value: bal.balance * assetPrice,
                    },
                  ],
            );
          } else {
            console.log(
              "Error fetching price data for",
              bal.asset_code,
              bal.issuer,
            );
          }
        });
      }
    });
    return () => {};
  }, [accountData]);
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-6">
        Account Balances
      </h3>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Asset Code
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Asset Balance
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Asset Price
              </th>
              {/* TODO: what is asset column for? */}
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Asset
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Balance Value (USD)
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {balanceData.map((bal) => (
              <tr key={balanceData.indexOf(bal)}>
                <td className="px-6 py-4 whitespacetransactions[transactions.length - 1].prev_page-nowrap text-sm text-gray-500">
                  {bal.assetCode}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{bal.balance}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {bal.price}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"></td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  ${Number(bal.value.toFixed(2))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Balances;
