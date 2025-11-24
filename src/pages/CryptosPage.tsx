import { useApi } from '../hooks/useApi';
import { CryptoList } from '../features/crypto/components/CryptoList';
import { fetchCoins } from '../features/crypto/services/crypto';
import type { CryptoBasicDto } from '../features/crypto/contracts/cryptoBasic.dto.ts';

export const CryptosPage = () => {
  const { isLoading, isError, data } = useApi<CryptoBasicDto[]>(fetchCoins);

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-violet-900 to-slate-900">
      <div className="text-3xl font-bold text-violet-400 animate-pulse">Loading...</div>
    </div>;
  }

  if (isError) {
    return <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-violet-900 to-slate-900">
      <div className="text-3xl font-bold text-red-400">Error loading cryptos</div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-violet-900 to-slate-900">
      <div className="w-full py-8 px-4">
        <h1 className="text-6xl font-extrabold bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent mb-8 text-center">Crypto Market</h1>
        {data && <CryptoList crypto={data} />}
      </div>
    </div>
  );
};
