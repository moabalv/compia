// src/App.jsx
import { Outlet } from 'react-router-dom';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';

function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-grow">
        <Outlet /> {/* O conteúdo da rota atual será renderizado aqui */}
      </main>
      <Footer />
    </div>
  );
}

export default App;