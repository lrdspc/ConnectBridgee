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
import { 
  Sheet,
  SheetContent,
  SheetTrigger
} from "@/components/ui/sheet";

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
      <div className="fixed bottom-16 right-4 z-50">
        {/* Botão Nova Vistoria */}
        <Link href="/nova-vistoria">
          <a className="bg-primary hover:bg-primary/90 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg transition-transform hover:scale-105">
            <Plus className="h-7 w-7" />
          </a>
        </Link>
      </div>
      
      {/* Menu de opções (usando Sheet componente para melhor UX) */}
      <Sheet>
        <SheetTrigger asChild>
          <button 
            className="fixed bottom-16 left-4 z-50 bg-white border border-primary/20 rounded-full p-3 shadow-md"
            aria-label="Opções"
          >
            <MenuIcon className="h-5 w-5 text-primary" />
          </button>
        </SheetTrigger>
        <SheetContent side="bottom" className="h-auto max-h-[70vh]">
          <div className="grid grid-cols-3 gap-4 py-4">
            <Link href="/relatorios">
              <a className={cn(
                "flex flex-col items-center justify-center p-3 rounded-lg text-center",
                isActive('/relatorios') ? "bg-primary/10 text-primary" : "hover:bg-gray-100 text-gray-700"
              )}>
                <FileText className="h-6 w-6 mb-1" />
                <span className="text-xs font-medium">Relatórios</span>
              </a>
            </Link>
            
            <Link href="/perfil">
              <a className={cn(
                "flex flex-col items-center justify-center p-3 rounded-lg text-center",
                isActive('/perfil') ? "bg-primary/10 text-primary" : "hover:bg-gray-100 text-gray-700"
              )}>
                <User className="h-6 w-6 mb-1" />
                <span className="text-xs font-medium">Perfil</span>
              </a>
            </Link>
            
            <Link href="/configuracoes">
              <a className={cn(
                "flex flex-col items-center justify-center p-3 rounded-lg text-center",
                isActive('/configuracoes') ? "bg-primary/10 text-primary" : "hover:bg-gray-100 text-gray-700"
              )}>
                <Settings className="h-6 w-6 mb-1" />
                <span className="text-xs font-medium">Configurações</span>
              </a>
            </Link>
          </div>
          
          <div className="px-4 pb-4 pt-2 border-t">
            <button 
              onClick={() => logout?.mutate?.()}
              className="w-full flex items-center justify-center space-x-2 p-3 rounded-md text-red-600 hover:bg-red-50"
            >
              <LogOut className="h-5 w-5" />
              <span className="text-sm font-medium">Sair do aplicativo</span>
            </button>
          </div>
        </SheetContent>
      </Sheet>
      
      {/* Barra de navegação inferior com links principais */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow mt-auto">
        <div className="flex items-center justify-between px-6 mx-auto h-16">
          {/* Links principais */}
          <Link href="/">
            <a className={cn(
              "flex flex-col items-center justify-center",
              isActive('/') ? "text-primary" : "text-neutral-500 hover:text-neutral-700"
            )}>
              <div className={cn(
                "p-1.5 rounded-lg transition-colors",
                isActive('/') ? "bg-primary/10" : ""
              )}>
                <Home className="h-5 w-5" />
              </div>
              <span className="text-[10px] mt-1 font-medium">Início</span>
            </a>
          </Link>
          
          <Link href="/clientes">
            <a className={cn(
              "flex flex-col items-center justify-center",
              isActive('/clientes') ? "text-primary" : "text-neutral-500 hover:text-neutral-700"
            )}>
              <div className={cn(
                "p-1.5 rounded-lg transition-colors",
                isActive('/clientes') ? "bg-primary/10" : ""
              )}>
                <Users className="h-5 w-5" />
              </div>
              <span className="text-[10px] mt-1 font-medium">Clientes</span>
            </a>
          </Link>
          
          <div className="w-10 h-5"></div> {/* Espaço para o botão flutuante */}
          
          <Link href="/visitas">
            <a className={cn(
              "flex flex-col items-center justify-center",
              isActive('/visitas') ? "text-primary" : "text-neutral-500 hover:text-neutral-700"
            )}>
              <div className={cn(
                "p-1.5 rounded-lg transition-colors",
                isActive('/visitas') ? "bg-primary/10" : ""
              )}>
                <ClipboardCheck className="h-5 w-5" />
              </div>
              <span className="text-[10px] mt-1 font-medium">Visitas</span>
            </a>
          </Link>
          
          <Link href="/relatorios">
            <a className={cn(
              "flex flex-col items-center justify-center",
              isActive('/relatorios') ? "text-primary" : "text-neutral-500 hover:text-neutral-700"
            )}>
              <div className={cn(
                "p-1.5 rounded-lg transition-colors",
                isActive('/relatorios') ? "bg-primary/10" : ""
              )}>
                <FileText className="h-5 w-5" />
              </div>
              <span className="text-[10px] mt-1 font-medium">Relatórios</span>
            </a>
          </Link>
        </div>
      </nav>
    </>
  );
};

export default BottomNavigation;
