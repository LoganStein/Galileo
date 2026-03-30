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
import Footer from "../Components/Footer";
import Analytics from "../Components/Analytics";
import Transactions from "../Components/Transactions";

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

  const handleBackToSearch = () => {
    navigate("/");
  };

  if (isLoading) {
    return "Loading...";
  }

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-br from-gray-50 to-gray-100 relevant">
      <div>
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
                        <span className="text-gray-600">
                          Total Transactions
                        </span>
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
                            <div className="font-medium">
                              {tx.to === accountData.address
                                ? "Recieved"
                                : "Sent"}
                            </div>
                            <div className="text-sm text-gray-500">
                              {tx.created}
                            </div>
                          </div>
                          <div className={`font-medium`}>
                            <span
                              className={`${
                                tx.to === accountData.address
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >
                              {" "}
                              {tx.amount}{" "}
                            </span>{" "}
                            <span> {tx.asset_code || "XLM"} </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "transactions" && (
                <Transactions
                  transactionHistory={transactionHistory}
                  accountData={accountData}
                />
              )}

              {activeTab === "analytics" && <Analytics />}
            </div>
          </div>
        </main>
      </div>

      <div>
        <Footer />
        <ToastContainer />
      </div>
    </div>
  );
}

export default AccountDashboard;
