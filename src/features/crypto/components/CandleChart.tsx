import { createChart, ColorType, CandlestickSeries } from 'lightweight-charts';
import type { IChartApi, ISeriesApi, UTCTimestamp } from 'lightweight-charts';
import { useEffect, useRef, useState } from 'react';
import { formatPrice } from '../../../lib/utils';

type CandleChartProps = {
  candles: (string | number)[][]
  currentPrice: number | null;
}

interface CandleData {
  time: UTCTimestamp;
  open: number;
  high: number;
  low: number;
  close: number;
}

export function CandleChart({ candles, currentPrice }: CandleChartProps) {
  const container = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
  
  const [hoverData, setHoverData] = useState<CandleData | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const lastCandleRef = useRef<CandleData | null>(null);

  useEffect(() => {
    if (currentPrice === null || !seriesRef.current || !lastCandleRef.current) return;

    const updatedCandle: CandleData = {
      ...lastCandleRef.current,
      close: currentPrice,
      high: Math.max(lastCandleRef.current.high, currentPrice),
      low: Math.min(lastCandleRef.current.low, currentPrice),
    };
    
    seriesRef.current.update(updatedCandle);
    lastCandleRef.current = updatedCandle;
  }, [currentPrice]);


  useEffect(() => {
    if (!container.current) return;
    const chart = createChart(container.current, {
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: '#d1d4dc',
      },
      grid: {
        vertLines: { color: 'rgba(42, 46, 57, 0.5)' },
        horzLines: { color: 'rgba(42, 46, 57, 0.5)' },
      },
      width: container.current.clientWidth,
      height: container.current.clientHeight,
      timeScale: {
        borderColor: 'rgba(197, 203, 206, 0.2)',
        timeVisible: true,
        secondsVisible: false,
      },
    });


    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderVisible: false,
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350',
      priceFormat: {
        type: 'price',
        precision: 6,
        minMove: 0.000001,
      },
    });

    chart.subscribeCrosshairMove((param) => {
      if (param.time && param.point && param.seriesData.has(candlestickSeries)) {
        const data = param.seriesData.get(candlestickSeries) as CandleData;
        setHoverData(data);
        setMousePos({ x: param.point.x, y: param.point.y });
      } else {
        setHoverData(null);
      }
    });

    chartRef.current = chart;
    seriesRef.current = candlestickSeries;

    const handleResize = () => {
      if (container.current && chartRef.current) {
        chartRef.current.applyOptions({
          width: container.current.clientWidth,
          height: container.current.clientHeight,
        });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, []);

  useEffect(() => {
    if (seriesRef.current && candles && Array.isArray(candles)) {
      const formattedData: CandleData[] = candles.map(candle => ({
        time: Math.floor(Number(candle[0]) / 1000) as UTCTimestamp,
        open: parseFloat(String(candle[1])),
        high: parseFloat(String(candle[2])),
        low: parseFloat(String(candle[3])),
        close: parseFloat(String(candle[4])),
      }));
      seriesRef.current.setData(formattedData);
      lastCandleRef.current = formattedData[formattedData.length - 1];
    }

  }, [candles]);

  return (
    <div className='relative h-full bg-transparent' ref={container}>
      {hoverData && (
        <div 
          className="absolute z-50 bg-black/90 backdrop-blur-md p-3 rounded-lg text-[11px] text-white pointer-events-none border border-white/10 shadow-2xl transition-all duration-75"
          style={{ 
            left: mousePos.x + 20, 
            top: mousePos.y - 100,
            minWidth: '120px'
          }}
        >
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center gap-4 border-b border-white/5 pb-1 mb-1">
              <span className="text-white/40 font-bold uppercase tracking-wider text-[9px]">Market Data</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-white/40 font-medium">Open</span>
              <span className="text-primary font-mono font-semibold">{formatPrice(hoverData.open)}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-white/40 font-medium">High</span>
              <span className="text-green-400 font-mono font-semibold">{formatPrice(hoverData.high)}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-white/40 font-medium">Low</span>
              <span className="text-red-400 font-mono font-semibold">{formatPrice(hoverData.low)}</span>
            </div>
            <div className="flex justify-between gap-4 border-t border-white/5 pt-1 mt-1">
              <span className="text-white/40 font-medium uppercase text-[9px]">Close</span>
              <span className="text-primary font-mono font-semibold">{formatPrice(hoverData.close)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}