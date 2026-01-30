import { useState, useEffect, useRef, useCallback } from 'react';
import { SelectCrypto } from '../features/crypto/components/SelectCrypto';
import { fetchCoins, fetchWeekCandles, socketCryptoPrice } from '../features/crypto/services/crypto';
import { getPortfolio, buyCoins, sellCoins } from '../features/crypto/services/buy_sell';
import { CandleChart } from '../features/crypto/components/CandleChart';
import { CryptoTradeInput } from '../features/crypto/components/CryptoTradeInput';
import { PortfolioCard } from '../features/crypto/components/PortfolioCard';
import { Select, SelectContent, SelectItem, SelectTrigger } from '../components/ui/select';
import type { CryptoBasicDto } from '../features/crypto/contracts/cryptoBasic.dto';
import type { Portfolio } from '../features/crypto/contracts/portfolio.dto';
import { formatPrice } from '../lib/utils';

export function Dashboard() {
  const [currentCrypto, setCurrentCrypto] = useState<CryptoBasicDto | null>(null);
  const [coinsData, setCoinsData] = useState<CryptoBasicDto[]>([]);
  const [candles, setCandles] = useState([]);
  const [interval, setIntervals] = useState({ intervalValue: 1, intervalSign: "w", amount: 100 });
  const [portfolio, setPortfolio] = useState<Portfolio>(getPortfolio());

  const intervals = [
    { label: "minuta", value: "m" },
    { label: "godzina", value: "h" },
    { label: "dzień", value: "d" },
    { label: "tydzień", value: "w" },
    { label: "miesiąc", value: "M" },
  ];

  const amountInputRef = useRef<HTMLInputElement>(null);
  const valueInputRef = useRef<HTMLInputElement>(null);

  const refreshPortfolio = useCallback(() => {
    setPortfolio(getPortfolio());
  }, []);

  useEffect(() => {
    async function fetchCoinsData() {
      const data = await fetchCoins();
      setCoinsData(data);
      setCurrentCrypto(prev => {
        if (prev) return prev;
        return data && data.length > 0 ? data[0] : null;
      });
    }
    fetchCoinsData();
    const interval = setInterval(fetchCoinsData, 30000); 
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    async function fetchData() {
      if (!currentCrypto?.symbol) return;
      const candlesData = await fetchWeekCandles(
        `${interval.intervalValue}${interval.intervalSign}`,
        currentCrypto.symbol,
        interval.amount
      );
      if (candlesData.length === 0) return;
      setCandles(candlesData);
    }
    fetchData();
  }, [currentCrypto, interval]);

  useEffect(() => {
    if (!currentCrypto?.symbol) return;
    const onSocketMessage = (price: number) => {
      setCurrentCrypto(prev => prev ? { ...prev, current_price: price } : null);
      setCoinsData(prev => prev.map(c => 
        c.symbol.toLowerCase() === currentCrypto.symbol.toLowerCase() 
          ? { ...c, current_price: price } 
          : c
      ));
    };
    const ws = socketCryptoPrice(currentCrypto.symbol, onSocketMessage);
    return () => { if (ws) ws.close(); };
  }, [currentCrypto?.symbol]);

  const handleBuy = useCallback((amount: number) => {
    if (!currentCrypto) return;
    const result = buyCoins(
      currentCrypto.id,
      currentCrypto.name,
      currentCrypto.symbol,
      amount,
      currentCrypto.current_price
    );
    if (result.success) {
      refreshPortfolio();
    }
  }, [currentCrypto, refreshPortfolio]);

  const handleSell = useCallback((coinId: string, coinName: string, coinSymbol: string, amount: number, price: number) => {
    const result = sellCoins(coinId, coinName, coinSymbol, amount, price);
    if (result.success) {
      refreshPortfolio();
    }
  }, [refreshPortfolio]);

  function changeIntervals() {
    const amount = parseInt(amountInputRef.current?.value || "100");
    const value = parseInt(valueInputRef.current?.value || "1");
    setIntervals(prev => ({
      ...prev,
      intervalValue: value,
      amount: amount
    }));
  }

  const currentHolding = portfolio.holdings.find(h => h.coinId === currentCrypto?.id);
  const totalPortfolioValue = portfolio.holdings.reduce((acc, h) => {
    const crypto = coinsData.find(c => c.id === h.coinId);
    return acc + (crypto ? h.amount * crypto.current_price : 0);
  }, 0);

  const totalCostBasis = portfolio.holdings.reduce((acc, h) => acc + h.totalCost, 0);
  const totalProfitLoss = totalPortfolioValue - totalCostBasis;
  const totalProfitLossPercent = totalCostBasis > 0 ? (totalProfitLoss / totalCostBasis) * 100 : 0;
  const isTotalProfit = totalProfitLoss >= 0;

  return (
    <main className="px-6 py-4 h-screen overflow-hidden flex flex-col">
      <div className="flex items-center justify-between mb-3 flex-shrink-0">
        <div className="flex items-center gap-4">
          {currentCrypto?.image && (
            <img src={currentCrypto.image} alt={currentCrypto.name} className="w-10 h-10 rounded-full" />
          )}
          <div>
            <h1 className="text-white text-2xl font-bold">
              {currentCrypto?.name || 'Loading...'}
            </h1>
            <span className="text-white/40 text-sm font-mono">${formatPrice(currentCrypto?.current_price)}</span>
          </div>
          <SelectCrypto
            currentCrypto={currentCrypto}
            setCurrentCrypto={setCurrentCrypto}
            cryptoData={coinsData}
          />
        </div>

        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-white/40">Gotówka:</span>
            <span className="text-white font-mono font-semibold">${formatPrice(portfolio.balance)}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-white/40">Zysk/Strata:</span>
            <span className={`font-mono font-semibold ${isTotalProfit ? 'text-emerald-400' : 'text-red-400'}`}>
              {isTotalProfit ? '+' : ''}${formatPrice(Math.abs(totalProfitLoss))} 
              <span className="text-[10px] ml-1 opacity-70">({totalProfitLossPercent.toFixed(1)}%)</span>
            </span>
          </div>
          <div className="flex items-center gap-2 pl-4 border-l border-white/10">
            <span className="text-white/40 font-bold">Łącznie:</span>
            <span className="text-white font-mono font-bold text-lg">${formatPrice(portfolio.balance + totalPortfolioValue)}</span>
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0 grid grid-cols-[1fr_360px] gap-6">
        <div className="flex flex-col min-h-0">
          <div className="h-[550px] bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden">
            <CandleChart candles={candles} currentPrice={currentCrypto?.current_price || null} />
          </div>

          <div className="mt-3 flex items-center gap-3 flex-shrink-0">
            <div className="flex flex-col gap-1">
              <label className="text-[9px] font-bold text-white/40 uppercase tracking-wider">Wartość</label>
              <input
                ref={valueInputRef}
                defaultValue={interval.intervalValue}
                type="number"
                className="h-9 w-16 bg-white/[0.03] border border-white/10 rounded-lg px-2 text-sm text-white outline-none focus:border-white/20"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[9px] font-bold text-white/40 uppercase tracking-wider">Jednostka</label>
              <Select
                value={interval.intervalSign}
                onValueChange={(val) => setIntervals(prev => ({ ...prev, intervalSign: val }))}
              >
                <SelectTrigger className="h-9 min-w-[90px] bg-white/[0.03] border border-white/10 rounded-lg px-2 text-sm text-white">
                  <span className="uppercase">{intervals.find(i => i.value === interval.intervalSign)?.label}</span>
                </SelectTrigger>
                <SelectContent>
                  {intervals.map((i) => (
                    <SelectItem key={i.value} value={i.value}>
                      {i.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[9px] font-bold text-white/40 uppercase tracking-wider">Świece</label>
              <input
                ref={amountInputRef}
                defaultValue={interval.amount}
                type="number"
                className="h-9 w-20 bg-white/[0.03] border border-white/10 rounded-lg px-2 text-sm text-white outline-none focus:border-white/20"
              />
            </div>

            <button
              onClick={changeIntervals}
              className="h-9 px-4 bg-white/10 text-white font-semibold text-xs rounded-lg hover:bg-white/15 transition-all mt-auto"
            >
              Zastosuj
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-4 overflow-y-auto">
          {currentCrypto && (
            <CryptoTradeInput
              cryptoId={currentCrypto.id}
              cryptoName={currentCrypto.name}
              cryptoSymbol={currentCrypto.symbol}
              cryptoImage={currentCrypto.image}
              currentPrice={currentCrypto.current_price}
              type="buy"
              balanceUSD={portfolio.balance}
              balanceCrypto={currentHolding?.amount || 0}
              onSubmit={(amount) => handleBuy(amount)}
            />
          )}

          

          {portfolio.holdings.length > 0 && (
            <div>
              <h2 className="text-white/40 text-xs uppercase tracking-wider font-bold mb-2">Sprzedaj</h2>
              <div className="flex flex-col gap-2">
                {portfolio.holdings.map((holding) => {
                  const cryptoInfo = coinsData.find(c => c.id === holding.coinId);
                  return (
                    <PortfolioCard
                      key={holding.coinId}
                      holding={holding}
                      cryptoData={cryptoInfo}
                      onSell={(amount) => handleSell(
                        holding.coinId,
                        holding.coinName,
                        holding.coinSymbol,
                        amount,
                        cryptoInfo?.current_price || 0
                      )}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {portfolio.holdings.length > 0 && (
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-3">
              <h2 className="text-white/40 text-xs uppercase tracking-wider font-bold mb-2">Twoje aktywa</h2>
              <div className="flex flex-col gap-1">
                {portfolio.holdings.map((holding) => {
                  const cryptoInfo = coinsData.find(c => c.id === holding.coinId);
                  const value = holding.amount * (cryptoInfo?.current_price || 0);
                  const profitLoss = value - holding.totalCost;
                  const isProfit = profitLoss >= 0;
                  return (
                    <div
                      key={holding.coinId}
                      onClick={() => {
                        const crypto = coinsData.find(c => c.id === holding.coinId);
                        if (crypto) setCurrentCrypto(crypto);
                      }}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-white/[0.03] cursor-pointer transition-all"
                    >
                      <div className="flex items-center gap-2">
                        {cryptoInfo?.image && (
                          <img src={cryptoInfo.image} alt={holding.coinName} className="w-6 h-6 rounded-full" />
                        )}
                        <div>
                          <span className="text-white text-sm font-medium">{holding.coinSymbol.toUpperCase()}</span>
                          <span className="text-white/30 text-xs ml-1">{formatPrice(holding.amount)}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-white text-sm font-mono">${formatPrice(value)}</div>
                        <div className={`text-[10px] font-mono ${isProfit ? 'text-emerald-400' : 'text-red-400'}`}>
                          {isProfit ? '+' : '-'}${formatPrice(Math.abs(profitLoss))} ({isProfit ? '+' : ''}{((profitLoss / holding.totalCost) * 100).toFixed(1)}%)
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}