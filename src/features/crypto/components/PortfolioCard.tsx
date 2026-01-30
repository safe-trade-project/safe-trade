import { useState, useMemo } from 'react';
import type { Holding } from '../contracts/portfolio.dto';
import type { CryptoBasicDto } from '../contracts/cryptoBasic.dto';
import { formatPrice } from '../../../lib/utils';

interface PortfolioCardProps {
  holding: Holding;
  cryptoData: CryptoBasicDto | undefined;
  onSell: (amount: number, total: number) => void;
}

export function PortfolioCard({ holding, cryptoData, onSell }: PortfolioCardProps) {
  const [showSellPanel, setShowSellPanel] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isUsdMode, setIsUsdMode] = useState(false);

  const currentPrice = cryptoData?.current_price || 0;
  const currentValue = holding.amount * currentPrice;
  const profitLoss = currentValue - holding.totalCost;
  const profitLossPercent = holding.totalCost > 0 ? (profitLoss / holding.totalCost) * 100 : 0;
  const isProfit = profitLoss >= 0;

  const { cryptoAmount, usdAmount } = useMemo(() => {
    const value = parseFloat(inputValue) || 0;
    if (isUsdMode) {
      return {
        cryptoAmount: currentPrice > 0 ? value / currentPrice : 0,
        usdAmount: value
      };
    }
    return {
      cryptoAmount: value,
      usdAmount: value * currentPrice
    };
  }, [inputValue, isUsdMode, currentPrice]);

  const isValidSell = cryptoAmount > 0 && cryptoAmount <= holding.amount;

  const handleSell = () => {
    if (!isValidSell) return;
    onSell(cryptoAmount, usdAmount);
    setInputValue('');
    setShowSellPanel(false);
  };

  const handleSwap = () => {
    const value = parseFloat(inputValue) || 0;
    if (isUsdMode && currentPrice > 0) {
      setInputValue((value / currentPrice).toFixed(8));
    } else {
      setInputValue((value * currentPrice).toFixed(2));
    }
    setIsUsdMode(!isUsdMode);
  };

  const handleMax = () => {
    if (isUsdMode) {
      setInputValue((holding.amount * currentPrice).toFixed(2));
    } else {
      setInputValue(holding.amount.toString());
    }
  };

  const handleQuickSell = (percent: number) => {
    const amount = holding.amount * percent;
    if (isUsdMode) {
      setInputValue((amount * currentPrice).toFixed(2));
    } else {
      setInputValue(amount.toFixed(8));
    }
  };

  return (
    <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3 transition-all hover:bg-white/[0.03]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {cryptoData?.image && (
            <img src={cryptoData.image} alt={holding.coinName} className="w-8 h-8 rounded-full" />
          )}
          <div>
            <h3 className="text-white font-semibold text-sm">{holding.coinName}</h3>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-white/40">{formatPrice(holding.amount)} {holding.coinSymbol.toUpperCase()}</span>
              <span className="text-white/60 font-mono">${formatPrice(currentValue)}</span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className={`text-sm font-semibold ${isProfit ? 'text-emerald-400' : 'text-red-400'}`}>
            {isProfit ? '+' : ''}{profitLossPercent.toFixed(1)}%
          </div>
          <button
            onClick={() => setShowSellPanel(!showSellPanel)}
            className="text-xs text-white/40 hover:text-white transition-colors"
          >
            {showSellPanel ? 'Anuluj' : 'Sprzedaj'}
          </button>
        </div>
      </div>

      {showSellPanel && (
        <div className="mt-3 pt-3 border-t border-white/5">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex-1 relative">
              <input
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="0.00"
                className="w-full h-9 bg-white/[0.03] border border-white/10 rounded-lg px-3 pr-14 text-sm text-white placeholder:text-white/20 outline-none focus:border-white/20"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 text-xs">
                {isUsdMode ? 'USD' : holding.coinSymbol.toUpperCase()}
              </span>
            </div>
            <button
              onClick={handleSwap}
              className="h-9 w-9 bg-white/[0.05] border border-white/10 rounded-lg flex items-center justify-center text-white/60 hover:text-white hover:bg-white/[0.08] transition-all"
              title="Zamień tryb"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 16V4M7 4L3 8M7 4L11 8M17 8V20M17 20L21 16M17 20L13 16"/>
              </svg>
            </button>
            <button
              onClick={handleMax}
              className="h-9 px-3 bg-white/[0.05] border border-white/10 rounded-lg text-xs text-white/60 hover:text-white hover:bg-white/[0.08] transition-all"
            >
              Max
            </button>
          </div>
          <div className="flex items-center gap-1 mb-2">
            {[0.25, 0.5, 0.75, 1].map((percent) => (
              <button
                key={percent}
                onClick={() => handleQuickSell(percent)}
                className="flex-1 h-7 bg-white/[0.03] border border-white/10 rounded text-xs text-white/40 hover:text-white hover:bg-white/[0.06] transition-all"
              >
                {percent * 100}%
              </button>
            ))}
          </div>
          <div className="flex items-center justify-between text-xs text-white/40 mb-2">
            {isUsdMode ? (
              <>
                <span>Sprzedajesz:</span>
                <span className="text-white/60 font-mono">{formatPrice(cryptoAmount)} {holding.coinSymbol.toUpperCase()}</span>
              </>
            ) : (
              <>
                <span>Otrzymasz:</span>
                <span className="text-white/60 font-mono">${formatPrice(usdAmount)}</span>
              </>
            )}
          </div>
          <button
            onClick={handleSell}
            disabled={!isValidSell}
            className="w-full h-9 bg-red-500 hover:bg-red-400 text-white font-semibold text-xs uppercase tracking-wider rounded-lg transition-all disabled:bg-red-500/20 disabled:text-red-500/40"
          >
            Sprzedaj {holding.coinSymbol.toUpperCase()}
          </button>
        </div>
      )}
    </div>
  );
}
