import { useApi } from '../hooks/useApi';
import { CryptoList } from '../features/crypto/components/CryptoList';
import { fetchCoins } from '../features/crypto/services/crypto';
import type { CryptoBasicDto } from '../features/crypto/contracts/cryptoBasic.dto.ts';

export const CryptosPage = () => {
  const { isLoading, isError, data } = useApi<CryptoBasicDto[]>(fetchCoins);

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
