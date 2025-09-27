// src/pages/CheckoutPage.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { QRCodeCanvas } from "qrcode.react";
import { useCartStore } from '../store/cartStore';
import { useOrderStore } from '../store/orderStore';


// Função para formatar o preço
const formatPrice = (price) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);

export const CheckoutPage = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [pixKey, setPixKey] = useState("");

  // Pegando os dados e ações das nossas stores
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const addOrder = useOrderStore((state) => state.addOrder);
  const total = items.reduce((acc, item) => acc + (item.price.physical || item.price.digital) * item.quantity, 0);
  
  const paymentMethod = watch("paymentMethod");

  const generatePixKey = () => "pix-" + Math.random().toString(36).substring(2, 9);

  useEffect(() => {
    if (paymentMethod === "pix") {
      setPixKey(generatePixKey());
    } else {
      setPixKey("");
    }
  }, [paymentMethod]);

  const onSubmit = async (data) => {
    setIsLoading(true);

    // Criando o objeto do pedido com os itens do carrinho e os dados do formulário
    const newOrder = {
      id: new Date().getTime(),
      customer: {
        name: data.name,
        address: data.address,
        city: data.city,
        zip: data.zip,
      },
      payment: {
        method: data.paymentMethod,
        details: data.paymentMethod === 'card' ? { brand: data.brand } : {}
      },
      items: items,
      total: total,
      date: new Date(),
    };
    
    addOrder(newOrder);
    console.log("📦 Pedido salvo na store:", newOrder);
    
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsLoading(false);
    alert("Pagamento processado com sucesso!");
    
    clearCart();
    navigate("/order-confirmation");
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="mb-8 text-3xl font-bold">Finalizar Compra</h1>

      {/* --- INTEGRAÇÃO --- */}
      {/* Layout de duas colunas para o formulário e o resumo */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Coluna Principal: Formulário */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-lg p-6 md:p-8">
          <form onSubmit={handleSubmit(onSubmit)}>
            <h2 className="text-xl font-semibold mb-4">Informações de Envio</h2>
            <div className="space-y-4">
              {/* Nome, Endereço, Cidade, CEP... */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium">Nome Completo</label>
                <input id="name" {...register("name", { required: true })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                {errors.name && <span className="text-red-500 text-sm">Campo obrigatório</span>}
              </div>
              <div>
                <label htmlFor="address" className="block text-sm font-medium">Endereço</label>
                <input id="address" {...register("address", { required: true })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                {errors.address && <span className="text-red-500 text-sm">Campo obrigatório</span>}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="city" className="block text-sm font-medium">Cidade</label>
                  <input id="city" {...register("city", { required: true })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                  {errors.city && <span className="text-red-500 text-sm">Campo obrigatório</span>}
                </div>
                <div>
                  <label htmlFor="zip" className="block text-sm font-medium">CEP</label>
                  <input id="zip" {...register("zip", { required: true })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                  {errors.zip && <span className="text-red-500 text-sm">Campo obrigatório</span>}
                </div>
              </div>
            </div>

            <h2 className="text-xl font-semibold mt-8 mb-4">Método de Pagamento</h2>
            <div className="space-y-4">
              {/* Opções de Rádio: Cartão, PIX, PayPal... */}
               <div><label className="inline-flex items-center"><input type="radio" {...register("paymentMethod", { required: true })} value="card" className="form-radio text-indigo-600" /><span className="ml-2">Cartão de Crédito/Débito</span></label></div>
               <div><label className="inline-flex items-center"><input type="radio" {...register("paymentMethod", { required: true })} value="pix" className="form-radio text-indigo-600" /><span className="ml-2">PIX</span></label></div>
               <div><label className="inline-flex items-center"><input type="radio" {...register("paymentMethod", { required: true })} value="paypal" className="form-radio text-indigo-600" /><span className="ml-2">PayPal</span></label></div>
               {errors.paymentMethod && <span className="text-red-500 text-sm block">Selecione um método de pagamento</span>}
            </div>

            {paymentMethod === "card" && (
              <div className="mt-6 space-y-4 border rounded p-4 bg-gray-50">
                {/* Campos do Cartão... */}
                <div><label className="block text-sm font-medium">Número do Cartão</label><input {...register("cardNumber", { required: true })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-sm font-medium">Validade (MM/AA)</label><input {...register("expiry", { required: true })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" /></div>
                  <div><label className="block text-sm font-medium">CVV</label><input {...register("cvv", { required: true })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" /></div>
                </div>
                <div><label className="block text-sm font-medium">Bandeira</label><select {...register("brand", { required: true })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"><option value="">Selecione</option><option value="visa">Visa</option><option value="mastercard">MasterCard</option><option value="elo">Elo</option></select></div>
              </div>
            )}
            
            {paymentMethod === "pix" && (
              <div className="mt-6 p-4 border rounded bg-gray-50 text-center">
                <p className="text-sm text-gray-600">Use a chave PIX ou o QR Code abaixo:</p>
                <p className="font-mono text-lg font-bold mt-2 break-all">{pixKey}</p>
                <div className="flex justify-center mt-4">
                  <QRCodeCanvas value={pixKey} size={160} />
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 mt-8 disabled:bg-gray-400"
              disabled={isLoading || items.length === 0}
            >
              {isLoading ? "Processando..." : `Pagar ${formatPrice(total)}`}
            </button>
          </form>
        </div>
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 border-b pb-4">Resumo do Pedido</h2>
            {items.length > 0 ? (
              <>
                <div className="space-y-4">
                  {items.map(item => (
                    <div key={item.id} className="flex justify-between items-center text-sm">
                      <div>
                        <p className="font-semibold">{item.title}</p>
                        <p className="text-gray-500">Qtd: {item.quantity}</p>
                      </div>
                      <p>{formatPrice((item.price.physical || item.price.digital) * item.quantity)}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-6 border-t pt-4">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>
              </>
            ) : (
              <p className="text-gray-500">Seu carrinho está vazio.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};