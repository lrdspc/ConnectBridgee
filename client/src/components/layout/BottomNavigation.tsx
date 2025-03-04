import { Link, useLocation } from "wouter";
import { 
  Home, 
  Users,
  ClipboardCheck, 
  FileSpreadsheet, 
  Plus, 
  MoreHorizontal,
  Menu,
  X,
  Settings,
  User,
  MapPin,
  LogOut,
  FileText,
  ClipboardList
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

const BottomNavigation = () => {
  const [location] = useLocation();
  const [showMore, setShowMore] = useState(false);
  const { logout } = useAuth();

  const isActive = (path: string) => {
    return location === path || (path !== '/' && location.startsWith(path));
  };

  return (
    <>
      {/* Overlay para o menu "Mais" */}
      {showMore && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
          onClick={() => setShowMore(false)}
        />
      )}
      
      {/* Navegação inferior não fixada que acompanha a rolagem */}
      <nav className="relative bg-white border-t border-slate-200 shadow mt-auto">
        <div className="grid grid-cols-5 items-center justify-between px-2 mx-auto h-16">
          {/* Atalhos principais */}
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
          
          {/* Botão central de Adicionar */}
          <div className="flex justify-center">
            <Link href="/nova-vistoria">
              <a className="bg-primary text-white rounded-full w-12 h-12 flex items-center justify-center shadow-md border-2 border-white -mt-4">
                <Plus className="h-6 w-6" />
              </a>
            </Link>
          </div>
          
          <Link href="/visitas">
            <a className={`flex flex-col items-center justify-center ${isActive('/visitas') ? 'text-primary' : 'text-neutral-500'}`}>
              <div className={`p-1.5 rounded-lg ${isActive('/visitas') ? 'bg-primary/10' : ''}`}>
                <ClipboardCheck className="h-5 w-5" />
              </div>
              <span className="text-[10px] mt-1">Visitas</span>
            </a>
          </Link>
          
          <button 
            onClick={() => setShowMore(!showMore)}
            className={`flex flex-col items-center justify-center ${showMore ? 'text-primary' : 'text-neutral-500'}`}
          >
            <div className={`p-1.5 rounded-lg ${showMore ? 'bg-primary/10' : ''}`}>
              <Settings className="h-5 w-5" />
            </div>
            <span className="text-[10px] mt-1">Config</span>
          </button>
        </div>
        
        {/* Menu expandido - Modal de baixo para cima */}
        {showMore && (
          <>
            <div 
              className="fixed inset-0 bottom-16 bg-black/30 z-40" 
              onClick={() => setShowMore(false)}
            />
            
            <div className="fixed bottom-16 left-4 right-4 bg-white rounded-lg shadow-xl z-50 transition-all duration-200 animate-in slide-in-from-bottom">
              <div className="flex justify-end p-2">
                <button 
                  onClick={() => setShowMore(false)}
                  className="p-1 rounded-full hover:bg-gray-100"
                >
                  <X className="h-4 w-4 text-gray-500" />
                </button>
              </div>
              
              <div className="grid grid-cols-3 gap-2 p-2 pb-4">
                <Link href="/relatorios">
                  <a className="flex flex-col items-center p-2 rounded-lg bg-gray-50 hover:bg-gray-100" onClick={() => setShowMore(false)}>
                    <div className={`p-2 rounded-full ${isActive('/relatorios') ? 'bg-primary/10 text-primary' : 'bg-white text-neutral-700'} mb-1 shadow-sm`}>
                      <FileText className="h-5 w-5" />
                    </div>
                    <span className="text-xs font-medium">Relatórios</span>
                  </a>
                </Link>
                
                <Link href="/perfil">
                  <a className="flex flex-col items-center p-2 rounded-lg bg-gray-50 hover:bg-gray-100" onClick={() => setShowMore(false)}>
                    <div className={`p-2 rounded-full ${isActive('/perfil') ? 'bg-primary/10 text-primary' : 'bg-white text-neutral-700'} mb-1 shadow-sm`}>
                      <User className="h-5 w-5" />
                    </div>
                    <span className="text-xs font-medium">Perfil</span>
                  </a>
                </Link>
                
                <Link href="/configuracoes">
                  <a className="flex flex-col items-center p-2 rounded-lg bg-gray-50 hover:bg-gray-100" onClick={() => setShowMore(false)}>
                    <div className={`p-2 rounded-full ${isActive('/configuracoes') ? 'bg-primary/10 text-primary' : 'bg-white text-neutral-700'} mb-1 shadow-sm`}>
                      <Settings className="h-5 w-5" />
                    </div>
                    <span className="text-xs font-medium">Config.</span>
                  </a>
                </Link>
                
                <button 
                  onClick={() => { logout?.mutate?.(); setShowMore(false); }}
                  className="flex flex-col items-center p-2 rounded-lg bg-red-50 hover:bg-red-100 col-span-3 mt-2"
                >
                  <div className="p-2 rounded-full bg-white text-red-500 mb-1 shadow-sm">
                    <LogOut className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-medium text-red-600">Sair</span>
                </button>
              </div>
            </div>
          </>
        )}
      </nav>
    </>
  );
};

export default BottomNavigation;
