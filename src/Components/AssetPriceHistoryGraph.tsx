import type { AssetPrice } from "../Types/asset_types";
import { FetchAssetPrices } from "../Helpers/asset_data";
import { tryCatch } from "../Helpers/try_catch";
import { useEffect, useState, useRef } from "react";
import Chart from "chart.js/auto";

interface AssetPriceDataProps {
  asset_code: string;
  asset_issuer: string;
  start_date?: string;
  end_date?: string;
}
function AssetPriceHistoryGraph({
  asset_code,
  asset_issuer,
  start_date,
  end_date
}: AssetPriceDataProps) {
  const [assetPriceData, setAssetPriceData] = useState<AssetPrice[]>([]);
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    Promise.all([tryCatch(FetchAssetPrices(asset_code, asset_issuer, start_date, end_date))]).then(
      ([assetPriceData]) => {
        if (!assetPriceData.error) {
          setAssetPriceData(assetPriceData.data);
        } else {
          console.log(
            "Error fetching price data for",
            asset_code,
            asset_issuer,
          );
        }
      },
    );
  }, []);

  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    if (assetPriceData.length > 0 && chartRef.current) {
      const ctx = chartRef.current.getContext("2d");
      if (ctx) {
        chartInstance.current = new Chart(ctx, {
          type: "line",
          data: {
            labels: assetPriceData.map((item) => item.date).reverse(), // reversed because the original data was coming in with latest dates on the left of the chart.
            datasets: [
              {
                label: `${asset_code} Price`,
                data: assetPriceData.map((item) => item.usd_price).reverse(),
                borderColor: "rgb(75, 192, 192)",
                tension: 0.1,
                fill: false,
              },
            ],
          },
          options: {
            responsive: true,
            plugins: {
              legend: { position: "bottom" },
            },
            scales: {
              y: { beginAtZero: false },
            },
          },
        });
      }
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [assetPriceData]);

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <canvas ref={chartRef} />
    </div>
  );
}

export default AssetPriceHistoryGraph;
