// src/pages/ProductDetailPage.jsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useCartStore } from "../store/cartStore";

const formatPrice = (price) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(price);
};

export const ProductDetailPage = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const addToCart = useCartStore((state) => state.addToCart);
  const [selectedFormat, setSelectedFormat] = useState(null);

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setBook(data);
        setSelectedFormat(data.price.physical ? "physical" : "digital");
      })
      .catch((err) =>
        console.error("Erro ao buscar detalhes do produto:", err)
      );
  }, [id]);

  if (!book) {
    return (
      <div className="container mx-auto p-8 text-center">Carregando...</div>
    );
  }

  const handleAddToCart = () => {
    addToCart({ ...book, selectedFormat });
    alert(
      `${book.title} (${
        selectedFormat === "physical" ? "Físico" : "E-book"
      }) adicionado ao carrinho!`
    );
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <Link to="/" className="text-blue-600 hover:underline mb-4 inline-block">
        &larr; Voltar para a loja
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Imagem do produto */}
        <img 
          src={book.coverUrl} 
          alt={`Capa do livro ${book.title}`}
          className="w-full h-auto max-h-[500px] object-contain rounded-lg shadow-lg mx-auto"
        />

        {/* Informações do produto */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{book.title}</h1>
          <p className="mt-2 text-lg text-gray-600">por {book.author}</p>

          {/* Seleção de formato e preços */}
          <div className="mt-6 mb-4">
            {book.price.physical && (
              <label className="inline-flex items-center mr-4">
                <input
                  type="radio"
                  name="format"
                  value="physical"
                  checked={selectedFormat === "physical"}
                  onChange={() => setSelectedFormat("physical")}
                  className="form-radio"
                />
                <span className="ml-2">
                  Físico ({formatPrice(book.price.physical)})
                </span>
              </label>
            )}
            {book.price.digital && (
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="format"
                  value="digital"
                  checked={selectedFormat === "digital"}
                  onChange={() => setSelectedFormat("digital")}
                  className="form-radio"
                />
                <span className="ml-2">
                  E-book ({formatPrice(book.price.digital)})
                </span>
              </label>
            )}
          </div>

          <p className="text-3xl font-bold text-blue-700 mb-6">
            {selectedFormat === "physical"
              ? formatPrice(book.price.physical)
              : formatPrice(book.price.digital)}
          </p>

          <button
            onClick={handleAddToCart}
            className="mt-6 w-full rounded-lg bg-blue-600 px-6 py-3 text-white font-semibold hover:bg-blue-700 transition-colors"
          >
            Adicionar ao Carrinho
          </button>

          {/* Descrição do livro */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold">Descrição</h2>
            <p className="mt-2 text-gray-700">{book.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
