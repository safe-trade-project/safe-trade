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
					className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 border border-gray-200 flex items-center gap-6"
				>
					<img 
						src={elem.image} 
						alt={elem.name}
						className="w-16 h-16 rounded-full"
					/>
					<div className="flex-1 flex items-center justify-between">
						<div className="flex-1">
							<h2 className="text-2xl font-bold text-gray-800">{elem.name}</h2>
							<p className="text-sm text-gray-500 uppercase">{elem.symbol}</p>
						</div>
						<div className="flex items-center gap-8">
							<div className="text-right">
								<p className="text-sm text-gray-600">Price</p>
								<p className="text-2xl font-bold text-blue-600">
									${elem.current_price.toLocaleString()}
								</p>
							</div>
							<div className="text-right">
								<p className="text-sm text-gray-600">24h Change</p>
								<p className={`text-xl font-bold ${elem.price_change_percentage_24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
									{elem.price_change_percentage_24h >= 0 ? '+' : ''}
									{elem.price_change_percentage_24h.toFixed(2)}%
								</p>
							</div>
							<div className="text-right">
								<p className="text-sm text-gray-600">Rank</p>
								<p className="text-xl font-bold text-gray-800">#{elem.market_cap_rank}</p>
							</div>
						</div>
					</div>
				</div>
			))}
		</div>
	);
};
