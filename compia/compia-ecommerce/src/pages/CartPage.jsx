import { useCartStore } from "../store/cartStore";
import { Link, useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";

const formatPrice = (price) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(price);
};

export const CartPage = () => {
  const items = useCartStore((state) => state.items);
  const addToCart = useCartStore((state) => state.addToCart);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const clearCart = useCartStore((state) => state.clearCart);
  const navigate = useNavigate();

  const [shippingOption, setShippingOption] = useState("delivery"); // delivery ou pickup
  const [cep, setCep] = useState(""); // CEP do usuário
  const [calculatedShipping, setCalculatedShipping] = useState(null);

  // Subtotal considerando quantidade e tipo do item
  const subtotal = useMemo(() => {
    return items.reduce((acc, item) => {
      const price =
        item.selectedFormat === "physical"
          ? item.price.physical
          : item.price.digital;
      return acc + price * item.quantity;
    }, 0);
  }, [items]);

  // Calcula frete pelo CEP (simulado)
  const calculateShipping = () => {
    if (!cep || cep.length < 8) {
      alert("Informe um CEP válido");
      return;
    }

    // Simulação de frete por CEP: valor fixo R$20, grátis acima de R$250
    let shippingValue = 20;

    // Só considera itens físicos para frete
    const physicalSubtotal = items.reduce((acc, item) => {
      if (item.selectedFormat === "physical")
        return acc + item.price.physical * item.quantity;
      return acc;
    }, 0);

    if (physicalSubtotal >= 250) shippingValue = 0;

    setCalculatedShipping(shippingValue);
  };

  const shippingCost = useMemo(() => {
    if (shippingOption === "pickup") return 0;
    if (calculatedShipping !== null) return calculatedShipping;
    return 0; // default até calcular
  }, [shippingOption, calculatedShipping]);

  const total = subtotal + shippingCost;

  const handleCheckout = () => {
    if (shippingOption === "delivery" && calculatedShipping === null) {
      alert("Por favor, calcule o frete antes de continuar.");
      return;
    }
    navigate("/checkout", { state: { items, shippingOption, total } });
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto p-8 text-center">
        <h1 className="text-2xl font-bold">Seu carrinho está vazio</h1>
        <Link
          to="/"
          className="mt-4 inline-block rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
        >
          Voltar para a loja
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="mb-8 text-3xl font-bold">Carrinho</h1>

      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={`${item.id}-${item.selectedFormat}`}
            className="flex justify-between items-center border-b py-2"
          >
            <div>
              <p className="font-semibold">
                {item.title} (
                {item.selectedFormat === "physical" ? "Físico" : "E-book"})
              </p>
              <p className="text-sm text-gray-600">
                {item.selectedFormat === "physical"
                  ? formatPrice(item.price.physical)
                  : formatPrice(item.price.digital)}{" "}
                x {item.quantity}
              </p>
            </div>
            <div className="space-x-2">
              <button
                onClick={() => addToCart(item)}
                className="bg-green-500 px-2 py-1 text-white rounded hover:bg-green-600"
              >
                +
              </button>
              <button
                onClick={() => removeFromCart(item)}
                className="bg-red-500 px-2 py-1 text-white rounded hover:bg-red-600"
              >
                -
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Opção de frete */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Opção de entrega</h2>
        <label className="inline-flex items-center mr-4">
          <input
            type="radio"
            value="delivery"
            checked={shippingOption === "delivery"}
            onChange={() => setShippingOption("delivery")}
            className="form-radio"
          />
          <span className="ml-2">Entrega em casa</span>
        </label>
        <label className="inline-flex items-center">
          <input
            type="radio"
            value="pickup"
            checked={shippingOption === "pickup"}
            onChange={() => setShippingOption("pickup")}
            className="form-radio"
          />
          <span className="ml-2">
            Retirada na loja (a partir de 2h, R$ 0,00)
          </span>
        </label>

        {shippingOption === "delivery" && (
          <div className="mt-4">
            <label htmlFor="cep" className="block text-sm font-medium">
              Informe seu CEP:
            </label>
            <input
              id="cep"
              value={cep}
              onChange={(e) => setCep(e.target.value)}
              className="mt-1 block w-40 rounded-md border-gray-300 shadow-sm"
              placeholder="00000000"
            />
            <button
              onClick={calculateShipping}
              className="ml-2 rounded bg-blue-600 px-4 py-1 text-white hover:bg-blue-700"
            >
              Calcular Frete
            </button>
            {calculatedShipping !== null && (
              <p className="mt-2 text-sm">
                Valor do frete:{" "}
                <span className="font-semibold">
                  R$ {calculatedShipping.toFixed(2)}
                </span>{" "}
                {subtotal >= 250 && " (Grátis para compras acima de R$250)"}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Resumo */}
      <div className="mt-6 text-right">
        <p>Subtotal: R$ {subtotal.toFixed(2)}</p>
        <p>Frete: R$ {shippingCost.toFixed(2)}</p>
        <p className="text-xl font-bold">Total: R$ {total.toFixed(2)}</p>
      </div>

      <button
        onClick={handleCheckout}
        className="w-full mt-4 rounded-lg bg-blue-600 px-6 py-3 text-white font-semibold hover:bg-blue-700"
      >
        Finalizar Compra
      </button>

      <button
        onClick={clearCart}
        className="w-full mt-2 rounded-lg bg-gray-500 px-6 py-3 text-white font-semibold hover:bg-gray-600"
      >
        Limpar Carrinho
      </button>
    </div>
  );
};
