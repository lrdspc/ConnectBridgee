import { useState } from "react";
import { Link, useLocation } from "wouter";
import { 
  Home, 
  Users,
  ClipboardCheck, 
  Plus, 
  Settings,
  FileText,
  User,
  Menu,
  X,
  LogOut
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

export default function FloatingActionButton() {
  const [location] = useLocation();
  const [showMenu, setShowMenu] = useState(false);
  const { logout } = useAuth();

  const isActive = (path: string) => {
    return location === path || (path !== '/' && location.startsWith(path));
  };

  const menuItems = [
    { name: 'Início', path: '/', icon: <Home className="h-5 w-5" /> },
    { name: 'Clientes', path: '/clientes', icon: <Users className="h-5 w-5" /> },
    { name: 'Visitas', path: '/visitas', icon: <ClipboardCheck className="h-5 w-5" /> },
    { name: 'Relatórios', path: '/relatorios', icon: <FileText className="h-5 w-5" /> },
    { name: 'Perfil', path: '/perfil', icon: <User className="h-5 w-5" /> },
    { name: 'Configurações', path: '/configuracoes', icon: <Settings className="h-5 w-5" /> },
  ];

  return (
    <>
      {/* Overlay escuro quando o menu está aberto */}
      {showMenu && (
        <div 
          className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
          onClick={() => setShowMenu(false)}
        />
      )}
      
      {/* Botão de ação flutuante */}
      <button
        className={cn(
          "fixed right-4 bottom-4 w-14 h-14 rounded-full flex items-center justify-center shadow-lg z-50 transition-all",
          showMenu ? "bg-red-500 rotate-45" : "bg-primary"
        )}
        onClick={() => setShowMenu(!showMenu)}
      >
        {showMenu ? <X className="h-7 w-7 text-white" /> : <Plus className="h-7 w-7 text-white" />}
      </button>
      
      {/* Menu circular que aparece quando o botão é clicado */}
      {showMenu && (
        <div className="fixed z-40 right-4 bottom-20 flex flex-col items-end space-y-2">
          {/* Destaque especial para Nova Vistoria */}
          <div className="flex items-center">
            <span className="bg-white/90 text-primary font-medium px-3 py-1 rounded-full mr-2 shadow text-sm">
              Nova Vistoria
            </span>
            <Link href="/relatorio-vistoria">
              <a 
                className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center shadow-md"
                onClick={() => setShowMenu(false)}
              >
                <FileText className="h-5 w-5 text-white" />
              </a>
            </Link>
          </div>
          
          {menuItems.map((item) => (
            <div className="flex items-center" key={item.path}>
              <span 
                className={cn(
                  "bg-white/90 px-3 py-1 rounded-full mr-2 shadow text-sm",
                  isActive(item.path) ? "text-primary font-medium" : "text-gray-700"
                )}
              >
                {item.name}
              </span>
              <Link href={item.path}>
                <a 
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center shadow-md", 
                    isActive(item.path) ? "bg-primary/90" : "bg-white"
                  )}
                  onClick={() => setShowMenu(false)}
                >
                  <div 
                    className={isActive(item.path) ? "text-white" : "text-primary"}
                  >
                    {item.icon}
                  </div>
                </a>
              </Link>
            </div>
          ))}
          
          {/* Botão de logout */}
          <div className="flex items-center">
            <span className="bg-white/90 text-red-500 font-medium px-3 py-1 rounded-full mr-2 shadow text-sm">
              Sair
            </span>
            <button 
              className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center shadow-md"
              onClick={() => {
                logout.mutate();
                setShowMenu(false);
              }}
            >
              <LogOut className="h-5 w-5 text-white" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}