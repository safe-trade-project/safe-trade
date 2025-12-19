import type { CryptoBasicDto } from "../contracts/cryptoBasic.dto.ts";
import type { CryptoDetailDto } from "../contracts/cryptoDetail.dto.ts";

const API_KEY = import.meta.env.VITE_API_GECKO_KEY;
const top50CoinGeckoIds = [
  "bitcoin",
  "ethereum",
  "tether",
  "binancecoin",
  "solana",
  "usd-coin",
  "xrp",
  "dogecoin",
  "toncoin",
  "cardano",
  "tron",
  "wrapped-bitcoin",
  "avalanche-2",
  "shiba-inu",
  "polkadot",
  "chainlink",
  "bitcoin-cash",
  "near",
  "uniswap",
  "litecoin",
  "polygon",
  "internet-computer",
  "pepe",
  "leo-token",
  "dai",
  "ethereum-classic",
  "aptos",
  "render",
  "filecoin",
  "hedera-hashgraph",
  "stacks",
  "cronos",
  "stellar",
  "okb",
  "arbitrum",
  "arweave",
  "first-digital-usd",
  "floki",
  "mantle",
  "immutable-x",
  "optimism",
  "injective-protocol",
  "lido-dao",
  "vechain",
  "kaspa",
  "maker",
  "cosmos",
  "theta-token",
  "celestia",
  "thorchain",
];
export const fetchCoins = async () => {
  const supported_cryptos = top50CoinGeckoIds.join(",");
  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${supported_cryptos}&order=market_cap_desc&per_page=50&page=1&sparkline=false`,
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        },
      },
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
      `https://api.coingecko.com/api/v3/coins/${id}`,
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        },
      },
    );

    const data = await response.json();

    return data as CryptoDetailDto;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
