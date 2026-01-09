import type { Portfolio, Transaction } from "../contracts/portfolio.dto";

const PORTFOLIO_KEY = "safe-trade-portfolio";
const INITIAL_BALANCE = 10000;

export const getPortfolio = (): Portfolio => {
  const stored = localStorage.getItem(PORTFOLIO_KEY);
  if (!stored) {
    const initial: Portfolio = {
      balance: INITIAL_BALANCE,
      holdings: [],
      transactions: [],
    };
    localStorage.setItem(PORTFOLIO_KEY, JSON.stringify(initial));
    return initial;
  }
  return JSON.parse(stored);
};

const savePortfolio = (portfolio: Portfolio) => {
  localStorage.setItem(PORTFOLIO_KEY, JSON.stringify(portfolio));
};

export const buyCoins = (
  coinId: string,
  coinName: string,
  coinSymbol: string,
  amount: number,
  price: number,
): { success: boolean; error?: string } => {
  const portfolio = getPortfolio();
  const total = amount * price;

  if (total > portfolio.balance) {
    return { success: false, error: "Insufficient balance" };
  }

  if (amount <= 0) {
    return { success: false, error: "Amount must be greater than 0" };
  }

  portfolio.balance -= total;

  const existingHolding = portfolio.holdings.find((h) => h.coinId === coinId);
  if (existingHolding) {
    const newTotalAmount = existingHolding.amount + amount;
    const newTotalCost = existingHolding.totalCost + total;
    existingHolding.amount = newTotalAmount;
    existingHolding.totalCost = newTotalCost;
    existingHolding.avgPrice = newTotalCost / newTotalAmount;
  } else {
    portfolio.holdings.push({
      coinId,
      coinName,
      coinSymbol,
      amount,
      avgPrice: price,
      totalCost: total,
    });
  }

  const transaction: Transaction = {
    id: Date.now().toString(),
    coinId,
    coinName,
    coinSymbol,
    type: "buy",
    amount,
    price,
    total,
    timestamp: Date.now(),
  };
  portfolio.transactions.unshift(transaction);

  savePortfolio(portfolio);
  return { success: true };
};

export const sellCoins = (
  coinId: string,
  coinName: string,
  coinSymbol: string,
  amount: number,
  price: number,
): { success: boolean; error?: string } => {
  const portfolio = getPortfolio();
  const holding = portfolio.holdings.find((h) => h.coinId === coinId);

  if (!holding) {
    return { success: false, error: "You do not own this coin" };
  }

  if (amount > holding.amount) {
    return {
      success: false,
      error: `Insufficient coins (you have ${holding.amount})`,
    };
  }

  if (amount <= 0) {
    return { success: false, error: "Amount must be greater than 0" };
  }

  const total = amount * price;
  portfolio.balance += total;

  holding.amount -= amount;
  const costToRemove = (amount / (holding.amount + amount)) * holding.totalCost;
  holding.totalCost -= costToRemove;

  if (holding.amount === 0) {
    portfolio.holdings = portfolio.holdings.filter((h) => h.coinId !== coinId);
  } else {
    holding.avgPrice = holding.totalCost / holding.amount;
  }

  const transaction: Transaction = {
    id: Date.now().toString(),
    coinId,
    coinName,
    coinSymbol,
    type: "sell",
    amount,
    price,
    total,
    timestamp: Date.now(),
  };
  portfolio.transactions.unshift(transaction);

  savePortfolio(portfolio);
  return { success: true };
};

export const resetPortfolio = () => {
  localStorage.removeItem(PORTFOLIO_KEY);
};
