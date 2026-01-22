import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';

export function MainLayout() {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      
      <main className="flex-1 overflow-auto">
        {/* Header Mobile poderia entrar aqui futuramente */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center px-8 justify-between md:hidden">
           <span className="font-bold text-slate-700">PetAdmin Mobile</span>
           {/* Aqui entraria um botão de menu hambúrguer */}
        </header>

        <div className="p-8 max-w-7xl mx-auto">
          {/* O Outlet renderiza a página atual (Pets, Tutores, etc) */}
          <Outlet /> 
        </div>
      </main>
    </div>
  );
}