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
      
      {/* Não precisamos mais deste menu, pois agora temos o menu flutuante completo */}
      
      {/* Navegação inferior unificada com menu principal */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-lg z-40">
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
            <Link href="/inspecoes/novo">
              <a className="bg-primary text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg border-4 border-white -mt-6">
                <Plus className="h-6 w-6" />
              </a>
            </Link>
          </div>
          
          <Link href="/inspecoes">
            <a className={`flex flex-col items-center justify-center ${isActive('/inspecoes') ? 'text-primary' : 'text-neutral-500'}`}>
              <div className={`p-1.5 rounded-lg ${isActive('/inspecoes') ? 'bg-primary/10' : ''}`}>
                <ClipboardCheck className="h-5 w-5" />
              </div>
              <span className="text-[10px] mt-1">Inspeções</span>
            </a>
          </Link>
          
          <button 
            onClick={() => setShowMore(!showMore)}
            className={`flex flex-col items-center justify-center ${showMore ? 'text-primary' : 'text-neutral-500'}`}
          >
            <div className={`p-1.5 rounded-lg ${showMore ? 'bg-primary/10' : ''}`}>
              <MoreHorizontal className="h-5 w-5" />
            </div>
            <span className="text-[10px] mt-1">Menu</span>
          </button>
        </div>
        
        {/* Menu expandido - Modal de baixo para cima */}
        {showMore && (
          <>
            <div 
              className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm" 
              onClick={() => setShowMore(false)}
            />
            
            <div className="fixed bottom-16 inset-x-0 bg-white rounded-t-xl shadow-xl z-50 transition-all duration-200 animate-in slide-in-from-bottom">
              <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto my-2 opacity-80"></div>
              
              <div className="grid grid-cols-4 gap-3 p-4 max-h-[70vh] overflow-y-auto pb-8">
                {/* Destaque especial para o botão de Nova Vistoria FAR */}
                <Link href="/vistoria-far">
                  <a className="flex flex-col items-center p-3 rounded-xl bg-blue-50 hover:bg-blue-100 col-span-4 mb-3 border-2 border-blue-300" onClick={() => setShowMore(false)}>
                    <div className="p-3 rounded-full bg-blue-600 text-white mb-2 shadow-sm">
                      <FileText className="h-7 w-7" />
                    </div>
                    <span className="text-sm font-semibold text-blue-800">Nova Vistoria FAR</span>
                  </a>
                </Link>
                
                <Link href="/relatorios">
                  <a className="flex flex-col items-center p-3 rounded-xl bg-gray-50 hover:bg-gray-100" onClick={() => setShowMore(false)}>
                    <div className={`p-3 rounded-full ${isActive('/relatorios') ? 'bg-primary/10 text-primary' : 'bg-white text-neutral-700'} mb-2 shadow-sm`}>
                      <FileSpreadsheet className="h-6 w-6" />
                    </div>
                    <span className="text-xs font-medium">Relatórios</span>
                  </a>
                </Link>
                
                <Link href="/rotas">
                  <a className="flex flex-col items-center p-3 rounded-xl bg-gray-50 hover:bg-gray-100" onClick={() => setShowMore(false)}>
                    <div className={`p-3 rounded-full ${isActive('/rotas') ? 'bg-primary/10 text-primary' : 'bg-white text-neutral-700'} mb-2 shadow-sm`}>
                      <MapPin className="h-6 w-6" />
                    </div>
                    <span className="text-xs font-medium">Rotas</span>
                  </a>
                </Link>
                
                <Link href="/perfil">
                  <a className="flex flex-col items-center p-3 rounded-xl bg-gray-50 hover:bg-gray-100" onClick={() => setShowMore(false)}>
                    <div className={`p-3 rounded-full ${isActive('/perfil') ? 'bg-primary/10 text-primary' : 'bg-white text-neutral-700'} mb-2 shadow-sm`}>
                      <User className="h-6 w-6" />
                    </div>
                    <span className="text-xs font-medium">Perfil</span>
                  </a>
                </Link>
                
                <Link href="/configuracoes">
                  <a className="flex flex-col items-center p-3 rounded-xl bg-gray-50 hover:bg-gray-100" onClick={() => setShowMore(false)}>
                    <div className={`p-3 rounded-full ${isActive('/configuracoes') ? 'bg-primary/10 text-primary' : 'bg-white text-neutral-700'} mb-2 shadow-sm`}>
                      <Settings className="h-6 w-6" />
                    </div>
                    <span className="text-xs font-medium">Config.</span>
                  </a>
                </Link>
                
                <button 
                  onClick={() => { logout?.mutate?.(); setShowMore(false); }}
                  className="flex flex-col items-center p-3 rounded-xl bg-red-50 hover:bg-red-100 col-span-4 mt-4"
                >
                  <div className="p-3 rounded-full bg-white text-red-500 mb-2 shadow-sm">
                    <LogOut className="h-6 w-6" />
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
