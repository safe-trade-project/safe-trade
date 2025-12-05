import { useParams, useNavigate } from 'react-router-dom';
import { useApi } from '../../../hooks/useApi';
import { fetchCoin } from '../services/crypto';
import type { CryptoDetailDto } from '../contracts/cryptoDetail.dto';

export const CryptoDetails = () => {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const { isLoading, isError, data } = useApi<CryptoDetailDto>(() => fetchCoin(id));

	if (isLoading) {
		return (
			<div className="p-8">
				<div className="text-lg">Loading...</div>
			</div>
		);
	}

	if (isError || !data) {
		return (
			<div className="p-8">
				<div className="text-lg text-red-600">Error loading crypto details</div>
			</div>
		);
	}

	return (
		<div className="p-8 max-w-6xl mx-auto">
			<button
				onClick={() => navigate('/cryptos')}
				className="mb-6 text-blue-600 hover:text-blue-800 flex items-center gap-2"
			>
				← Back to Cryptos
			</button>

			<div className="bg-white rounded-lg shadow-lg p-8">
				<div className="flex items-center gap-6 mb-8 border-b pb-6">
					<img
						src={data.image.large}
						alt={data.name}
						className="w-24 h-24"
					/>
					<div className="flex-1">
						<h1 className="text-4xl font-bold mb-2">{data.name}</h1>
						<p className="text-xl text-gray-600 uppercase">{data.symbol}</p>
						<p className="text-sm text-gray-500 mt-1">Rank #{data.market_cap_rank}</p>
					</div>
					<div className="text-right">
						<p className="text-sm text-gray-500 mb-1">Current Price</p>
						<p className="text-4xl font-bold">
							${data.market_data.current_price.usd.toLocaleString()}
						</p>
					</div>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
					<div className="bg-gray-50 rounded-lg p-4">
						<p className="text-sm text-gray-600 mb-2">24h Change</p>
						<p className={`text-2xl font-semibold ${data.market_data.price_change_percentage_24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
							{data.market_data.price_change_percentage_24h >= 0 ? '+' : ''}
							{data.market_data.price_change_percentage_24h.toFixed(2)}%
						</p>
					</div>
					<div className="bg-gray-50 rounded-lg p-4">
						<p className="text-sm text-gray-600 mb-2">7d Change</p>
						<p className={`text-2xl font-semibold ${data.market_data.price_change_percentage_7d >= 0 ? 'text-green-600' : 'text-red-600'}`}>
							{data.market_data.price_change_percentage_7d >= 0 ? '+' : ''}
							{data.market_data.price_change_percentage_7d.toFixed(2)}%
						</p>
					</div>
					<div className="bg-gray-50 rounded-lg p-4">
						<p className="text-sm text-gray-600 mb-2">30d Change</p>
						<p className={`text-2xl font-semibold ${data.market_data.price_change_percentage_30d >= 0 ? 'text-green-600' : 'text-red-600'}`}>
							{data.market_data.price_change_percentage_30d >= 0 ? '+' : ''}
							{data.market_data.price_change_percentage_30d.toFixed(2)}%
						</p>
					</div>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
					<div className="space-y-4">
						<div className="flex justify-between border-b pb-2">
							<span className="text-gray-600">Market Cap</span>
							<span className="font-semibold">${data.market_data.market_cap.usd.toLocaleString()}</span>
						</div>
						<div className="flex justify-between border-b pb-2">
							<span className="text-gray-600">24h Volume</span>
							<span className="font-semibold">${data.market_data.total_volume.usd.toLocaleString()}</span>
						</div>
						<div className="flex justify-between border-b pb-2">
							<span className="text-gray-600">24h High</span>
							<span className="font-semibold">${data.market_data.high_24h.usd.toLocaleString()}</span>
						</div>
						<div className="flex justify-between border-b pb-2">
							<span className="text-gray-600">24h Low</span>
							<span className="font-semibold">${data.market_data.low_24h.usd.toLocaleString()}</span>
						</div>
					</div>
					<div className="space-y-4">
						<div className="flex justify-between border-b pb-2">
							<span className="text-gray-600">Circulating Supply</span>
							<span className="font-semibold">{data.market_data.circulating_supply.toLocaleString()}</span>
						</div>
						<div className="flex justify-between border-b pb-2">
							<span className="text-gray-600">Total Supply</span>
							<span className="font-semibold">
								{data.market_data.total_supply ? data.market_data.total_supply.toLocaleString() : 'N/A'}
							</span>
						</div>
						<div className="flex justify-between border-b pb-2">
							<span className="text-gray-600">Max Supply</span>
							<span className="font-semibold">
								{data.market_data.max_supply ? data.market_data.max_supply.toLocaleString() : 'N/A'}
							</span>
						</div>
					</div>
				</div>

				{data.description.en && (
					<div className="border-t pt-6">
						<h2 className="text-2xl font-bold mb-4">About {data.name}</h2>
						<div
							className="text-gray-700 leading-relaxed"
							dangerouslySetInnerHTML={{ __html: data.description.en }}
						/>
					</div>
				)}
			</div>
		</div>
	);
};
