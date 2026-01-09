import type { CryptoBasicDto } from "../contracts/cryptoBasic.dto.ts";
import type { CryptoDetailDto } from "../contracts/cryptoDetail.dto.ts";

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
  try {
    const response = await fetch(
      `https://localhost:8080/crypto-all`,
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
      `https://localhost:8080/coins/${id}`,
    );

    const data = await response.json();

    return data as CryptoDetailDto;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
