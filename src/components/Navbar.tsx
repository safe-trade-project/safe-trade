import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { getPortfolio } from "../features/crypto/services/buy_sell";

export const Navbar = () => {
  const location = useLocation();
  const [portfolio, setPortfolio] = useState(getPortfolio());

  useEffect(() => {
    const interval = setInterval(() => {
      setPortfolio(getPortfolio());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-white shadow-lg mb-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link
            to="/"
            className="text-2xl font-bold text-blue-600 hover:text-blue-800"
          >
            Safe Trade
          </Link>

          <div className="flex items-center gap-6">
            <Link
              to="/"
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                isActive("/")
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              Home
            </Link>
            <Link
              to="/cryptos"
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                isActive("/cryptos") ||
                location.pathname.startsWith("/cryptos/")
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              Cryptos
            </Link>
            <Link
              to="/portfolio"
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                isActive("/portfolio")
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              Portfolio
            </Link>
            <div className="ml-6 pl-6 border-l border-gray-300">
              <div className="text-sm text-gray-600">Balance</div>
              <div className="text-lg font-bold text-green-600">
                ${portfolio.balance.toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
