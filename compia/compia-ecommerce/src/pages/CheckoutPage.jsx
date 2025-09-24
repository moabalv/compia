// src/pages/CheckoutPage.jsx
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';

export const CheckoutPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const clearCart = useCartStore((state) => state.clearCart);

  // Esta função será chamada apenas se o formulário for válido
  const onSubmit = (data) => {
    console.log('Pedido Fictício Realizado:', data);
    alert('Pedido enviado com sucesso! (Verifique o console)');
    clearCart(); // Limpa o carrinho após o "pedido"
    navigate('/confirmacao'); // Redireciona para a página de confirmação
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="mb-8 text-3xl font-bold">Finalizar Compra</h1>
      {/* O handleSubmit valida o formulário antes de chamar nossa função onSubmit */}
      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Coluna de Informações do Cliente */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Informações de Contato e Entrega</h2>
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Nome Completo</label>
            <input 
              id="fullName"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              {...register("fullName", { required: "Nome é obrigatório" })}
            />
            {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>}
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input 
              id="email"
              type="email"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              {...register("email", { required: "Email é obrigatório", pattern: { value: /^\S+@\S+$/i, message: "Email inválido" } })}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">Endereço</label>
            <input 
              id="address"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              {...register("address", { required: "Endereço é obrigatório" })}
            />
            {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>}
          </div>
        </div>

        {/* Coluna de Pagamento */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Informações de Pagamento (Simulado)</h2>
          <div>
            <label htmlFor="cardName" className="block text-sm font-medium text-gray-700">Nome no Cartão</label>
            <input 
              id="cardName"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              {...register("cardName", { required: "Nome no cartão é obrigatório" })}
            />
            {errors.cardName && <p className="text-red-500 text-sm mt-1">{errors.cardName.message}</p>}
          </div>
          <div>
            <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700">Número do Cartão</label>
            <input 
              id="cardNumber"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              placeholder="0000 0000 0000 0000"
              {...register("cardNumber", { required: "Número do cartão é obrigatório", pattern: { value: /^[0-9]{16}$/, message: "Deve conter 16 dígitos" } })}
            />
            {errors.cardNumber && <p className="text-red-500 text-sm mt-1">{errors.cardNumber.message}</p>}
          </div>
          <button type="submit" className="w-full rounded-lg bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700">
            Finalizar Pedido
          </button>
        </div>
      </form>
    </div>
  );
};