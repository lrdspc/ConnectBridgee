import { Link, useLocation } from "wouter";
import { 
  Home, 
  Users,
  ClipboardCheck, 
  Plus, 
  Menu as MenuIcon,
  X,
  Settings,
  User,
  LogOut,
  FileText
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

const BottomNavigation = () => {
  const [location] = useLocation();
  const [showMenu, setShowMenu] = useState(false);
  const { logout } = useAuth();

  const isActive = (path: string) => {
    return location === path || (path !== '/' && location.startsWith(path));
  };

  return (
    <>
      {/* Overlay quando o menu está aberto */}
      {showMenu && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
          onClick={() => setShowMenu(false)}
        />
      )}
      
      {/* Botão flutuante do menu no canto inferior direito */}
      <div className="fixed bottom-4 right-4 z-50">
        <div className="flex flex-col items-end gap-2">
          {/* Menu hambúrguer quando aberto */}
          {showMenu && (
            <div className="bg-white rounded-lg shadow-xl overflow-hidden animate-in slide-in-from-bottom-5 w-48 mb-2">
              <div className="p-2">
                <Link href="/relatorios">
                  <a 
                    className={`flex items-center space-x-2 p-3 rounded-md ${isActive('/relatorios') ? 'bg-primary/10 text-primary' : 'hover:bg-gray-100 text-neutral-700'}`}
                    onClick={() => setShowMenu(false)}
                  >
                    <FileText className="h-5 w-5" />
                    <span className="text-sm font-medium">Relatórios</span>
                  </a>
                </Link>
                
                <Link href="/perfil">
                  <a 
                    className={`flex items-center space-x-2 p-3 rounded-md ${isActive('/perfil') ? 'bg-primary/10 text-primary' : 'hover:bg-gray-100 text-neutral-700'}`}
                    onClick={() => setShowMenu(false)}
                  >
                    <User className="h-5 w-5" />
                    <span className="text-sm font-medium">Perfil</span>
                  </a>
                </Link>
                
                <Link href="/configuracoes">
                  <a 
                    className={`flex items-center space-x-2 p-3 rounded-md ${isActive('/configuracoes') ? 'bg-primary/10 text-primary' : 'hover:bg-gray-100 text-neutral-700'}`}
                    onClick={() => setShowMenu(false)}
                  >
                    <Settings className="h-5 w-5" />
                    <span className="text-sm font-medium">Configurações</span>
                  </a>
                </Link>
                
                <div className="h-px bg-gray-200 my-2"></div>
                
                <button 
                  onClick={() => { logout?.mutate?.(); setShowMenu(false); }}
                  className="w-full flex items-center space-x-2 p-3 rounded-md text-red-600 hover:bg-red-50"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="text-sm font-medium">Sair</span>
                </button>
              </div>
            </div>
          )}
          
          {/* Botão de navegação rápida */}
          <div className="flex gap-2">
            {/* Botão Nova Vistoria */}
            <Link href="/nova-vistoria">
              <a className="bg-primary text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg">
                <Plus className="h-6 w-6" />
              </a>
            </Link>
            
            {/* Botão de menu */}
            <button 
              onClick={() => setShowMenu(!showMenu)}
              className="bg-primary text-white p-3 rounded-full flex items-center justify-center shadow-lg"
            >
              {showMenu ? <X className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Barra de navegação inferior com links principais */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow mt-auto">
        <div className="flex items-center justify-center px-4 mx-auto h-16">
          {/* Links principais */}
          <div className="flex space-x-12">
            <Link href="/">
              <a className={`flex flex-col items-center justify-center ${isActive('/') ? 'text-primary' : 'text-neutral-500'}`}>
                <div className={`p-1.5 rounded-lg ${isActive('/') ? 'bg-primary/10' : ''}`}>
                  <Home className="h-5 w-5" />
                </div>
                <span className="text-[10px] mt-1">Início</span>
              </a>
            </Link>
            
            <Link href="/clientes">
              <a className={`flex flex-col items-center justify-center ${isActive('/clientes') ? 'text-primary' : 'text-neutral-500'}`}>
                <div className={`p-1.5 rounded-lg ${isActive('/clientes') ? 'bg-primary/10' : ''}`}>
                  <Users className="h-5 w-5" />
                </div>
                <span className="text-[10px] mt-1">Clientes</span>
              </a>
            </Link>
            
            <Link href="/visitas">
              <a className={`flex flex-col items-center justify-center ${isActive('/visitas') ? 'text-primary' : 'text-neutral-500'}`}>
                <div className={`p-1.5 rounded-lg ${isActive('/visitas') ? 'bg-primary/10' : ''}`}>
                  <ClipboardCheck className="h-5 w-5" />
                </div>
                <span className="text-[10px] mt-1">Visitas</span>
              </a>
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
};

export default BottomNavigation;
