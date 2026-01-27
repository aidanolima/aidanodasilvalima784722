import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Dog, 
  UserCircle, 
  LogOut, 
  PawPrint 
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut } = useAuth();

  const handleLogout = () => {
    try {
      signOut();
      window.location.replace('/login');
    } catch (error) {
      localStorage.clear();
      window.location.href = '/login';
    }
  };

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Dog, label: 'Pets', path: '/pets' },
    { icon: UserCircle, label: 'Tutores', path: '/tutores' },
  ];

  // Função para navegar e fechar o menu no mobile
  const handleNavigation = (path: string) => {
    navigate(path);
    onClose(); // Fecha o menu automaticamente após o clique (UX Sênior)
  };

  return (
    <aside className={`
      fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-100 flex flex-col h-screen transition-transform duration-300 ease-in-out
      md:static md:translate-x-0
      ${isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
    `}>
      
      <div className="p-8 border-b border-slate-50">
        <div className="flex items-center gap-3 text-blue-600 mb-6">
          <PawPrint size={32} fill="currentColor" />
          <span className="text-2xl font-black tracking-tighter text-slate-900 uppercase">
            PetAdmin
          </span>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 bg-slate-50 text-slate-500 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-red-50 hover:text-red-600 transition-all duration-300 cursor-pointer group"
        >
          <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" />
          Sair do Sistema
        </button>
      </div>

      <nav className="flex-1 p-4 space-y-2 mt-4">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              className={`
                w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 cursor-pointer
                ${isActive 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
                  : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
                }
              `}
            >
              <item.icon size={22} strokeWidth={isActive ? 3 : 2} />
              <span className="font-black uppercase text-xs tracking-widest">
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      <div className="p-8 text-[10px] font-bold text-slate-300 uppercase tracking-widest">
        v2.0 Sênior • 2026
      </div>
    </aside>
  );
}