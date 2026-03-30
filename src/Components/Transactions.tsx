import { useState } from "react";
import { mapPaymetsData } from "../Helpers/account_data";
import { FetchFromUrl } from "../Helpers/stellar_api_client";
import { tryCatch } from "../Helpers/try_catch";
import type { AccountData, Payment } from "../Types/stellar_account_types";

interface TransactionProps {
  transactionHistory: Payment[];
  accountData: AccountData;
}

const PAGINATION = 25;

function Transactions({ transactionHistory, accountData }: TransactionProps) {
  const [transactions, setTransactions] =
    useState<Payment[]>(transactionHistory);
  const [start, setStart] = useState<number>(0);
  const [end, setEnd] = useState<number>(PAGINATION);
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
            {transactions.slice(start, end).map((tx) => (
              <tr key={tx.id}>
                <td className="px-6 py-4 whitespacetransactions[transactions.length - 1].prev_page-nowrap text-sm text-gray-500">
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
                  <a
                    href={`https://stellar.expert/explorer/public/tx/${tx.id}`}
                    className="text-blue-600 hover:text-blue-900"
                  >
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
            if (start > 0) {
              setStart(start - PAGINATION);
              setEnd(end - PAGINATION);
            }
          }}
        >
          Previous
        </button>
        <button
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
          onClick={() => {
            // Handle next page logic
            if (transactions.length <= end) {
              tryCatch(
                FetchFromUrl(transactions[end - 1].next_page ?? "").then(
                  (res) => {
                    const nextPayments: Payment[] = mapPaymetsData(res);
                    setTransactions((prevTransactions) => [
                      ...prevTransactions,
                      ...nextPayments,
                    ]);

                    // shift the shown transactions
                    setStart(start + PAGINATION);
                    setEnd(end + PAGINATION);
                  },
                ),
              );
            } else {
              setStart(start + PAGINATION);
              setEnd(end + PAGINATION);
            }
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Transactions;
