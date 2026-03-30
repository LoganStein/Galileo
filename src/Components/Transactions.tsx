import { useState } from "react";
import { mapPaymetsData } from "../Helpers/account_data";
import { FetchFromUrl } from "../Helpers/stellar_api_client";
import { tryCatch } from "../Helpers/try_catch";
import type { AccountData, Payment } from "../Types/stellar_account_types";

interface TransactionProps {
    transactionHistory: Payment[],
    accountData: AccountData,
}

function Transactions({transactionHistory, accountData}: TransactionProps) {
    const [transactions, setTransactions] = useState<Payment[]>(transactionHistory)
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-6">
        Transaction History
      </h3>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Date
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Type
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Amount
              </th>
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
                Details
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {transactions.map((tx) => (
              <tr key={tx.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {tx.created}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      tx.to === accountData.address
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {tx.to === accountData.address ? "Received" : "Sent"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {tx.amount}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {tx.asset_type !== "native" ? tx.asset_code : "XLM"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <a href="#" className="text-blue-600 hover:text-blue-900">
                    View
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex justify-between items-center">
        <button
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
          onClick={() => {
            // Handle previous page logic
            tryCatch(
              FetchFromUrl(transactions[0].prev_page ?? "").then(
                (res) => {
                  setTransactions(mapPaymetsData(res));
                },
              ),
            );
          }}
        >
          Previous
        </button>
        <button
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
          onClick={() => {
            // Handle next page logic
            tryCatch(
              FetchFromUrl(transactions[0].next_page ?? "").then(
                (res) => {
                  setTransactions(mapPaymetsData(res));
                },
              ),
            );
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Transactions;
