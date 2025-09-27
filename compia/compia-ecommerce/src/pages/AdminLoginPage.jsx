// src/pages/AdminLoginPage.jsx
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuthStore } from '../store/authStore';

export const AdminLoginPage = () => {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [error, setError] = useState('');

  const onSubmit = (data) => {
    const success = login(data.username, data.password);
    if (success) {
      navigate('/admin'); // Redireciona para o painel de admin em caso de sucesso
    } else {
      setError('Usuário ou senha inválidos.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-md w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-6 text-center">Login do Admin</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="username">Usuário</label>
            <input
              id="username"
              defaultValue="admin"
              {...register('username', { required: true })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>
          <div>
            <label htmlFor="password">Senha</label>
            <input
              id="password"
              type="password"
              defaultValue="password"
              {...register('password', { required: true })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
};