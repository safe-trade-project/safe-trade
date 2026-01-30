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

  const maxUsd = type === 'buy' ? balanceUSD : balanceCrypto * currentPrice;
  const maxCrypto = type === 'buy' ? (currentPrice > 0 ? balanceUSD / currentPrice : 0) : balanceCrypto;

  const isValid = cryptoAmount > 0 && (type === 'buy' ? usdAmount <= balanceUSD : cryptoAmount <= balanceCrypto);

  const handleSwap = useCallback(() => {
    const value = parseFloat(inputValue) || 0;
    if (isUsdMode && currentPrice > 0) {
      setInputValue((value / currentPrice).toFixed(8));
    } else {
      setInputValue((value * currentPrice).toFixed(2));
    }
    setIsUsdMode(!isUsdMode);
  }, [inputValue, isUsdMode, currentPrice]);

  const handleMax = useCallback(() => {
    if (isUsdMode) {
      setInputValue(maxUsd.toFixed(2));
    } else {
      setInputValue(maxCrypto.toFixed(8));
    }
  }, [isUsdMode, maxUsd, maxCrypto]);

  const handleSubmit = useCallback(() => {
    if (!isValid) return;
    onSubmit(cryptoAmount, usdAmount);
    setInputValue('');
  }, [isValid, cryptoAmount, usdAmount, onSubmit]);

  return (
    <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <img src={cryptoImage} alt={cryptoName} className="w-7 h-7 rounded-full" />
          <span className="text-white font-medium text-sm">{cryptoName}</span>
          <span className="text-white/40 text-xs uppercase">{cryptoSymbol}</span>
        </div>
        <div className="text-right">
          <span className="text-white/40 text-xs">Cena: </span>
          <span className="text-white font-mono text-sm">${formatPrice(currentPrice)}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-2">
        <div className="flex-1 relative">
          <input
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="0.00"
            className="w-full h-11 bg-white/[0.03] border border-white/10 rounded-xl px-4 pr-14 text-lg text-white placeholder:text-white/20 outline-none transition-all focus:border-white/20"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 text-xs font-medium">
            {isUsdMode ? 'USD' : cryptoSymbol.toUpperCase()}
          </span>
        </div>
        <button
          onClick={handleSwap}
          className="h-11 w-11 bg-white/[0.03] border border-white/10 rounded-xl flex items-center justify-center text-white/60 hover:text-white hover:bg-white/[0.06] transition-all"
          title="Zamień USD/Crypto"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 16V4M7 4L3 8M7 4L11 8M17 8V20M17 20L21 16M17 20L13 16"/>
          </svg>
        </button>
        <button
          onClick={handleMax}
          className="h-11 px-3 bg-white/[0.03] border border-white/10 rounded-xl text-xs text-white/60 hover:text-white hover:bg-white/[0.06] transition-all"
        >
          Max
        </button>
      </div>

      <div className="bg-white/[0.02] rounded-lg p-3 mb-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-white/40">{type === 'buy' ? 'Otrzymasz:' : 'Sprzedajesz:'}</span>
          <span className="text-white font-mono font-semibold">
            {formatPrice(cryptoAmount)} {cryptoSymbol.toUpperCase()}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm mt-1">
          <span className="text-white/40">{type === 'buy' ? 'Zapłacisz:' : 'Otrzymasz:'}</span>
          <span className="text-white font-mono font-semibold">${formatPrice(usdAmount)}</span>
        </div>
        <div className="flex items-center justify-between text-xs mt-2 pt-2 border-t border-white/5">
          <span className="text-white/30">Dostępne:</span>
          <span className="text-white/50 font-mono">${formatPrice(balanceUSD)}</span>
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={!isValid}
        className={`w-full h-10 rounded-xl font-semibold text-sm uppercase tracking-wider transition-all ${
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
