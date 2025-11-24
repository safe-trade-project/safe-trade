import type { CryptoBasicDto } from '../contracts/cryptoBasic.dto';

type Props = {
	crypto: CryptoBasicDto[];
};

export const CryptoList = ({ crypto }: Props) => {
	return (
		<div className="flex flex-col gap-4 p-4">
			{crypto.map((elem) => (
				<div 
					key={elem.id} 
					className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-violet-600 hover:border-violet-400 flex items-center gap-6 p-6"
				>
					<div className="bg-slate-700 rounded-full p-3 shadow-lg">
						<img 
							src={elem.image} 
							alt={elem.name}
							className="w-16 h-16 rounded-full"
						/>
					</div>
					<div className="flex-1 flex items-center justify-between">
						<div className="flex-1">
							<h2 className="text-3xl font-bold bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">{elem.name}</h2>
							<p className="text-sm text-violet-300 uppercase font-semibold tracking-wider">{elem.symbol}</p>
						</div>
						<div className="flex items-center gap-8">
							<div className="text-right bg-slate-700/50 rounded-xl px-6 py-4 shadow-sm border border-slate-600">
								<p className="text-xs text-gray-400 font-medium mb-1">Price</p>
								<p className="text-3xl font-bold text-blue-400">
									${elem.current_price.toLocaleString()}
								</p>
							</div>
							<div className="text-right bg-slate-700/50 rounded-xl px-6 py-4 shadow-sm border border-slate-600">
								<p className="text-xs text-gray-400 font-medium mb-1">24h Change</p>
								<p className={`text-2xl font-bold ${elem.price_change_percentage_24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
									{elem.price_change_percentage_24h >= 0 ? '▲ +' : '▼ '}
									{elem.price_change_percentage_24h.toFixed(2)}%
								</p>
							</div>
							<div className="text-right bg-gradient-to-br from-violet-600 to-blue-600 rounded-xl px-6 py-4 shadow-lg border border-violet-500">
								<p className="text-xs text-violet-200 font-medium mb-1">Rank</p>
								<p className="text-2xl font-bold text-white">#{elem.market_cap_rank}</p>
							</div>
						</div>
					</div>
				</div>
			))}
		</div>
	);
};
