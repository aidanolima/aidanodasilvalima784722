import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { Menu, X, PawPrint } from 'lucide-react';

export function MainLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex min-h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar agora recebe o controle de estado */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      {/* Overlay (Backdrop) - Fecha o menu ao clicar fora no mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 md:hidden animate-in fade-in duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header Mobile Otimizado */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center px-6 justify-between md:hidden z-30">
          <div className="flex items-center gap-3 text-blue-600">
            <PawPrint size={28} fill="currentColor" />
            <span className="text-xl font-black tracking-tighter text-slate-900 uppercase">PetAdminGov</span>
          </div>
          
          <button 
            onClick={toggleSidebar}
            className="p-3 bg-slate-100 text-slate-600 rounded-2xl hover:bg-blue-600 hover:text-white transition-all active:scale-95"
          >
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </header>

        <div className="flex-1 overflow-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet /> 
          </div>
        </div>
      </main>
    </div>
  );
}