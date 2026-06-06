import type { AssetPrice } from "../Types/asset_types";

/**
 * Fetches Asset price data from the Logan's Stellar API.
 * @param {string} assetCode - The asset code of stellar asset to fetch.
 * @param {string} assetIssuer - The issuer of the asset. Defaults to "native" for xlm.
 * @returns {Promise<AssetPrice[]>} A promise that resolves to the fetched Asset Price data.
 */
export async function FetchAssetPrices(
  assetCode: string,
  assetIssuer: string,
  startDate?: string,
  endDate?: string,
): Promise<AssetPrice[]> {
  const path =
    startDate && endDate
      ? `${assetCode}/${assetIssuer}/${startDate}/${endDate}`
      : `${assetCode}/${assetIssuer}`;
  const resp: Response = await fetch(
    "https://stellar-api.loganstein.dev/" + path,
  );
  if (resp.status !== 200) {
    throw new Error("Failed to fetch asset data.");
  }
  const data: Promise<AssetPrice[]> = await resp.json();
  return data;
}
