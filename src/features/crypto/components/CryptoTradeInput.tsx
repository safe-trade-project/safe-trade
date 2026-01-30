import { useState, useMemo, useCallback } from 'react';
import { formatPrice } from '../../../lib/utils';

interface CryptoTradeInputProps {
  cryptoId: string;
  cryptoName: string;
  cryptoSymbol: string;
  cryptoImage: string;
  currentPrice: number;
  type: 'buy' | 'sell';
  balanceUSD: number;
  balanceCrypto: number;
  onSubmit: (amount: number, total: number) => void;
}

export function CryptoTradeInput({
  cryptoName,
  cryptoSymbol,
  cryptoImage,
  currentPrice,
  type,
  balanceUSD,
  balanceCrypto,
  onSubmit,
}: CryptoTradeInputProps) {
  const [inputValue, setInputValue] = useState<string>('');
  const [isUsdMode, setIsUsdMode] = useState(true);

  const maxAmount = type === 'buy' 
    ? (isUsdMode ? balanceUSD : balanceUSD / currentPrice)
    : (isUsdMode ? balanceCrypto * currentPrice : balanceCrypto);

  const calculatedValue = useMemo(() => {
    const value = parseFloat(inputValue) || 0;
    if (isUsdMode) {
      return currentPrice > 0 ? value / currentPrice : 0;
    }
    return value * currentPrice;
  }, [inputValue, isUsdMode, currentPrice]);

  const handleSwap = useCallback(() => {
    const currentValue = parseFloat(inputValue) || 0;
    if (isUsdMode && currentPrice > 0) {
      setInputValue((currentValue / currentPrice).toFixed(8));
    } else {
      setInputValue((currentValue * currentPrice).toFixed(2));
    }
    setIsUsdMode(!isUsdMode);
  }, [inputValue, isUsdMode, currentPrice]);

  const handleMax = useCallback(() => {
    if (type === 'buy') {
      setInputValue(isUsdMode ? balanceUSD.toFixed(2) : (balanceUSD / currentPrice).toFixed(8));
    } else {
      setInputValue(isUsdMode ? (balanceCrypto * currentPrice).toFixed(2) : balanceCrypto.toFixed(8));
    }
  }, [type, isUsdMode, balanceUSD, balanceCrypto, currentPrice]);

  const handleSubmit = useCallback(() => {
    const value = parseFloat(inputValue) || 0;
    if (value <= 0) return;

    let cryptoAmount: number;
    let usdTotal: number;

    if (isUsdMode) {
      usdTotal = value;
      cryptoAmount = value / currentPrice;
    } else {
      cryptoAmount = value;
      usdTotal = value * currentPrice;
    }

    onSubmit(cryptoAmount, usdTotal);
    setInputValue('');
  }, [inputValue, isUsdMode, currentPrice, onSubmit]);

  const isValid = parseFloat(inputValue) > 0 && parseFloat(inputValue) <= maxAmount;

  return (
    <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <img src={cryptoImage} alt={cryptoName} className="w-8 h-8 rounded-full" />
          <div>
            <span className="text-white font-medium">{cryptoName}</span>
            <span className="text-white/40 text-sm ml-2 uppercase">{cryptoSymbol}</span>
          </div>
        </div>
        <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
          type === 'buy' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
        }`}>
          {type === 'buy' ? 'Kup' : 'Sprzedaj'}
        </span>
      </div>

      <div className="flex items-center gap-2 mb-3">
        <div className="flex-1 relative">
          <input
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="0.00"
            className="w-full h-12 bg-white/[0.03] border border-white/10 rounded-xl px-4 pr-16 text-lg text-white placeholder:text-white/20 outline-none transition-all focus:border-white/20"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 text-sm font-medium">
            {isUsdMode ? 'USD' : cryptoSymbol.toUpperCase()}
          </span>
        </div>

        <button
          onClick={handleSwap}
          className="h-12 w-12 bg-white/[0.03] border border-white/10 rounded-xl flex items-center justify-center text-white/60 hover:text-white hover:bg-white/[0.06] transition-all"
          title="Zamień tryb"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 16V4M7 4L3 8M7 4L11 8M17 8V20M17 20L21 16M17 20L13 16"/>
          </svg>
        </button>
      </div>

      <div className="flex items-center justify-between text-sm mb-4">
        <div className="text-white/40">
          {isUsdMode ? (
            <span>≈ <span className="text-white/60 font-mono">{formatPrice(calculatedValue)}</span> {cryptoSymbol.toUpperCase()}</span>
          ) : (
            <span>≈ <span className="text-white/60 font-mono">${formatPrice(calculatedValue)}</span></span>
          )}
        </div>
        <button
          onClick={handleMax}
          className="text-white/40 hover:text-white transition-colors text-xs"
        >
          Max: {isUsdMode ? `$${formatPrice(type === 'buy' ? balanceUSD : balanceCrypto * currentPrice)}` : `${formatPrice(type === 'buy' ? balanceUSD / currentPrice : balanceCrypto)} ${cryptoSymbol.toUpperCase()}`}
        </button>
      </div>

      <button
        onClick={handleSubmit}
        disabled={!isValid}
        className={`w-full h-11 rounded-xl font-semibold text-sm uppercase tracking-wider transition-all ${
          type === 'buy'
            ? 'bg-emerald-500 hover:bg-emerald-400 text-white disabled:bg-emerald-500/20 disabled:text-emerald-500/40'
            : 'bg-red-500 hover:bg-red-400 text-white disabled:bg-red-500/20 disabled:text-red-500/40'
        }`}
      >
        {type === 'buy' ? 'Kup' : 'Sprzedaj'} {cryptoSymbol.toUpperCase()}
      </button>
    </div>
  );
}
