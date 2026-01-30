import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchCoin, fetchMarketChart } from "../services/crypto";
import { useState } from "react";
import { buyCoins, sellCoins, getPortfolio } from "../services/buy_sell";
import { CryptoChart } from "./CryptoChart";

export const CryptoDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);
  const [portfolio, setPortfolio] = useState(getPortfolio());

  const { isLoading, isError, data } = useQuery({
    queryKey: ["crypto", id],
    queryFn: () => fetchCoin(id),
    enabled: !!id,
  });

  const [coinAmount, setCoinAmount] = useState("");
  const [cashAmount, setCashAmount] = useState("");

  const currentPrice = data?.market_data.current_price.usd ?? 0;

  const onCoinChange = (val: string) => {
    setCoinAmount(val);
    setCashAmount(String(Number(val) * currentPrice));
  };

  const onUsdChange = (val: string) => {
    setCashAmount(val);
    setCoinAmount(String(Number(val) / currentPrice));
  };

  const handleBuy = () => {
    if (!data) return;

    const numAmount = Number(coinAmount);
    if (!Number.isFinite(numAmount) || numAmount <= 0) {
      setMessage({ text: "Invalid amount", type: "error" });
      return;
    }

    const result = buyCoins(
      data.id,
      data.name,
      data.symbol,
      numAmount,
      data.market_data.current_price.usd,
    );

    if (result.success) {
      setMessage({
        text: `Successfully bought ${numAmount} ${data.symbol.toUpperCase()}`,
        type: "success"
      });
      setCoinAmount("");
      setCashAmount("");
      setPortfolio(getPortfolio());
    } else {
      setMessage({ text: result.error || "Transaction failed", type: "error" });
    }
  };

  const handleSell = () => {
    if (!data) return;

    const numAmount = Number(coinAmount);
    if (!Number.isFinite(numAmount) || numAmount <= 0) {
      setMessage({ text: "Invalid amount", type: "error" });
      return;
    }

    const result = sellCoins(
      data.id,
      data.name,
      data.symbol,
      numAmount,
      data.market_data.current_price.usd,
    );

    if (result.success) {
      setMessage({
        text: `Successfully sold ${numAmount} ${data.symbol.toUpperCase()}`,
        type: "success",
      });
      setCoinAmount("");
      setCashAmount("");
      setPortfolio(getPortfolio());
    } else {
      setMessage({ text: result.error || "Transaction failed", type: "error" });
    }
  };

  const marketQuery = useQuery({
    queryKey: ["chart", id],
    queryFn: () => fetchMarketChart(id),
    enabled: !!id,
  });

  const pricesChartData = marketQuery.data?.prices?.map(([ts, price]) => ({ time: ts, price: price })) ?? [];

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="p-8">
        <div className="text-lg text-red-600">Error loading crypto details</div>
      </div>
    );
  }

  const holding = portfolio.holdings.find((h) => h.coinId === data?.id);

  const totalValue = Number.isFinite(Number(coinAmount)) ? Number(coinAmount) * currentPrice : 0;

  return (
    <div className="p-8 max-w-8/12 mx-auto min-h-screen flex flex-col">
      <button
        onClick={() => navigate('/cryptos')}
        className="mb-6 text-2xl text-blue-500 hover:text-blue-600 flex items-center gap-2"
      >
        ← Back to Cryptos
      </button>

      <div className="rounded-lg shadow-lg p-8 bg-background-light">
        <div className="flex items-center gap-6 mb-8 border-b pb-6">
          <img src={data.image.large} alt={data.name} className="w-24 h-24" />
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-white mb-2">{data.name}</h1>
            <p className="text-xl text-gray-600 uppercase">{data.symbol}</p>
            <p className="text-sm text-gray-500 mt-1">
              Rank #{data.market_cap_rank}
            </p>
            {holding && (
              <p className="text-sm text-green-600 font-semibold mt-2">
                You own: {holding.amount.toFixed(8)} {data.symbol.toUpperCase()}
              </p>
            )}
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500 mb-1">Current Price</p>
            <p className="text-4xl text-white font-bold">
              ${data.market_data.current_price.usd.toLocaleString()}
            </p>
          </div>
        </div>

        {message && (
          <div
            className={`mb-6 p-4 rounded-lg ${message.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
          >
            {message.text}
          </div>
        )}

        <div className="mx-auto flex flex-col lg:flex-row gap-6 mb-6">
          {pricesChartData.length > 0 && (
            <div className="flex-1 min-w-0 p-6">
              <CryptoChart data={pricesChartData} />
            </div>
          )}
          <div className="mt-6 max-w-1/4 bg-white/3 rounded-lg p-6 flex flex-col h-full">
            <h2 className="text-white text-2xl font-bold mb-4">Trade {data.name}</h2>
            <div className="flex flex-col gap-4 flex-1">
              <div className="flex-1">
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Amount ({data.symbol.toUpperCase()})
                </label>
                <input
                  type="text"
                  inputMode="decimal"
                  value={coinAmount}
                  onChange={(e) => onCoinChange(e.target.value.replace(",", "."))}
                  placeholder="0.00"
                  className="w-full text-white px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <p className="block text-sm font-semibold text-gray-300 mb-2">1{data.symbol.toUpperCase()} =~ ${currentPrice.toLocaleString()} USD</p>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Amount USD
                </label>
                <input
                  type="text"
                  inputMode="decimal"
                  value={cashAmount}
                  onChange={(e) => onUsdChange(e.target.value)}
                  placeholder={totalValue.toFixed(2)}
                  className="w-full text-white px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mt-auto flex flex-col gap-1">
                <button
                  onClick={handleBuy}
                  disabled={!coinAmount || Number(coinAmount) <= 0}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold"
                >
                  Buy
                </button>
                <button
                  onClick={handleSell}
                  disabled={!coinAmount || Number(coinAmount) <= 0}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold"
                >
                  Sell
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/3 rounded-lg p-4 ">
            <p className="text-sm mb-2 text-white font-bold">
              24h Change
            </p>
            <p
              className={`text-2xl font-semibold ${data.market_data.price_change_percentage_24h >= 0 ? "text-green-600" : "text-red-600"}`}
            >
              {data.market_data.price_change_percentage_24h >= 0 ? "+" : ""}
              {data.market_data.price_change_percentage_24h.toFixed(2)}%
            </p>
          </div>
          <div className="bg-white/3 rounded-lg p-4">
            <p className="text-sm mb-2 text-white font-bold">
              7d Change
            </p>
            <p
              className={`text-2xl font-semibold ${data.market_data.price_change_percentage_7d >= 0 ? "text-green-600" : "text-red-600"}`}
            >
              {data.market_data.price_change_percentage_7d >= 0 ? "+" : ""}
              {data.market_data.price_change_percentage_7d.toFixed(2)}%
            </p>
          </div>
          <div className="bg-white/3 rounded-lg p-4">
            <p className="text-sm mb-2 text-white font-bold">
              30d Change
            </p>
            <p
              className={`text-2xl font-semibold ${data.market_data.price_change_percentage_30d >= 0 ? "text-green-600" : "text-red-600"}`}
            >
              {data.market_data.price_change_percentage_30d >= 0 ? "+" : ""}
              {data.market_data.price_change_percentage_30d.toFixed(2)}%
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="space-y-4">
            <div className="flex justify-between border-b pb-2">
              <span className="text-primary">Market Cap</span>
              <span className="font-semibold text-white">
                ${data.market_data.market_cap.usd.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-primary">24h Volume</span>
              <span className="font-semibold text-white">
                ${data.market_data.total_volume.usd.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-primary">24h High</span>
              <span className="font-semibold text-white">
                ${data.market_data.high_24h.usd.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-primary">24h Low</span>
              <span className="font-semibold text-white">
                ${data.market_data.low_24h.usd.toLocaleString()}
              </span>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between border-b pb-2">
              <span className="text-primary">Circulating Supply</span>
              <span className="font-semibold text-white">
                {data.market_data.circulating_supply.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-primary">Total Supply</span>
              <span className="font-semibold text-white">
                {data.market_data.total_supply
                  ? data.market_data.total_supply.toLocaleString()
                  : "N/A"}
              </span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-primary">Max Supply</span>
              <span className="font-semibold text-white">
                {data.market_data.max_supply
                  ? data.market_data.max_supply.toLocaleString()
                  : "N/A"}
              </span>
            </div>
          </div>
        </div>

        {data.description.en && (
          <div className="border-t pt-6">
            <h2 className="text-2xl font-bold text-white mb-4 text-">About {data.name}</h2>
            <div
              className="leading-relaxed text-white/70"
              dangerouslySetInnerHTML={{ __html: data.description.en }}
            />
          </div>
        )}
      </div>
    </div>
  );
};
