// src/pages/HomePage.jsx
import { useEffect, useState } from "react";
import { ProductCard } from "../components/ui/ProductCard";
import { Link } from "react-router-dom";
export const HomePage = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetch("/api/products")
      .then((response) => response.json()) // Converte a resposta para JSON
      .then((data) => setBooks(data)) // Atualiza o estado com os dados recebidos
      .catch((error) => console.error("Erro ao buscar produtos:", error));
  }, []);

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="mb-8 text-3xl font-bold text-gray-900">Lançamentos</h1>
      {/* Grid responsivo para os produtos */}
      <div className="flex space-x-6 overflow-x-auto py-4">
        {/* Mapeia a lista de livros e renderiza um ProductCard para cada um */}
        {books.map((book) => (
          <ProductCard key={book.id} book={book} />
        ))}
      </div>
      <Link
        to="/carrinho"
        className="rounded-lg bg-blue-500 px-4 py-2 font-semibold text-white hover:bg-blue-600"
      >
        Ver Carrinho
      </Link>
    </div>
  );
};
