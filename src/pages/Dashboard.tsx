
import react from 'react';
import { useState, useEffect } from 'react';
import { SelectCrypto } from '../features/crypto/components/SelectCrypto';
import { fetchCoins, fetchWeekCandles } from '../features/crypto/services/crypto';
import gecko_to_binance from '../features/crypto/services/gecko_to_binance';
import { CandleChart } from '../features/crypto/components/CandleChart';


export function Dashboard() {
  const [currentCrypto, setCurrentCrypto] = useState("BTC");
  const [coinsData, setCoinsData] = useState([]) as any[];
  const [currentWindow, setCurrentWindow] = useState(1);
  const [candles, setCandles] = useState([]);
  useEffect(() => {
    async function fetchCoinsData() { 
      const data = await fetchCoins();
      setCoinsData(data);
      console.log(data)

    }
    fetchCoinsData();
  }, []);

  useEffect(() => {
    async function fetchData() {
      const candles = await fetchWeekCandles("1w", currentCrypto.symbol, 52);
      setCandles(candles)
    }
    fetchData();
  }, [currentCrypto]);

  

  return (
    <main className="px-20 py-8 h-full">
      <div className='h-full'>
        <div className='text-white flex items-center'>
          <h1 className='text-[3rem] font-semibold'>{currentCrypto.name} - {currentCrypto.current_price}$</h1>
          
          <SelectCrypto currentCrypto={currentCrypto} setCurrentCrypto={setCurrentCrypto} cryptoData={coinsData} />
        </div>
        <div className='text-white h-full'>
          <button onClick={() => setCurrentWindow(1)}>1W</button>
          <button onClick={() => setCurrentWindow(2)}>2W</button>
          {currentWindow === 1 && 
            <CandleChart
            
              candles={candles}

            />
          }

        </div>
      </div>
      <div>
        
      </div>

    </main>
  )

}