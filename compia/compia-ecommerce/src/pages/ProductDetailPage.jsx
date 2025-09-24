// src/pages/ProductDetailPage.jsx
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';

const formatPrice = (price) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(price);
};

export const ProductDetailPage = () => {
  // O hook useParams() nos dá acesso aos parâmetros dinâmicos da URL (o :id)
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const addToCart = useCartStore((state) => state.addToCart);

  useEffect(() => {
    // Busca os dados do livro específico usando o ID da URL
    fetch(`/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => setBook(data))
      .catch((err) => console.error('Erro ao buscar detalhes do produto:', err));
  }, [id]); // Roda o efeito novamente se o ID na URL mudar

  // Mostra uma mensagem de carregamento enquanto os dados não chegam
  if (!book) {
    return <div className="container mx-auto p-8 text-center">Carregando...</div>;
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <Link to="/" className="text-blue-600 hover:underline mb-4 inline-block">&larr; Voltar para a loja</Link>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Coluna da Imagem */}
        <div className="h-96 w-full rounded-lg bg-gray-200 shadow-lg">
          {/* Placeholder para a imagem */}
        </div>
        {/* Coluna de Informações */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{book.title}</h1>
          <p className="mt-2 text-lg text-gray-600">por {book.author}</p>
          <p className="mt-6 text-3xl font-bold text-blue-700">
            {formatPrice(book.price.physical || book.price.digital)}
          </p>
          <button onClick={() => {
              addToCart(book);
              alert(`${book.title} foi adicionado ao carrinho!`); // Feedback visual simples
            }} className="mt-6 w-full rounded-lg bg-blue-600 px-6 py-3 text-white font-semibold hover:bg-blue-700 transition-colors">
            Adicionar ao Carrinho
          </button>
          <div className="mt-8">
            <h2 className="text-xl font-semibold">Descrição</h2>
            <p className="mt-2 text-gray-700">{book.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};