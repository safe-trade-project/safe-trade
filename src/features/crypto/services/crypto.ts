import type { CryptoBasicDto } from "../contracts/cryptoBasic.dto.ts";
import type { CryptoDetailDto } from "../contracts/cryptoDetail.dto.ts";
import type { CryptoMarketDto } from "../contracts/cryptoMarket.dto.ts";

// const top50CoinGeckoIds = [
//   "bitcoin",
//   "ethereum",
//   "tether",
//   "binancecoin",
//   "solana",
//   "usd-coin",
//   "xrp",
//   "dogecoin",
//   "toncoin",
//   "cardano",
//   "tron",
//   "wrapped-bitcoin",
//   "avalanche-2",
//   "shiba-inu",
//   "polkadot",
//   "chainlink",
//   "bitcoin-cash",
//   "near",
//   "uniswap",
//   "litecoin",
//   "polygon",
//   "internet-computer",
//   "pepe",
//   "leo-token",
//   "dai",
//   "ethereum-classic",
//   "aptos",
//   "render",
//   "filecoin",
//   "hedera-hashgraph",
//   "stacks",
//   "cronos",
//   "stellar",
//   "okb",
//   "arbitrum",
//   "arweave",
//   "first-digital-usd",
//   "floki",
//   "mantle",
//   "immutable-x",
//   "optimism",
//   "injective-protocol",
//   "lido-dao",
//   "vechain",
//   "kaspa",
//   "maker",
//   "cosmos",
//   "theta-token",
//   "celestia",
//   "thorchain",
// ];
export const fetchCoins = async () => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/crypto-all`,
    );

    const data = await response.json();

    return data as CryptoBasicDto[];
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const fetchCoin = async (id: string | undefined) => {
  try {
    if (!id) {
      throw new Error("Id is required");
    }
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/coins/${id}`,
    );

    const data = await response.json();

    return data as CryptoDetailDto;
  } catch (error) {
    console.error(error);
    throw error;
  }
};


export const fetchMarketChart = async (id: string | undefined) => {
  try {
    if (!id) {
      throw new Error("Id is required");
    }
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/crypto/:id/market-chart`,
    );

    const data = await response.json();

    return data as CryptoMarketDto;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
