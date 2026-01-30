import type { CryptoBasicDto } from "../contracts/cryptoBasic.dto.ts";
import type { CryptoDetailDto } from "../contracts/cryptoDetail.dto.ts";
import type { CryptoMarketDto } from "../contracts/cryptoMarket.dto.ts";
import gecko_to_binance from "./gecko_to_binance.ts";

export const fetchCoins = async () => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/crypto-all`,
    );
    const data = await response.json();
    console.log(data)

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
      `${import.meta.env.VITE_API_BASE_URL}/crypto/${id}`,
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
      `${import.meta.env.VITE_API_BASE_URL}/crypto/${id}/market-chart`,
    );

    const data = await response.json();

    return data as CryptoMarketDto;
  } catch (error) {
    console.error(error);
    throw error;
  }
};


export async function fetchWeekCandles(interval : string, cryptoId : string, limit : number) {
  const binanceCryptoId = gecko_to_binance[cryptoId] || cryptoId;
  console.log("BINANCE ID: ", binanceCryptoId)
  const url = `https://api.binance.com/api/v3/klines?symbol=${binanceCryptoId}&interval=${interval}&limit=${limit}`
  const response = await fetch(url);
  const data = await response.json();


  return data;
}


export function socketCryptoPrice(cryptoId: string, onMessage: (price: number) => void) {
  const binanceCryptoId = gecko_to_binance[cryptoId] || cryptoId;
  const symbol = binanceCryptoId.toLowerCase();
  const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${symbol}@trade`);
  
  let lastPrice = 0;
  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    lastPrice = parseFloat(data.p);
  };

  const intervalId = setInterval(() => {
    if (lastPrice !== 0) onMessage(lastPrice);
  }, 500);

  ws.addEventListener('close', () => {
    clearInterval(intervalId);
  });

  return ws;
}
