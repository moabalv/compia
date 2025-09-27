// src/pages/HomePage.jsx
import { useEffect, useState, useMemo } from "react";
import { ProductCard } from "../components/ui/ProductCard";

export const HomePage = () => {
  const [books, setBooks] = useState([]);
  const [selectedTag, setSelectedTag] = useState(null);

  useEffect(() => {
    fetch("/api/products")
      .then((response) => response.json())
      .then((data) => setBooks(data))
      .catch((error) => console.error("Erro ao buscar produtos:", error));
  }, []);

  // 1. Cria uma lista separada para os lançamentos (pegando os 4 primeiros livros)
  const launchBooks = useMemo(() => books.slice(0, 4), [books]);

  // 2. A lógica de filtro que já tínhamos, para a segunda seção
  const allTags = useMemo(() => {
    const tags = new Set();
    books.forEach(book => {
      book.categories.forEach(category => tags.add(category));
    });
    return Array.from(tags);
  }, [books]);

  const filteredBooks = selectedTag
    ? books.filter(book => book.categories.includes(selectedTag))
    : books;

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-12">

      <section>
        <h1 className="mb-4 text-3xl font-bold text-gray-900">Lançamentos</h1>
        <div className="flex space-x-6 overflow-x-auto py-4">
          {/* Mapeia a lista de LANÇAMENTOS */}
          {launchBooks.map((book) => (
            // Ex: className="flex flex-col w-64 flex-shrink-0"
            <ProductCard key={book.id} book={book} />
          ))}
        </div>
      </section>
      <section>
        <h2 className="mb-4 text-3xl font-bold text-gray-900">Todos os Nossos Livros</h2>
        
        {/* Botões de Filtro */}
        <div className="mb-8 flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedTag(null)}
            className={`px-4 py-2 text-sm rounded-full transition-colors ${
              !selectedTag 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Todos
          </button>
          {allTags.map(tag => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-4 py-2 text-sm rounded-full transition-colors ${
                selectedTag === tag 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
        
        {/* Grid responsivo para os produtos */}
        <div className="flex space-x-6 overflow-x-auto py-4">
          {filteredBooks.map((book) => (
            <ProductCard key={book.id} book={book} />
          ))}
        </div>
      </section>
      
    </div>
  );
};