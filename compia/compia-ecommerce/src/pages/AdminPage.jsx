// src/pages/AdminPage.jsx
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

export const AdminPage = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    // 1. Estrutura o objeto do livro como nossa aplicação espera
    const newBook = {
      id: data.title.toLowerCase().replace(/\s+/g, '-'), // Cria um ID simples
      title: data.title,
      author: data.author,
      coverUrl: "/images/covers/placeholder.jpg", // Imagem placeholder
      price: {
        physical: data.price_physical,
        digital: data.price_digital,
      },
      categories: data.categories.split(',').map(c => c.trim()),
      description: data.description,
      details: {
        isbn: data.isbn,
        pages: data.pages,
        year: data.year,
        formats: ["physical", "digital"],
      },
    };

    // 2. Envia os dados para nossa API mockada
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newBook),
      });

      if (response.ok) {
        alert('Livro adicionado com sucesso!');
        reset(); // Limpa o formulário
        navigate('/'); // Navega para a home para ver o resultado
      } else {
        throw new Error('Falha ao adicionar o livro');
      }
    } catch (error) {
      console.error(error);
      alert('Ocorreu um erro.');
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="mb-8 text-3xl font-bold">Adicionar Novo Livro</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-2xl mx-auto">
        {/* Campos do formulário... */}
        <div>
          <label htmlFor="title">Título</label>
          <input id="title" {...register("title", { required: true })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
        </div>
        <div>
          <label htmlFor="author">Autor</label>
          <input id="author" {...register("author", { required: true })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
        </div>
        <div>
          <label htmlFor="description">Descrição</label>
          <textarea id="description" {...register("description", { required: true })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="price_physical">Preço (Físico)</label>
            <input id="price_physical" type="number" step="0.01" {...register("price_physical", { required: true, valueAsNumber: true })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
          </div>
          <div>
            <label htmlFor="price_digital">Preço (Digital)</label>
            <input id="price_digital" type="number" step="0.01" {...register("price_digital", { valueAsNumber: true })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
          </div>
        </div>
        <div>
          <label htmlFor="categories">Categorias (separadas por vírgula)</label>
          <input id="categories" {...register("categories", { required: true })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label htmlFor="isbn">ISBN</label>
            <input id="isbn" {...register("isbn")} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
          </div>
          <div>
            <label htmlFor="pages">Páginas</label>
            <input id="pages" type="number" {...register("pages", { valueAsNumber: true })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
          </div>
          <div>
            <label htmlFor="year">Ano</label>
            <input id="year" type="number" {...register("year", { valueAsNumber: true })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
          </div>
        </div>
        <button type="submit" className="w-full rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700">
          Adicionar Livro
        </button>
      </form>
    </div>
  );
};