import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import { CryptosPage } from './pages/CryptosPage';
import { CryptoDetailsPage } from './pages/CryptoDetailsPage';
import { StocksPage } from './pages/StocksPage';

export const router = createBrowserRouter([
{
path: '/',
element: <App />,
},
{
path: '/cryptos',
element: <CryptosPage />,
},
{
path: '/cryptos/:id',
element: <CryptoDetailsPage />,
},
{
path: '/stocks',
element: <StocksPage />,
},
]);
