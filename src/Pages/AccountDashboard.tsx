import { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { tryCatch } from "../Helpers/try_catch";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  FetchAccount,
  FetchFromUrl,
  FetchPayments,
} from "../Helpers/stellar_api_client";
import {
  getBalance,
  mapAccountData,
  mapPaymetsData,
} from "../Helpers/account_data";
import type { AccountData, Payment } from "../Types/stellar_account_types";

function AccountDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const location = useLocation();
  const [accountData, setAccountData] = useState<AccountData>(
    location.state?.account ?? undefined,
  );
  const [searchParams] = useSearchParams();
  const id = searchParams.get("address");
  const [isLoading, setIsLoading] = useState(true);
  const [transactionHistory, setTransactionHistory] = useState<Payment[]>(
    location.state?.payments ?? [],
  );

  useEffect(() => {
    if (!(location.state?.account && location.state.payments) && id) {
      console.log("Direct from url");
      setIsLoading(true);
      Promise.all([
        tryCatch(FetchAccount(id)),
        tryCatch(FetchPayments(id)),
      ]).then(([accountRes, paymentsRes]) => {
        if (accountRes.data && !accountRes.error) {
          const mappedData: AccountData = mapAccountData(accountRes.data);
          setAccountData(mappedData);
        }
        if (paymentsRes.data && !paymentsRes.error) {
          const mappedData: Payment[] = mapPaymetsData(paymentsRes.data);
          setTransactionHistory(mappedData);
        }
        setIsLoading(false);
      });
    } else {
      setIsLoading(false);
    }
  }, [id, location.state]);

  // const transactionHistory = [
  //   {
  //     id: "tx1",
  //     date: "2023-05-15",
  //     amount: "10.5 XLM",
  //     type: "Received",
  //     status: "Completed",
  //   },
  //   {
  //     id: "tx2",
  //     date: "2023-05-14",
  //     amount: "5.2 XLM",
  //     type: "Sent",
  //     status: "Completed",
  //   },
  //   {
  //     id: "tx3",
  //     date: "2023-05-13",
  //     amount: "2.1 XLM",
  //     type: "Received",
  //     status: "Completed",
  //   },
  // ];
  // const transactionHistory: Payment[] = location.state.payments

  const handleBackToSearch = () => {
    navigate("/");
  };

  if (isLoading) {
    return "Loading...";
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 relevant">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1
                className="text-xl font-bold text-gray-900 cursor-pointer"
                onClick={handleBackToSearch}
              >
                Galileo
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <a href="#" className="text-gray-600 hover:text-gray-900">
                Features
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900">
                About
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900">
                Contact
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <button
            onClick={handleBackToSearch}
            className="text-blue-600 hover:text-blue-800 flex items-center"
          >
            <svg
              className="h-4 w-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Search
          </button>
        </div>

        {/* Account Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Account Dashboard
              </h1>
              <p className="text-gray-600">
                Stellar Address:{" "}
                <span className="font-mono">{accountData?.address}</span>
              </p>
            </div>
            <button
              className="text-gray-400 hover:text-gray-600 flex items-center gap-1"
              onClick={() => {
                if (accountData?.address) {
                  if (navigator.clipboard == undefined) {
                    console.log("Clipboard API not supported");
                    toast.error("Failed to copy address", {
                      position: "top-right",
                      autoClose: 2000,
                      hideProgressBar: false,
                      closeOnClick: true,
                      pauseOnHover: true,
                      draggable: true,
                    });
                  }
                  navigator.clipboard
                    .writeText(accountData.address)
                    .then(() => {
                      toast.success("Address copied!", {
                        position: "top-right",
                        autoClose: 2000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                      });
                    })
                    .catch(() => {
                      toast.error("Failed to copy address", {
                        position: "top-right",
                        autoClose: 2000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                      });
                    });
                }
              }}
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              <span className="text-xs">Copy</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "overview"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
                onClick={() => setActiveTab("overview")}
              >
                Overview
              </button>
              <button
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "transactions"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
                onClick={() => setActiveTab("transactions")}
              >
                Transactions
              </button>
              <button
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "analytics"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
                onClick={() => setActiveTab("analytics")}
              >
                Analytics
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === "overview" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Account Summary Cards */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Account Summary
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">XLM Balance</span>
                      <span className="font-semibold">
                        {getBalance("XLM", "native", accountData)?.balance}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Trustlines</span>
                      <span className="font-semibold">
                        {accountData.trustline_count}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Transactions</span>
                      <span className="font-semibold">
                        {accountData.total_transaction_count}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Created</span>
                      <span className="font-semibold">
                        {accountData.created}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Recent Activity
                  </h3>
                  <div className="space-y-4">
                    {transactionHistory.slice(0, 3).map((tx) => (
                      <div
                        key={tx.id}
                        className="flex justify-between items-center"
                      >
                        <div>
                          <div className="font-medium">{tx.type}</div>
                          <div className="text-sm text-gray-500">
                            {tx.created}
                          </div>
                        </div>
                        <div
                          className={`font-medium ${
                            tx.type === "Received"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {tx.amount}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "transactions" && (
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
                      {transactionHistory.map((tx) => (
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
                              {tx.to === accountData.address
                                ? "Received"
                                : "Sent"}
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
                              href="#"
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
                      // Handle previous page logic
                      tryCatch(
                        FetchFromUrl(
                          transactionHistory[0].prev_page ?? "",
                        ).then((res) => {
                          setTransactionHistory(mapPaymetsData(res));
                        }),
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
                        FetchFromUrl(
                          transactionHistory[0].next_page ?? "",
                        ).then((res) => {
                          setTransactionHistory(mapPaymetsData(res));
                        }),
                      );
                    }}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {activeTab === "analytics" && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Account Analytics
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Placeholder for charts */}
                  <div className="bg-gray-50 rounded-lg p-6 h-64 flex items-center justify-center">
                    <p className="text-gray-500">Transaction Volume Chart</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-6 h-64 flex items-center justify-center">
                    <p className="text-gray-500">Balance History Chart</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      {/* <footer className="bg-gray-800 text-white mt-12">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">Galileo</h3>
              <p className="text-gray-400 text-sm">
                Your trusted Stellar address lookup tool
              </p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-white">
                Privacy
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                Terms
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                API
              </a>
            </div>
          </div>
        </div>
      </footer> */}
      <ToastContainer />
    </div>
  );
}

export default AccountDashboard;
