// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import App from './App.jsx';
import { HomePage } from './pages/HomePage.jsx';
import { ProductDetailPage } from './pages/ProductDetailPage.jsx';
import './index.css';
import { CartPage } from './pages/CartPage.jsx';
import { CheckoutPage } from './pages/CheckoutPage.jsx';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage.jsx';
import { AdminPage } from './pages/AdminPage.jsx'; 
import { AdminLoginPage } from './pages/AdminLoginPage.jsx';
import { ProtectedRoute } from './components/auth/ProtectedRoute.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true, 
        element: <HomePage />,
      },
      {
        path: '/produto/:id', 
        element: <ProductDetailPage />,
      },
      {
        path: '/carrinho',
        element: <CartPage />,
      },
      {
        path: '/checkout',
        element: <CheckoutPage />,
      },
      {
        path: '/order-confirmation',
        element: <OrderConfirmationPage />,
      },
      {
        path: '/admin/login',
        element: <AdminLoginPage />,
      },
      {
        path: '/admin',
        element: <ProtectedRoute />, 
        children: [
          {
            index: true, 
            element: <AdminPage />, 
          }
        ],
      },

    ],
  },
]);

async function enableMocking() {
  if (import.meta.env.MODE !== 'development') {
    return;
  }
  const { worker } = await import('./mocks/browser.js');
  return worker.start({ onUnhandledRequest: 'bypass' });
}

enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );
});