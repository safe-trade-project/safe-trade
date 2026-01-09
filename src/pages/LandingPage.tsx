import { Sparkles, ArrowRight, TrendingUp, ShieldCheck, Zap, Loader2 } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { fetchCoins } from '../features/crypto/services/crypto'
import { Link } from 'react-router-dom'

export const LandingPage = () => {
  const { data: cryptos, isLoading } = useQuery({
    queryKey: ['top-cryptos'],
    queryFn: fetchCoins,
  });

  const featuredCryptos = cryptos?.slice(0, 5) || [];

  return (
    <div className="flex h-full overflow-hidden bg-background relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="w-full lg:w-[55%] h-full p-8 lg:p-16 flex flex-col justify-center items-start gap-y-8 z-10">
        <div className="animate-fade-in-down bg-primary/10 border-primary/20 border backdrop-blur-sm rounded-full w-fit px-4 py-1.5 flex items-center gap-x-2">
          <Sparkles className="text-primary w-4 h-4" />
          <p className='text-primary text-xs font-bold tracking-widest uppercase'>Platform Beta</p>
        </div>

        <div className="space-y-2">
          <h1 className='font-black text-6xl md:text-7xl lg:text-8xl text-white leading-[0.9]'>
            LEARN TO <br />
            <span className="text-primary drop-shadow-[0_0_10px_rgba(5,211,242,0.3)]">TRADE.</span>
          </h1>
          <p className="text-4xl md:text-5xl font-bold text-white/40 tracking-medium">
            WITHOUT THE RISK.
          </p>
        </div>

        <div className='text-lg md:text-xl text-white/50 max-w-lg space-y-4 leading-relaxed font-medium'>
          <p>Master the markets with <span className="text-white">real-time data</span> and <span className="text-white">zero financial risk</span>. Build your confidence before you commit.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <Link to="/cryptos">
            <button className='group relative px-10 py-4 rounded-xl flex items-center gap-x-3 bg-primary text-background font-black text-lg transition-all hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(5,211,242,0.5)] active:scale-95 overflow-hidden'>
              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 skew-x-12" />
              START TRADING
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </button>
          </Link>
          
          <Link to="/cryptos">
            <button className='px-10 py-4 rounded-xl border-2 border-white/10 text-white font-bold text-lg hover:bg-white/5 hover:border-white/20 transition-all'>
              VIEW MARKETS
            </button>
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-12 mt-12 pt-12 border-t border-white/5 w-full max-w-xl">
          <div className="flex flex-col gap-1 group">
            <TrendingUp className="text-primary w-5 h-5 mb-1 group-hover:scale-110 transition-transform" />
            <p className="text-white font-bold text-sm">Real-time</p>
            <p className="text-white/30 text-[10px] uppercase font-bold tracking-wider">Market Data</p>
          </div>
          <div className="flex flex-col gap-1 group">
            <ShieldCheck className="text-primary w-5 h-5 mb-1 group-hover:scale-110 transition-transform" />
            <p className="text-white font-bold text-sm">Zero Risk</p>
            <p className="text-white/30 text-[10px] uppercase font-bold tracking-wider">Paper Trading</p>
          </div>
          <div className="flex flex-col gap-1 group">
            <Zap className="text-primary w-5 h-5 mb-1 group-hover:scale-110 transition-transform" />
            <p className="text-white font-bold text-sm">Instant</p>
            <p className="text-white/30 text-[10px] uppercase font-bold tracking-wider">Execution</p>
          </div>
        </div>
      </div>

      <div className="hidden lg:flex w-[45%] h-full relative items-center justify-center bg-background-light/30 p-12">
        <div className="relative w-full max-w-md">
          <div className="flex items-center justify-between mb-4 px-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 " />
              <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Live Market Feed</span>
            </div>
          </div>

          <div className="flex flex-col border border-white/10 rounded-3xl overflow-hidden bg-background/40 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-32 gap-4">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
                <p className="text-white/20 text-xs font-bold uppercase tracking-widest animate-pulse">Syncing Data</p>
              </div>
            ) : (
              featuredCryptos.map((crypto, index) => (
                <div 
                  key={crypto.id} 
                  className={`w-full p-5 flex justify-between items-center transition-all duration-300 hover:bg-white/[0.03] group ${index !== featuredCryptos.length - 1 ? 'border-b border-white/5' : ''}`}
                >
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <img src={crypto.image} alt={crypto.name} className="w-10 h-10 rounded-full grayscale-[0.2] group-hover:grayscale-0 transition-all duration-500" />
                      <div className="absolute inset-0 rounded-full shadow-[inset_0_0_10px_rgba(0,0,0,0.2)]" />
                    </div>
                    <div>
                      <p className="text-white font-black text-md tracking-tight group-hover:text-primary transition-colors">{crypto.name}</p>
                      <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest">{crypto.symbol}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-black text-base tracking-tighter">
                      ${crypto.current_price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </p>
                    <div className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-black mt-1 ${
                      crypto.price_change_percentage_24h >= 0 
                        ? 'bg-green-500/10 text-green-400' 
                        : 'bg-red-500/10 text-red-400'
                    }`}>
                      {crypto.price_change_percentage_24h >= 0 ? '▲' : '▼'} {Math.abs(crypto.price_change_percentage_24h).toFixed(2)}%
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="mt-6 flex justify-center">
            <div className="h-1 w-24 bg-gradient-to-r from-transparent via-white/10 to-transparent rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};
