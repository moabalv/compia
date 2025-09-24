// src/components/ui/ProductCard.jsx
import { Link } from 'react-router-dom'; // 1. Importe o Link

const formatPrice = (price) => {
  // ... (função igual a antes)
};

export const ProductCard = ({ book }) => {
  if (!book) {
    return null;
  }

  // 2. Envolva o card com o componente Link, apontando para a URL correta
  return (
    <Link to={`/produto/${book.id}`} className="flex flex-col w-64 flex-shrink-0">
      <div className="flex flex-1 flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md transition-transform duration-300 hover:scale-105 hover:shadow-lg">
        <img src={book.coverUrl} alt={`Capa do livro ${book.title}`} className="h-64 w-full object-cover" />
        <div className="flex flex-1 flex-col p-4">
          <h3 className="text-lg font-bold text-gray-800">{book.title}</h3>
          <p className="mt-1 text-sm text-gray-500">{book.author}</p>
          <p className="mt-4 text-xl font-semibold text-blue-600">
            {formatPrice(book.price.physical || book.price.digital)}
          </p>
        </div>
      </div>
    </Link>
  );
};