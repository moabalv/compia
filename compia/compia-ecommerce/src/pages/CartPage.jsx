// src/pages/CartPage.jsx
import { useCartStore } from '../store/cartStore';
import { Link } from 'react-router-dom';

const formatPrice = (price) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);

export const CartPage = () => {

  const items = useCartStore((state) => state.items);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const clearCart = useCartStore((state) => state.clearCart);

  // Calcula o total
  const total = items.reduce((acc, item) => acc + (item.price.physical || item.price.digital) * item.quantity, 0);

  if (items.length === 0) {
    return (
      <div className="container mx-auto p-8 text-center">
        <h1 className="text-3xl font-bold">Seu carrinho está vazio</h1>
        <Link to="/" className="mt-4 inline-block text-blue-600 hover:underline">
          Comece a comprar
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="mb-8 text-3xl font-bold">Seu Carrinho</h1>
      <div className="flex flex-col gap-4">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between rounded-lg border p-4 shadow-sm">
            <div>
              <h2 className="font-semibold">{item.title}</h2>
              <p className="text-sm text-gray-600">Quantidade: {item.quantity}</p>
            </div>
            <div className="text-right">
              <p className="font-semibold">{formatPrice((item.price.physical || item.price.digital) * item.quantity)}</p>
              <button onClick={() => removeFromCart(item.id)} className="text-sm text-red-500 hover:underline">
                Remover
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 text-right">
        <h2 className="text-2xl font-bold">Total: {formatPrice(total)}</h2>
           <Link to="/checkout" className="mt-4 inline-block rounded-lg bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700">
                Finalizar Compra
            </Link>
        <button onClick={clearCart} className="ml-4 text-sm text-gray-500 hover:underline">
          Esvaziar Carrinho
        </button>
      </div>
    </div>
  );
};