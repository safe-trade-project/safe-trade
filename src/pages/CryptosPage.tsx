import { useApi } from '../hooks/useApi';
import { CryptoList } from '../features/crypto/components/CryptoList';
import { fetchCoins } from '../features/crypto/services/crypto';
import type { CryptoBasicDto } from '../features/crypto/contracts/cryptoBasic.dto.ts';

export const CryptosPage = () => {
  const { isLoading, isError, data } = useApi<CryptoBasicDto[]>(fetchCoins);

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="text-xl">Loading...</div>
    </div>;
  }

  if (isError) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="text-xl text-red-600">Error loading cryptos</div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-6 px-4">Crypto List</h1>
        {data && <CryptoList crypto={data} />}
      </div>
    </div>
  );
};
