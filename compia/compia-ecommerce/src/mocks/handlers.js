// src/mocks/handlers.js
import { http, HttpResponse } from 'msw';
import { books } from './data';

export const handlers = [
  // Handler para pegar todos os livros
  http.get('/api/products', () => {
    return HttpResponse.json(books);
  }),
  

  // Handler para pegar um livro específico pelo ID
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
];