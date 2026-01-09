export interface Holding {
  coinId: string;
  coinName: string;
  coinSymbol: string;
  amount: number;
  avgPrice: number;
  totalCost: number;
}

export interface Transaction {
  id: string;
  coinId: string;
  coinName: string;
  coinSymbol: string;
  type: "buy" | "sell";
  amount: number;
  price: number;
  total: number;
  timestamp: number;
}

export interface Portfolio {
  balance: number;
  holdings: Holding[];
  transactions: Transaction[];
}
