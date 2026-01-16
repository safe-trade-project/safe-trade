import { useState, useEffect, useRef, type Ref } from 'react';
import { SelectCrypto } from '../features/crypto/components/SelectCrypto';
import { fetchCoins, fetchWeekCandles, socketCryptoPrice } from '../features/crypto/services/crypto';
import { CandleChart } from '../features/crypto/components/CandleChart';
import { Select, SelectContent, SelectItem, SelectTrigger } from '../components/ui/select';
import type { CryptoBasicDto } from '../features/crypto/contracts/cryptoBasic.dto';
import { formatPrice } from '../lib/utils';

export function Dashboard() {
  const [currentCrypto, setCurrentCrypto] = useState<CryptoBasicDto | null>(null);
  const [coinsData, setCoinsData] = useState<CryptoBasicDto[]>([]);
  const [candles, setCandles] = useState([]);
  const [interval, setIntervals] = useState({ intervalValue: 1, intervalSign : "w", amount: 100});
  const [cryptoSocket, setCryptoSocket] = useState<WebSocket | null>(null);
  
  const intervals = [
    { label: "minute", value: "m" },
    { label: "hours", value: "h" },
    { label: "day", value: "d" },
    { label: "week", value: "w" },
    { label: "month", value: "M" },
  ];
  const livePrice = useRef<number | null>(null);
  const amountInputRef = useRef<HTMLInputElement>(null);
  const valueInputRef = useRef<HTMLInputElement>(null);
  const buyButtonRef = useRef<HTMLButtonElement>(null);
  const moneyInputRef = useRef<HTMLInputElement>(null);
  const calculatedOutputRef = useRef(null);
  const onSocketMessage = (event: number) => {
    setCurrentCrypto(prev => prev ? { ...prev, current_price: event } : null);
    livePrice.current = event;
  };
  
  useEffect(() => {
    async function fetchCoinsData() { 
      const data = await fetchCoins();
      setCoinsData(data);
      if (data && data.length > 0) {
        setCurrentCrypto(data[0]);
      }
    }
    fetchCoinsData();
    
  }, []);

  useEffect(() => {
    async function fetchData() {
      if (!currentCrypto?.symbol) return;
      const candlesData = await fetchWeekCandles(
        `${interval.intervalValue}${interval.intervalSign}`, 
        currentCrypto.symbol, 
        interval.amount
      )
      if (candlesData.length === 0) return;
      setCandles(candlesData);
    }
    fetchData();

    
  }, [currentCrypto, interval]);

useEffect(() => {
  if (!currentCrypto?.symbol) return;
  const ws = socketCryptoPrice(currentCrypto.symbol, onSocketMessage);
  return () => { if (ws) ws.close(); };

}, [currentCrypto?.symbol]);

  function changeIntervals() {
    const amount = parseInt(amountInputRef.current?.value || "100");
    const value = parseInt(valueInputRef.current?.value || "1");
    setIntervals(prev => ({ 
      ...prev,
      intervalValue: value, 
      amount: amount 
    }));
  }

  return (
    <main className="px-20 py-8 h-full grid-cols-2 grid">
      <div className='h-full '>
        <div className='text-white flex items-center'>
          <h1 className='text-[3rem] font-semibold'>
            {currentCrypto?.name || 'Loading...'} - {formatPrice(currentCrypto?.current_price)}$
          </h1>
          
          <SelectCrypto 
            currentCrypto={currentCrypto} 
            setCurrentCrypto={setCurrentCrypto} 
            cryptoData={coinsData} 
          />
        </div>
        <div className='text-white h-[580px]'>
          
          <CandleChart candles={candles} currentPrice={currentCrypto?.current_price || null} />

          <div className='mt-3'>
            <div className="mt-6 flex items-end gap-3 p-4 rounded-2xl w-fit">
                <Input 
                  ref={valueInputRef}
                  defaultValue={interval.intervalValue}
                  placeholder="1" 
                  type="number"
                  label={"Interval Value"}
                />

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Interval Unit</label>
                <Select 
                  value={interval.intervalSign} 
                  onValueChange={(val) => setIntervals(prev => ({...prev, intervalSign: val}))}
                >
                  <SelectTrigger className="h-10 min-w-[80px] bg-background/50 border border-white/10 rounded-xl px-3 text-sm text-white flex items-center justify-between">
                    <span className="uppercase">{interval.intervalSign}</span>
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
              <Input
                ref={amountInputRef}
                  defaultValue={interval.amount}
                  className="h-10 w-32 bg-background/50 border border-white/10 rounded-xl px-4 text-sm text-white placeholder:text-white/20 outline-none transition-all focus:border-primary/50 focus:ring-1 focus:ring-primary/20 appearance-none remove-arrow" 
                  type="number" 
                  placeholder="100"
                  label={"Amount"}
              />   


              <button 
                onClick={changeIntervals} 
                className="h-10 px-8 bg-primary text-background font-black text-xs uppercase tracking-widest rounded-xl transition-all hover:scale-[1.02] active:scale-95"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className=" w-1/2 px-8">
          <Input
            ref={moneyInputRef}
            label={"Buy amount"}
            type='number'
          />
      </div>
    </main>
  );
}

function Input({ ref, defaultValue, placeholder, type, className, label } : {
  ref: Ref, defaultValue: string | number, placeholder: string, type: string, className?: string, label?: string}) {
  return (
    <div className="flex flex-col gap-1.5">
    {label && <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">{label}</label>}
    <input 
      ref={ref}
      defaultValue={defaultValue}
      className="h-10 w-32 bg-background/50 border border-white/10 rounded-xl px-4 text-sm text-white placeholder:text-white/20 outline-none transition-all focus:border-primary/50 focus:ring-1 focus:ring-primary/20 appearance-none remove-arrow" 
      placeholder={placeholder} 
      type={type}
      />
      </div>
  )
}