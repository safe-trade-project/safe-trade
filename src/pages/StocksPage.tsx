import { useApi } from '../hooks/useApi';
import { StockList } from '../features/stocks/components/StockList';
import { fetchStocks } from '../features/stocks/services/stocks';
import type { StockDto } from '../features/stocks/contracts/stock.dto';

export const StocksPage = () => {
  const { isLoading, isError, data } = useApi<StockDto[]>(fetchStocks);

  if (isLoading) {
    return <div className="p-8">
      <div className="text-lg">Loading...</div>
    </div>;
  }

  if (isError) {
    return <div className="p-8">
      <div className="text-lg text-red-600">Error loading stocks</div>
    </div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Stock Market</h1>
      {data && <StockList stocks={data} />}
    </div>
  );
};
