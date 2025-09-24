// src/components/layout/Footer.jsx
import { Link } from 'react-router-dom';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-16 bg-gray-100 py-6">
      <div className="container mx-auto text-center text-sm text-gray-500">
        <p>&copy; {currentYear} Editora COMPIA. Todos os direitos reservados.</p>
        <p className="mt-1">Uma plataforma de e-commerce fictícia desenvolvida com React.</p>
        <div className="mt-4">
          <Link to="/admin" className="hover:underline">Admin</Link>
        </div>
      </div>
    </footer>
  );
};