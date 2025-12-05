import { useQuery } from '@tanstack/react-query';
import { CryptoList } from '../features/crypto/components/CryptoList';
import { fetchCoins } from '../features/crypto/services/crypto';

export const CryptosPage = () => {
  const { isLoading, isError, data } = useQuery({
    queryKey: ['cryptos'],
    queryFn: fetchCoins,
  });

  if (isLoading) {
    return <div className="p-8">
      <div className="text-lg">Loading...</div>
    </div>;
  }

  if (isError) {
    return <div className="p-8">
      <div className="text-lg text-red-600">Error loading cryptos</div>
    </div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Crypto Market</h1>
      {data && <CryptoList crypto={data} />}
    </div>
  );
};
