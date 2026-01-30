import type { Transaction } from '../contracts/portfolio.dto';
import { formatPrice } from '../../../lib/utils';

interface TransactionHistoryProps {
  transactions: Transaction[];
}

export function TransactionHistory({ transactions }: TransactionHistoryProps) {
  if (transactions.length === 0) {
    return (
      <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-8 text-center">
        <span className="text-white/40 text-sm">Brak historii transakcji</span>
      </div>
    );
  }

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('pl-PL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/5">
              <th className="text-left text-white/40 text-xs uppercase tracking-wider font-medium px-4 py-3">Typ</th>
              <th className="text-left text-white/40 text-xs uppercase tracking-wider font-medium px-4 py-3">Crypto</th>
              <th className="text-right text-white/40 text-xs uppercase tracking-wider font-medium px-4 py-3">Ilość</th>
              <th className="text-right text-white/40 text-xs uppercase tracking-wider font-medium px-4 py-3">Cena</th>
              <th className="text-right text-white/40 text-xs uppercase tracking-wider font-medium px-4 py-3">Wartość</th>
              <th className="text-right text-white/40 text-xs uppercase tracking-wider font-medium px-4 py-3">Data</th>
            </tr>
          </thead>
          <tbody>
            {transactions.slice(0, 10).map((tx) => (
              <tr key={tx.id} className="border-b border-white/5 last:border-b-0 hover:bg-white/[0.02] transition-colors">
                <td className="px-4 py-3">
                  <span className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded ${
                    tx.type === 'buy' 
                      ? 'bg-emerald-500/10 text-emerald-400' 
                      : 'bg-red-500/10 text-red-400'
                  }`}>
                    {tx.type === 'buy' ? 'Kupno' : 'Sprzedaż'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-white font-medium">{tx.coinName}</span>
                  <span className="text-white/40 text-sm ml-2 uppercase">{tx.coinSymbol}</span>
                </td>
                <td className="px-4 py-3 text-right text-white font-mono">
                  {formatPrice(tx.amount)}
                </td>
                <td className="px-4 py-3 text-right text-white/60 font-mono">
                  ${formatPrice(tx.price)}
                </td>
                <td className="px-4 py-3 text-right text-white font-mono font-semibold">
                  ${formatPrice(tx.total)}
                </td>
                <td className="px-4 py-3 text-right text-white/40 text-sm">
                  {formatDate(tx.timestamp)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
