import type { StockDto } from '../contracts/stock.dto';

export const fetchStocks = async () => {
	const TOP_20_SYMBOLS = [
		"AAPL", "NVDA", "MSFT", "GOOGL", "AMZN", "TSLA", "META",
		"BRK.B", "LLY", "AVGO", "JPM", "V", "WMT", "NFLX",
		"MA", "XOM", "UNH", "PG", "HD", "COST"
	] as const;

	const API_TOKEN = import.meta.env.VITE_API_STOCKDATA_KEY;

	const url = `https://api.stockdata.org/v1/data/quote?symbols=${TOP_20_SYMBOLS.join((","))}&api_token=${API_TOKEN}`

	try {
		const response = await fetch(url);
		const result = await response.json();

		if (result.data && Array.isArray(result.data)) {
			return result.data.map((item: any) => ({
				ticker: item.ticker,
				name: item.name,
				price: item.price,
				day_high: item.day_high,
				day_low: item.day_low,
				day_change: item.day_change
			})) as StockDto[];
		}

		return [];
	} catch (error) {
		console.error(error);
		return [];
	}
};
