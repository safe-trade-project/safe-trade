import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getPortfolio, resetPortfolio } from '../features/crypto/services/buy_sell';
import { fetchCoins } from '../features/crypto/services/crypto';

export const PortfolioPage = () => {
	const navigate = useNavigate();
	const [portfolio, setPortfolio] = useState(getPortfolio());
	const { data: coins } = useQuery({
		queryKey: ['cryptos'],
		queryFn: fetchCoins,
	});

	useEffect(() => {
		const interval = setInterval(() => {
			setPortfolio(getPortfolio());
		}, 1000);
		return () => clearInterval(interval);
	}, []);

	const getHoldingValue = (coinId: string, amount: number) => {
		const coin = coins?.find(c => c.id === coinId);
		return coin ? coin.current_price * amount : 0;
	};

	const totalHoldingsValue = portfolio.holdings.reduce(
		(sum, holding) => sum + getHoldingValue(holding.coinId, holding.amount),
		0
	);

	const totalValue = portfolio.balance + totalHoldingsValue;
	const totalProfitLoss = totalValue - 10000;

	const handleReset = () => {
		if (window.confirm('Are you sure you want to reset your portfolio? This will restore your balance to $10,000 and clear all holdings and transactions.')) {
			resetPortfolio();
			setPortfolio(getPortfolio());
		}
	};

	return (
		<div className="p-8 max-w-7xl mx-auto">
			<div className="flex justify-between items-center mb-8">
				<h1 className="text-4xl font-bold">Portfolio</h1>
				<div className="flex gap-4">
					<button
						onClick={handleReset}
						className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
					>
						Reset Portfolio
					</button>
					<button
						onClick={() => navigate('/cryptos')}
						className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
					>
						Back to Cryptos
					</button>
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
				<div className="bg-white rounded-lg shadow-lg p-6">
					<p className="text-gray-600 text-sm mb-2">Cash Balance</p>
					<p className="text-3xl font-bold">${portfolio.balance.toFixed(2)}</p>
				</div>
				<div className="bg-white rounded-lg shadow-lg p-6">
					<p className="text-gray-600 text-sm mb-2">Holdings Value</p>
					<p className="text-3xl font-bold">${totalHoldingsValue.toFixed(2)}</p>
				</div>
				<div className="bg-white rounded-lg shadow-lg p-6">
					<p className="text-gray-600 text-sm mb-2">Total Value</p>
					<p className="text-3xl font-bold">${totalValue.toFixed(2)}</p>
				</div>
				<div className="bg-white rounded-lg shadow-lg p-6">
					<p className="text-gray-600 text-sm mb-2">Profit/Loss</p>
					<p className={`text-3xl font-bold ${totalProfitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
						{totalProfitLoss >= 0 ? '+' : ''}${totalProfitLoss.toFixed(2)}
					</p>
				</div>
			</div>

			<div className="bg-white rounded-lg shadow-lg p-8 mb-8">
				<h2 className="text-2xl font-bold mb-6">Your Holdings</h2>
				{portfolio.holdings.length === 0 ? (
					<p className="text-gray-500">No holdings yet. Start trading to build your portfolio!</p>
				) : (
					<div className="overflow-x-auto">
						<table className="w-full">
							<thead>
								<tr className="border-b">
									<th className="text-left py-3 px-4">Coin</th>
									<th className="text-right py-3 px-4">Amount</th>
									<th className="text-right py-3 px-4">Avg Price</th>
									<th className="text-right py-3 px-4">Current Price</th>
									<th className="text-right py-3 px-4">Total Cost</th>
									<th className="text-right py-3 px-4">Current Value</th>
									<th className="text-right py-3 px-4">P/L</th>
									<th className="text-right py-3 px-4">Action</th>
								</tr>
							</thead>
							<tbody>
								{portfolio.holdings.map((holding) => {
									const currentValue = getHoldingValue(holding.coinId, holding.amount);
									const profitLoss = currentValue - holding.totalCost;
									const profitLossPercent = (profitLoss / holding.totalCost) * 100;
									const coin = coins?.find(c => c.id === holding.coinId);

									return (
										<tr key={holding.coinId} className="border-b hover:bg-gray-50">
											<td className="py-3 px-4">
												<div className="font-semibold">{holding.coinName}</div>
												<div className="text-sm text-gray-500">{holding.coinSymbol.toUpperCase()}</div>
											</td>
											<td className="text-right py-3 px-4">{holding.amount.toFixed(8)}</td>
											<td className="text-right py-3 px-4">${holding.avgPrice.toFixed(2)}</td>
											<td className="text-right py-3 px-4">${coin?.current_price.toFixed(2) || 'N/A'}</td>
											<td className="text-right py-3 px-4">${holding.totalCost.toFixed(2)}</td>
											<td className="text-right py-3 px-4">${currentValue.toFixed(2)}</td>
											<td className={`text-right py-3 px-4 font-semibold ${profitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
												{profitLoss >= 0 ? '+' : ''}${profitLoss.toFixed(2)}
												<div className="text-xs">
													({profitLoss >= 0 ? '+' : ''}{profitLossPercent.toFixed(2)}%)
												</div>
											</td>
											<td className="text-right py-3 px-4">
												<button
													onClick={() => navigate(`/cryptos/${holding.coinId}`)}
													className="text-blue-600 hover:text-blue-800 text-sm font-medium"
												>
													Trade
												</button>
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					</div>
				)}
			</div>

			<div className="bg-white rounded-lg shadow-lg p-8">
				<h2 className="text-2xl font-bold mb-6">Transaction History</h2>
				{portfolio.transactions.length === 0 ? (
					<p className="text-gray-500">No transactions yet.</p>
				) : (
					<div className="space-y-3">
						{portfolio.transactions.map((transaction) => (
							<div
								key={transaction.id}
								className="flex items-center justify-between border-b pb-3"
							>
								<div className="flex items-center gap-4">
									<div className={`px-3 py-1 rounded font-semibold text-sm ${transaction.type === 'buy' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
										{transaction.type.toUpperCase()}
									</div>
									<div>
										<div className="font-semibold">
											{transaction.coinName} ({transaction.coinSymbol.toUpperCase()})
										</div>
										<div className="text-sm text-gray-500">
											{new Date(transaction.timestamp).toLocaleString()}
										</div>
									</div>
								</div>
								<div className="text-right">
									<div className="font-semibold">
										{transaction.amount.toFixed(8)} @ ${transaction.price.toFixed(2)}
									</div>
									<div className="text-sm text-gray-600">
										Total: ${transaction.total.toFixed(2)}
									</div>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
};
