import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { Loader2 } from 'lucide-react';
import 'react-toastify/dist/ReactToastify.css';

// Pages e Layouts
import { Login } from './pages/auth/Login';
import { MainLayout } from './layouts/MainLayout';
import { TutorDetail } from './pages/tutors/TutorDetail';

// Lazy Loading dos Módulos (Sincronizados para a pasta /tutors/)
const PetList = React.lazy(() => import('./pages/pets/PetList').then(module => ({ default: module.PetList })));
const PetForm = React.lazy(() => import('./pages/pets/PetForm').then(module => ({ default: module.PetForm })));
const PetDetail = React.lazy(() => import('./pages/pets/PetDetail').then(module => ({ default: module.PetDetail })));

const Dashboard = React.lazy(() => import('./pages/Dashboard').then(module => ({ default: module.Dashboard })));

const TutorList = React.lazy(() => import('./pages/tutors/TutorList').then(module => ({ default: module.TutorList })));
const TutorForm = React.lazy(() => import('./pages/tutors/TutorForm').then(module => ({ default: module.TutorForm })));
// CORREÇÃO: Caminho alterado de 'tutores' para 'tutors'
const TutorMaintenance = React.lazy(() => import('./pages/tutors/TutorMaintenance').then(m => ({ default: m.TutorMaintenance })));

// Componente de Loading
const LoadingFallback = () => (
  <div className="flex items-center justify-center h-screen w-full">
    <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
  </div>
);

// Proteção de Rota
function PrivateRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('token');
  return token ? <>{children}</> : <Navigate to="/login" />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rota Pública */}
        <Route path="/login" element={<Login />} />
        
        {/* Rotas Protegidas (Dentro do Layout) */}
        <Route path="/" element={<PrivateRoute><MainLayout /></PrivateRoute>}>
          
          <Route index element={<Navigate to="/dashboard" replace />} />
          
          <Route path="dashboard" element={
            <Suspense fallback={<LoadingFallback />}>
              <Dashboard />
            </Suspense>
          } />
          
          {/* Rotas de Pets */}
          <Route path="pets" element={<Suspense fallback={<LoadingFallback />}><PetList /></Suspense>} />
          <Route path="pets/novo" element={<Suspense fallback={<LoadingFallback />}><PetForm /></Suspense>} />
          <Route path="pets/:id" element={<Suspense fallback={<LoadingFallback />}><PetDetail /></Suspense>} />
          <Route path="pets/:id/editar" element={<Suspense fallback={<LoadingFallback />}><PetForm /></Suspense>} />
          
          {/* Rotas de Tutores */}
          // Substitua as rotas de tutores no seu App.tsx por estas:
<Route path="tutores" element={<Suspense fallback={<LoadingFallback />}><TutorList /></Suspense>} />
<Route path="tutores/novo" element={<Suspense fallback={<LoadingFallback />}><TutorForm /></Suspense>} />
<Route path="tutores/:id" element={<Suspense fallback={<LoadingFallback />}><TutorDetail /></Suspense>} />
<Route path="tutores/:id/editar" element={<Suspense fallback={<LoadingFallback />}><TutorForm /></Suspense>} />
          {/* CORREÇÃO: Apenas TutorMaintenance para o ID (Gerencia Edição, Foto e Pets) */}
          <Route path="tutores/:id" element={<Suspense fallback={<LoadingFallback />}><TutorMaintenance /></Suspense>} />
          
        </Route>

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
      
      <ToastContainer 
        position="bottom-right"
        autoClose={3000}
        theme="colored"
      />
    </BrowserRouter>
  );
}