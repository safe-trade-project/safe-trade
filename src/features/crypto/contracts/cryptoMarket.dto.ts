export interface CryptoMarketDto {
  prices: [number, number][];
  market_caps?: [number, number][];
  total_volumes?: [number, number][];
}
