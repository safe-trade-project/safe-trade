import { createBrowserRouter } from 'react-router-dom';
import { CryptosPage } from './pages/CryptosPage';
import { CryptoDetailsPage } from './pages/CryptoDetailsPage';
import { PortfolioPage } from './pages/PortfolioPage';
import { LandingPage } from './pages/LandingPage';
import { Navbar } from './components/Navbar';

const Layout = ({ children }: { children: React.ReactNode }) => (
  <div className="h-full flex flex-col">
    <Navbar />
    <div className="flex-1">
      {children}
    </div>
  </div>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout><LandingPage /></Layout>,
  },
  {
    path: '/cryptos',
    element: <Layout><CryptosPage /></Layout>,
  },
  {
    path: '/cryptos/:id',
    element: <Layout><CryptoDetailsPage /></Layout>,
  },
  {
    path: '/portfolio',
    element: <Layout><PortfolioPage /></Layout>,
  },
]);
