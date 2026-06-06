/**
 * Represents an asset price entry with metadata.
 * @property {string} asset_code - The code of the asset (e.g., "XLM", "BTC").
 * @property {string} date - The date of the price entry in YYYY-MM-DD format.
 * @property {number} usd_price - The price of the asset in USD.
 */
export type AssetPrice = {
  asset_code: string;
  date: string;
  usd_price: number;
};