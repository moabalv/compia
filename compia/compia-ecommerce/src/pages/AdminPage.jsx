// src/pages/AdminPage.jsx
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useOrderStore } from '../store/orderStore';

const formatPrice = (price) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);

export const AdminPage = () => {
  const { register, handleSubmit, reset, setValue } = useForm();
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [editingBookId, setEditingBookId] = useState(null);
  const orders = useOrderStore((state) => state.orders); 

  // Carrega os livros existentes
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await fetch('/api/products'); 
        if (!res.ok) throw new Error(`Erro ${res.status}`);
        const data = await res.json();
        setBooks(data);
      } catch (err) {
        console.error('Erro ao buscar livros:', err);
        setBooks([]);
      }
    };
    fetchBooks();
  }, []);

  // Submissão do formulário 
  const onSubmit = async (data) => {
    const originalBook = books.find(b => b.id === editingBookId);
    const newBookData = {
      title: data.title,
      author: data.author,
      coverUrl: originalBook ? originalBook.coverUrl : "/images/covers/placeholder.jpg",
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
    const newBook = editingBookId ? { ...newBookData, id: editingBookId } : { ...newBookData };


    try {
      const url = editingBookId ? `/api/products/${editingBookId}` : `/api/products`;
      const method = editingBookId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBook),
      });

      if (response.ok) {
        alert(editingBookId ? 'Livro atualizado com sucesso!' : 'Livro adicionado com sucesso!');
        reset();
        setEditingBookId(null);
        const res = await fetch('/api/products');
        setBooks(await res.json());
      } else {
        throw new Error('Falha ao salvar o livro');
      }
    } catch (error) {
      console.error(error);
      alert('Ocorreu um erro.');
    }
  };

  // Excluir livro 
  const handleDelete = async (id) => {
     if (!confirm("Tem certeza que deseja excluir este livro?")) return;

    try {
      const response = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (response.ok) {
        alert("Livro excluído!");
        setBooks(books.filter(b => b.id !== id));
      } else {
        throw new Error('Erro ao excluir');
      }
    } catch (err) {
      console.error(err);
      alert("Erro ao excluir livro.");
    }
  };

  // Editar livro
  const handleEdit = (book) => {
     setEditingBookId(book.id);
    setValue("title", book.title);
    setValue("author", book.author);
    setValue("description", book.description);
    setValue("price_physical", book.price.physical);
    setValue("price_digital", book.price.digital);
    setValue("categories", book.categories.join(', '));
    setValue("isbn", book.details.isbn);
    setValue("pages", book.details.pages);
    setValue("year", book.details.year);
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      {/* Seção de Vendas */}
      <div className="mb-12">
        <h1 className="mb-8 text-3xl font-bold">Pedidos Recentes</h1>
        {orders.length === 0 ? (
          <p>Nenhum pedido registrado nesta sessão.</p>
        ) : (
          <div className="space-y-4">
            {orders.map(order => (
              <div key={order.id} className="rounded-lg border p-4 shadow-sm">
                <div className="flex justify-between">
                  <p className="font-semibold">{order.customer.name}</p>
                  <p className="font-bold text-lg text-green-600">{formatPrice(order.total)}</p>
                </div>
                {/* O campo de email não existe no nosso formulário atual, então foi removido para evitar erros */}
                <ul className="mt-2 list-inside list-disc text-sm">
                  {order.items.map(item => (
                    <li key={item.id}>{item.quantity}x {item.title}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Seção de Gerenciar Livros */}
      <div>
        <h1 className="mb-8 text-3xl font-bold">
          {editingBookId ? "Editar Livro" : "Adicionar Novo Livro"}
        </h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-2xl mx-auto">
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
            <div><label htmlFor="isbn">ISBN</label><input id="isbn" {...register("isbn")} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" /></div>
            <div><label htmlFor="pages">Páginas</label><input id="pages" type="number" {...register("pages", { valueAsNumber: true })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" /></div>
            <div><label htmlFor="year">Ano</label><input id="year" type="number" {...register("year", { valueAsNumber: true })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" /></div>
          </div>
          <button type="submit" className="w-full rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700">
            {editingBookId ? "Salvar Alterações" : "Adicionar Livro"}
          </button>
          {editingBookId && (
            <button type="button" onClick={() => { setEditingBookId(null); reset(); }} className="w-full mt-2 rounded-lg bg-gray-500 px-6 py-2 text-sm font-semibold text-white hover:bg-gray-600">
              Cancelar Edição
            </button>
          )}
        </form>

        <h2 className="mt-12 mb-4 text-2xl font-bold">Livros Cadastrados</h2>
        {books.length === 0 ? (
          <p>Nenhum livro cadastrado.</p>
        ) : (
          <ul className="space-y-2">
            {books.map(book => (
              <li key={book.id} className="flex justify-between items-center border-b py-2">
                <span>{book.title} — {book.author}</span>
                <div className="space-x-2">
                  <button onClick={() => handleEdit(book)} className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 text-sm">Editar</button>
                  <button onClick={() => handleDelete(book.id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm">Excluir</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};