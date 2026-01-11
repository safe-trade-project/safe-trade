import { AreaSeries, BarSeries, BaselineSeries, createChart, CandlestickSeries  } from 'lightweight-charts';

import React, { useEffect, useRef, useState } from 'react';
type CandleChart = {
  candles : any[]
}
export function CandleChart({ candles } : CandleChart ) {
  const container = useRef(null);
  const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const chartRef = useRef<any>(null);
  const [candlesData, setCandlesData] = useState([]);

  useEffect(() => {
    if (chartRef.current) return
    console.log(container.current)
    const chart = createChart(container.current)
    

    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#26a69a', downColor: '#ef5350', borderVisible: false,
      wickUpColor: '#26a69a', wickDownColor: '#ef5350',
    });

    chartRef.current = chart
    seriesRef.current = candlestickSeries

  }, [])



  return (
    <div className='h-8/10 w-3/5 bg-background-light' ref={container}>

    </div>
  )
}