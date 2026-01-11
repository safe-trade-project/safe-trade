import { createBrowserRouter } from 'react-router-dom';
import { CryptosPage } from './pages/CryptosPage';
import { CryptoDetailsPage } from './pages/CryptoDetailsPage';
import { PortfolioPage } from './pages/PortfolioPage';
import { LandingPage } from './pages/LandingPage';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Layout>
        <LandingPage />
      </Layout>
    ),
  },
  {
    path: "/cryptos",
    element: (
      <Layout>
        <CryptosPage />
      </Layout>
    ),
  },
  {
    path: "/cryptos/:id",
    element: (
      <Layout>
        <CryptoDetailsPage />
      </Layout>
    ),
  },
  {
    path: "/portfolio",
    element: (
      <Layout>
        <PortfolioPage />
      </Layout>
    ),
  },
  {
    path: "/dashboard",
    element: (
      <Layout>
        <Dashboard />
      </Layout>
    ),
  },
]);
