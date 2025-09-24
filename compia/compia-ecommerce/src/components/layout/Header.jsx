// src/components/layout/Header.jsx
import { Link } from 'react-router-dom';
import { useCartStore } from '../../store/cartStore';

// Ícone de um carrinho de compras (SVG)
const CartIcon = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    className="h-6 w-6" 
    fill="none" 
    viewBox="0 0 24 24" 
    stroke="currentColor"
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth={2} 
      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" 
    />
  </svg>
);


export const Header = () => {
  // Usamos um seletor para pegar apenas o array de items
  const items = useCartStore((state) => state.items);
  // Calculamos o número total de itens no carrinho
  const totalItems = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto flex h-16 items-center justify-between p-4">
        {/* Título/Logo do Site */}
        <Link to="/" className="text-2xl font-bold text-gray-800 hover:text-blue-600">
          Editora COMPIA
        </Link>

        {/* Ícone do Carrinho */}
        <Link to="/carrinho" className="relative flex items-center rounded-full p-2 hover:bg-gray-100">
          <CartIcon />
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
              {totalItems}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
};