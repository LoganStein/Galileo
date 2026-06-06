import AssetPriceHistoryGraph from "./AssetPriceHistoryGraph";

function Analytics() {
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-6">
        Account Analytics
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Placeholder for charts */}
        <div className="bg-gray-50 rounded-lg h-80 flex items-center justify-center">
          <AssetPriceHistoryGraph asset_code="xlm" asset_issuer="native" />
        </div>
        <div className="bg-gray-50 rounded-lg p-6 h-80 flex items-center justify-center">
          <p className="text-gray-500">Balance History Chart</p>
        </div>
      </div>
    </div>
  );
}

export default Analytics;
