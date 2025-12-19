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
    <nav className="bg-background/90 backdrop-blur-md border-b border-white/5 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link
            to="/"
            className="text-2xl font-bold text-primary hover:opacity-80 transition-opacity"
          >
            Safe Trade
          </Link>

          <div className="flex items-center gap-3">
            <Link
              to="/"
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                isActive("/")
                  ? "bg-primary text-background shadow-[0_0_15px_rgba(5,211,242,0.3)]"
                  : "text-white/70 hover:text-white hover:bg-white/5"
              }`}
            >
              Home
            </Link>
            <Link
              to="/cryptos"
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                isActive("/cryptos") ||
                location.pathname.startsWith("/cryptos/")
                  ? "bg-primary text-background shadow-[0_0_15px_rgba(5,211,242,0.3)]"
                  : "text-white/70 hover:text-white hover:bg-white/5"
              }`}
            >
              Cryptos
            </Link>
            <Link
              to="/portfolio"
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                isActive("/portfolio")
                  ? "bg-primary text-background shadow-[0_0_15px_rgba(5,211,242,0.3)]"
                  : "text-white/70 hover:text-white hover:bg-white/5"
              }`}
            >
              Portfolio
            </Link>
            <div className="ml-4 pl-4 border-l border-white/10">
              <div className="text-[10px] uppercase tracking-wider text-white/40 font-bold">Balance</div>
              <div className="text-lg font-bold text-primary">
                ${portfolio.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
