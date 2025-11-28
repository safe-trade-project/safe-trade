import type { StockDto } from '../contracts/stock.dto';

type Props = {
	stocks: StockDto[];
};

export const StockList = ({ stocks }: Props) => {
	return (
		<div className="flex flex-col gap-3">
			{stocks.map((stock) => (
				<div 
					key={stock.ticker} 
					className="border rounded-lg p-4 hover:bg-gray-50 flex items-center gap-4"
				>
					<div className="flex-1 flex items-center justify-between">
						<div>
							<h2 className="text-xl font-semibold">{stock.name}</h2>
							<p className="text-sm text-gray-600 uppercase">{stock.ticker}</p>
						</div>
						<div className="flex items-center gap-6">
							<div className="text-right">
								<p className="text-xs text-gray-500">Price</p>
								<p className="text-lg font-semibold">
									${stock.price.toLocaleString()}
								</p>
							</div>
							<div className="text-right">
								<p className="text-xs text-gray-500">Day Change</p>
								<p className={`text-lg font-semibold ${stock.day_change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
									{stock.day_change >= 0 ? '+' : ''}
									{stock.day_change.toFixed(2)}%
								</p>
							</div>
							<div className="text-right">
								<p className="text-xs text-gray-500">Day High</p>
								<p className="text-lg font-semibold">${stock.day_high.toLocaleString()}</p>
							</div>
							<div className="text-right">
								<p className="text-xs text-gray-500">Day Low</p>
								<p className="text-lg font-semibold">${stock.day_low.toLocaleString()}</p>
							</div>
						</div>
					</div>
				</div>
			))}
		</div>
	);
};
