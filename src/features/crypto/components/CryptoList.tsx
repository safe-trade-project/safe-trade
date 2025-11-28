import type { CryptoBasicDto } from '../contracts/cryptoBasic.dto';

type Props = {
	crypto: CryptoBasicDto[];
};

export const CryptoList = ({ crypto }: Props) => {
	return (
		<div className="flex flex-col gap-3">
			{crypto.map((elem) => (
				<div 
					key={elem.id} 
					className="border rounded-lg p-4 hover:bg-gray-50 flex items-center gap-4"
				>
					<img 
						src={elem.image} 
						alt={elem.name}
						className="w-12 h-12"
					/>
					<div className="flex-1 flex items-center justify-between">
						<div>
							<h2 className="text-xl font-semibold">{elem.name}</h2>
							<p className="text-sm text-gray-600 uppercase">{elem.symbol}</p>
						</div>
						<div className="flex items-center gap-6">
							<div className="text-right">
								<p className="text-xs text-gray-500">Price</p>
								<p className="text-lg font-semibold">
									${elem.current_price.toLocaleString()}
								</p>
							</div>
							<div className="text-right">
								<p className="text-xs text-gray-500">24h Change</p>
								<p className={`text-lg font-semibold ${elem.price_change_percentage_24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
									{elem.price_change_percentage_24h >= 0 ? '+' : ''}
									{elem.price_change_percentage_24h.toFixed(2)}%
								</p>
							</div>
							<div className="text-right">
								<p className="text-xs text-gray-500">Rank</p>
								<p className="text-lg font-semibold">#{elem.market_cap_rank}</p>
							</div>
						</div>
					</div>
				</div>
			))}
		</div>
	);
};
