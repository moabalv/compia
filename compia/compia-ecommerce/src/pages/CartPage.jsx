// src/pages/CartPage.jsx
import { useCartStore } from '../store/cartStore';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

const formatPrice = (price) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);

// Função que calcula o frete baseado em CEP e tipo de frete
const calculateShipping = (cep, items, type) => {
  if (!cep) return 0;

  // Simulação de distância baseada no primeiro dígito do CEP
  const firstDigit = cep.trim()[0];
  const baseDistance = firstDigit === '1' ? 10 : firstDigit === '2' ? 20 : 30;

  // Soma das quantidades para “peso” do pedido
  const quantitySum = items.reduce((acc, item) => acc + item.quantity, 0);

  // Multiplicador: expresso é mais caro, econômico é mais barato
  const multiplier = type === 'expresso' ? 2 : 1;

  return (baseDistance + quantitySum * 2) * multiplier;
};

// Simulação de impostos (10% do subtotal)
const calculateTaxes = (subtotal) => subtotal * 0.1;

export const CartPage = () => {
  const navigate = useNavigate();
  const items = useCartStore((state) => state.items);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const clearCart = useCartStore((state) => state.clearCart);

  const [cep, setCep] = useState('');
  const [shippingType, setShippingType] = useState('expresso'); // 'expresso' ou 'economico'
  const [shippingCost, setShippingCost] = useState(0);
  const [taxes, setTaxes] = useState(0);

  // Subtotal dos produtos
  const subtotal = items.reduce((acc, item) => acc + (item.price.physical || item.price.digital) * item.quantity, 0);

  // Atualiza frete e impostos quando CEP, tipo de frete ou itens mudam
  useEffect(() => {
    const cost = calculateShipping(cep, items, shippingType);
    setShippingCost(cost);
    setTaxes(calculateTaxes(subtotal));
  }, [cep, shippingType, items, subtotal]);

  const total = subtotal + shippingCost + taxes;

  if (items.length === 0) {
    return (
      <div className="container mx-auto p-8 text-center">
        <h1 className="text-3xl font-bold">Seu carrinho está vazio</h1>
        <Link to="/" className="mt-4 inline-block text-blue-600 hover:underline">Comece a comprar</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="mb-8 text-3xl font-bold">Seu Carrinho</h1>

      {/* Lista de produtos */}
      <div className="flex flex-col gap-4">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between rounded-lg border p-4 shadow-sm">
            <div>
              <h2 className="font-semibold">{item.title}</h2>
              <p className="text-sm text-gray-600">Quantidade: {item.quantity}</p>
            </div>
            <div className="text-right">
              <p className="font-semibold">{formatPrice((item.price.physical || item.price.digital) * item.quantity)}</p>
              <button onClick={() => removeFromCart(item.id)} className="text-sm text-red-500 hover:underline">Remover</button>
            </div>
          </div>
        ))}
      </div>

      {/* CEP e seleção de frete */}
      <div className="mt-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">CEP</label>
          <input
            type="text"
            placeholder="Ex: 12345-678"
            className="mt-1 block w-48 rounded-md border-gray-300 shadow-sm"
            value={cep}
            onChange={(e) => setCep(e.target.value)}
          />
        </div>
        <div>
          <span className="block text-sm font-medium text-gray-700">Escolha o Frete</span>
          <div className="flex gap-4 mt-1">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="expresso"
                checked={shippingType === 'expresso'}
                onChange={() => setShippingType('expresso')}
              />
              Expresso (até 7 dias)
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="economico"
                checked={shippingType === 'economico'}
                onChange={() => setShippingType('economico')}
              />
              Econômico (até 21 dias) 
            </label>
          </div>
        </div>
      </div>

      {/* Resumo do pedido */}
      <div className="mt-6 border-t pt-4 text-right space-y-1">
        <p>Subtotal: {formatPrice(subtotal)}</p>
        <p>Frete ({shippingType === 'expresso' ? 'Expresso' : 'Econômico'}): {formatPrice(shippingCost)}</p>
        <p>Impostos: {formatPrice(taxes)}</p>
        <p className="text-lg font-bold">Total: {formatPrice(total)}</p>

        <button
          onClick={() => navigate('/checkout', { state: { total, shippingCost, taxes, cep, shippingType } })}
          className="mt-4 rounded-lg bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700"
        >
          Finalizar Compra
        </button>
        <button onClick={clearCart} className="ml-4 text-sm text-gray-500 hover:underline">Esvaziar Carrinho</button>
      </div>
    </div>
  );
};
