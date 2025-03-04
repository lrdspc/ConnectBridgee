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
        <div className="flex items-center justify-between px-1 mx-auto h-16 overflow-x-auto">
          {/* Atalhos principais visíveis diretamente, sem precisar de menu */}
          <Link href="/">
            <a className={`flex flex-col items-center justify-center px-3 ${isActive('/') ? 'text-primary' : 'text-neutral-500'}`}>
              <div className={`p-1.5 rounded-lg ${isActive('/') ? 'bg-primary/10' : ''}`}>
                <Home className="h-5 w-5" />
              </div>
              <span className="text-[10px] mt-1">Início</span>
            </a>
          </Link>
          
          <Link href="/rotas">
            <a className={`flex flex-col items-center justify-center px-3 ${isActive('/rotas') ? 'text-primary' : 'text-neutral-500'}`}>
              <div className={`p-1.5 rounded-lg ${isActive('/rotas') ? 'bg-primary/10' : ''}`}>
                <MapPin className="h-5 w-5" />
              </div>
              <span className="text-[10px] mt-1">Rotas</span>
            </a>
          </Link>
          
          {/* Botão central de Adicionar */}
          <div className="flex justify-center px-2">
            <Link href="/relatorio-vistoria">
              <a className="bg-primary text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg border-4 border-white -mt-5">
                <Plus className="h-6 w-6" />
              </a>
            </Link>
          </div>
          
          <Link href="/relatorios">
            <a className={`flex flex-col items-center justify-center px-3 ${isActive('/relatorios') ? 'text-primary' : 'text-neutral-500'}`}>
              <div className={`p-1.5 rounded-lg ${isActive('/relatorios') ? 'bg-primary/10' : ''}`}>
                <FileText className="h-5 w-5" />
              </div>
              <span className="text-[10px] mt-1">Relatórios</span>
            </a>
          </Link>
          
          <Link href="/perfil">
            <a className={`flex flex-col items-center justify-center px-3 ${isActive('/perfil') ? 'text-primary' : 'text-neutral-500'}`}>
              <div className={`p-1.5 rounded-lg ${isActive('/perfil') ? 'bg-primary/10' : ''}`}>
                <User className="h-5 w-5" />
              </div>
              <span className="text-[10px] mt-1">Perfil</span>
            </a>
          </Link>
        </div>
        
        {/* Menu "Mais" foi removido, pois todos os itens estão agora na barra inferior */}
      </nav>
    </>
  );
};

export default BottomNavigation;
