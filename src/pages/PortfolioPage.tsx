import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  getPortfolio,
  resetPortfolio,
} from "../features/crypto/services/buy_sell";
import { fetchCoins } from "../features/crypto/services/crypto";
import { formatPrice } from "../lib/utils";

export const PortfolioPage = () => {
  const navigate = useNavigate();
  const [portfolio, setPortfolio] = useState(getPortfolio());
  const { data: coins } = useQuery({
    queryKey: ["cryptos"],
    queryFn: fetchCoins,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setPortfolio(getPortfolio());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const getHoldingValue = (coinId: string, amount: number) => {
    const coin = coins?.find((c) => c.id === coinId);
    return coin ? coin.current_price * amount : 0;
  };

  const totalHoldingsValue = portfolio.holdings.reduce(
    (sum, holding) => sum + getHoldingValue(holding.coinId, holding.amount),
    0,
  );

  const totalValue = portfolio.balance + totalHoldingsValue;
  const totalProfitLoss = totalValue - 10000;

  const handleReset = () => {
    if (
      window.confirm(
        "Are you sure you want to reset your portfolio? This will restore your balance to $10,000 and clear all holdings and transactions.",
      )
    ) {
      resetPortfolio();
      setPortfolio(getPortfolio());
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-screen text-white">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Portfolio</h1>
        <button
          onClick={handleReset}
          className="bg-red-500/10 text-red-400 border border-red-500/20 px-4 py-2 rounded-lg hover:bg-red-500/20 transition-all font-semibold"
        >
          Reset Portfolio
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 text-white">
        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 transition-all hover:bg-white/[0.04]">
          <p className="text-white/40 text-sm mb-2 font-medium uppercase tracking-wider">Gotówka</p>
          <p className="text-3xl font-bold font-mono">${formatPrice(portfolio.balance)}</p>
        </div>
        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 transition-all hover:bg-white/[0.04]">
          <p className="text-white/40 text-sm mb-2 font-medium uppercase tracking-wider">Wartość aktywów</p>
          <p className="text-3xl font-bold font-mono">${formatPrice(totalHoldingsValue)}</p>
        </div>
        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 transition-all hover:bg-white/[0.04]">
          <p className="text-white/40 text-sm mb-2 font-medium uppercase tracking-wider">Łączna wartość</p>
          <p className="text-3xl font-bold font-mono">${formatPrice(totalValue)}</p>
        </div>
        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 transition-all hover:bg-white/[0.04]">
          <p className="text-white/40 text-sm mb-2 font-medium uppercase tracking-wider">Zysk / Strata</p>
          <p
            className={`text-3xl font-bold font-mono ${totalProfitLoss >= 0 ? "text-emerald-400" : "text-red-400"}`}
          >
            {totalProfitLoss >= 0 ? "+" : ""}${formatPrice(Math.abs(totalProfitLoss))}
          </p>
        </div>
      </div>

      <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-8 mb-8">
        <h2 className="text-2xl font-bold mb-6">Twoje Aktywa</h2>
        {portfolio.holdings.length === 0 ? (
          <p className="text-white/20 italic">
            Brak aktywów. Zacznij handlować, aby zbudować swoje portfolio!
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5 text-white/40 text-xs uppercase tracking-wider">
                  <th className="text-left py-4 px-4 font-bold">Kryptowaluta</th>
                  <th className="text-right py-4 px-4 font-bold">Ilość</th>
                  <th className="text-right py-4 px-4 font-bold">Śr. Cena</th>
                  <th className="text-right py-4 px-4 font-bold">Akt. Cena</th>
                  <th className="text-right py-4 px-4 font-bold">Koszt</th>
                  <th className="text-right py-4 px-4 font-bold">Wartość</th>
                  <th className="text-right py-4 px-4 font-bold">Zysk/Strata</th>
                  <th className="text-right py-4 px-4 font-bold">Akcja</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {portfolio.holdings.map((holding) => {
                  const currentValue = getHoldingValue(
                    holding.coinId,
                    holding.amount,
                  );
                  const profitLoss = currentValue - holding.totalCost;
                  const profitLossPercent =
                    (profitLoss / holding.totalCost) * 100;
                  const coin = coins?.find((c) => c.id === holding.coinId);

                  return (
                    <tr
                      key={holding.coinId}
                      className="group hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="py-4 px-4">
                        <div className="font-semibold text-white group-hover:text-primary transition-colors">
                          {holding.coinName}
                        </div>
                        <div className="text-xs text-white/30 font-mono">
                          {holding.coinSymbol.toUpperCase()}
                        </div>
                      </td>
                      <td className="text-right py-4 px-4 font-mono text-sm">
                        {formatPrice(holding.amount)}
                      </td>
                      <td className="text-right py-4 px-4 font-mono text-sm text-white/60">
                        ${formatPrice(holding.avgPrice)}
                      </td>
                      <td className="text-right py-4 px-4 font-mono text-sm text-white/60">
                        ${formatPrice(coin?.current_price)}
                      </td>
                      <td className="text-right py-4 px-4 font-mono text-sm text-white/60">
                        ${formatPrice(holding.totalCost)}
                      </td>
                      <td className="text-right py-4 px-4 font-mono text-sm font-semibold">
                        ${formatPrice(currentValue)}
                      </td>
                      <td
                        className={`text-right py-4 px-4 font-mono font-semibold ${profitLoss >= 0 ? "text-emerald-400" : "text-red-400"}`}
                      >
                        <div className="text-sm">
                          {profitLoss >= 0 ? "+" : ""}${formatPrice(Math.abs(profitLoss))}
                        </div>
                        <div className="text-[10px] opacity-70">
                          ({profitLoss >= 0 ? "+" : ""}
                          {profitLossPercent.toFixed(2)}%)
                        </div>
                      </td>
                      <td className="text-right py-4 px-4">
                        <button
                          onClick={() => navigate(`/cryptos/${holding.coinId}`)}
                          className="bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 px-3 py-1 rounded-md text-xs font-bold transition-all shadow-sm"
                        >
                          HANDEL
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-8">
        <h2 className="text-2xl font-bold mb-6 text-white">Historia Transakcji</h2>
        {portfolio.transactions.length === 0 ? (
          <p className="text-white/20 italic">Brak transakcji.</p>
        ) : (
          <div className="space-y-3">
            {portfolio.transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 rounded-xl border border-white/5 hover:bg-white/[0.01] transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`px-3 py-1 rounded-lg font-bold text-[10px] uppercase tracking-wider ${transaction.type === "buy" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"}`}
                  >
                    {transaction.type === "buy" ? "KUPNO" : "SPRZEDAŻ"}
                  </div>
                  <div>
                    <div className="font-semibold text-sm">
                      {transaction.coinName} (
                      {transaction.coinSymbol.toUpperCase()})
                    </div>
                    <div className="text-[10px] text-white/30 font-mono">
                      {new Date(transaction.timestamp).toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-sm font-mono">
                    {formatPrice(transaction.amount)} @ $
                    {formatPrice(transaction.price)}
                  </div>
                  <div className="text-sm text-gray-600">
                    Total: ${transaction.total.toFixed(2)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
