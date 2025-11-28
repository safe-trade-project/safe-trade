import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import { CryptosPage } from './pages/CryptosPage';
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
path: '/stocks',
element: <StocksPage />,
},
]);
