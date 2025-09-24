import { Link } from 'react-router-dom';

export const OrderConfirmationPage = () => {
  return (
    <div className="container mx-auto p-8 text-center">
      <h1 className="text-3xl font-bold text-green-600">Pedido Realizado com Sucesso!</h1>
      <p className="mt-4 text-lg">Obrigado pela sua compra. Um email de confirmação (fictício) foi enviado.</p>
      <Link to="/" className="mt-8 inline-block rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700">
        Voltar para a Página Inicial
      </Link>
    </div>
  );
};