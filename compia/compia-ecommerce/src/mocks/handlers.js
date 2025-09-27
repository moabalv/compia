// src/mocks/handlers.js
import { http, HttpResponse } from 'msw';
import { books } from './data';

export const handlers = [
  http.get('/api/products', () => {
    return HttpResponse.json(books);
  }),
  

  http.get('/api/products/:id', ({ params }) => {
    const { id } = params;
    const book = books.find((book) => book.id === id);

    if (!book) {
      return new HttpResponse(null, { status: 404 });
    }

    return HttpResponse.json(book);
  }),

  http.post('/api/products', async ({ request }) => {
    const newBook = await request.json();
    
    books.push(newBook);
    
    return HttpResponse.json(newBook, { status: 201 });
  }),
   http.put('/api/products/:id', async ({ params, request }) => {
    const { id } = params;
    const updatedBookData = await request.json();
    const bookIndex = books.findIndex(book => book.id === id);

    if (bookIndex !== -1) {
      // Atualiza o livro no array mantendo o ID original
      books[bookIndex] = { ...books[bookIndex], ...updatedBookData };
      return HttpResponse.json(books[bookIndex]);
    }

    return new HttpResponse(null, { status: 404 }); // Livro não encontrado
  }),

  http.delete('/api/products/:id', ({ params }) => {
    const { id } = params;
    const bookIndex = books.findIndex(book => book.id === id);

    if (bookIndex !== -1) {
      books.splice(bookIndex, 1); // Remove o livro do array
      return new HttpResponse(null, { status: 204 }); // Sucesso, sem conteúdo
    }

    return new HttpResponse(null, { status: 404 }); // Livro não encontrado
  }),
];