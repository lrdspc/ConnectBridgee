import { Link, useLocation } from "wouter";
import { 
  Home, 
  Users,
  ClipboardCheck, 
  Plus, 
  FileText,
  User,
  Settings,
  LogOut,
  Menu as MenuIcon,
  X
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger,
  SheetClose 
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const BottomNavigation = () => {
  const [location] = useLocation();
  const [showMenu, setShowMenu] = useState(false);
  const { user, logout } = useAuth();

  const isActive = (path: string) => {
    return location === path || (path !== '/' && location.startsWith(path));
  };

  // Links de navegação principal
  const mainLinks = [
    { name: 'Início', path: '/', icon: <Home className="h-5 w-5" /> },
    { name: 'Clientes', path: '/clientes', icon: <Users className="h-5 w-5" /> },
    { name: 'Visitas', path: '/visitas', icon: <ClipboardCheck className="h-5 w-5" /> },
    { name: 'Relatórios', path: '/relatorios', icon: <FileText className="h-5 w-5" /> },
  ];

  // Links secundários para o menu
  const secondaryLinks = [
    { name: 'Perfil', path: '/perfil', icon: <User className="h-5 w-5" /> },
    { name: 'Configurações', path: '/configuracoes', icon: <Settings className="h-5 w-5" /> },
  ];

  return (
    <>
      {/* Barra de navegação inferior com design moderno */}
      <div className="fixed bottom-0 left-0 right-0 z-50">
        {/* Barra principal */}
        <nav className="bg-white border-t border-gray-200 shadow py-2 px-4">
          <div className="flex justify-around items-center relative">
            {/* Lado esquerdo - 2 ícones */}
            <div className="flex space-x-8">
              {mainLinks.slice(0, 2).map(link => (
                <Link key={link.path} href={link.path}>
                  <a className={cn(
                    "flex flex-col items-center justify-center transition-colors",
                    isActive(link.path) ? "text-primary" : "text-gray-500 hover:text-gray-800"
                  )}>
                    <div className={cn(
                      "p-1.5 rounded-full",
                      isActive(link.path) ? "bg-primary/10" : ""
                    )}>
                      {link.icon}
                    </div>
                    <span className="text-[10px] mt-1 font-medium">{link.name}</span>
                    {isActive(link.path) && (
                      <div className="w-1 h-1 bg-primary rounded-full mt-1"></div>
                    )}
                  </a>
                </Link>
              ))}
            </div>

            {/* Botão central maior - Nova Vistoria */}
            <div className="absolute left-1/2 -translate-x-1/2 -top-5">
              <Link href="/nova-vistoria">
                <a className="flex flex-col items-center">
                  <div className="bg-primary text-white p-3 rounded-full shadow-lg flex items-center justify-center w-14 h-14 active:scale-95 transition-transform">
                    <Plus className="h-6 w-6" />
                  </div>
                  <span className="text-[10px] font-semibold mt-1 text-primary">Nova Vistoria</span>
                </a>
              </Link>
            </div>

            {/* Lado direito - 2 ícones */}
            <div className="flex space-x-8">
              {mainLinks.slice(2, 4).map(link => (
                <Link key={link.path} href={link.path}>
                  <a className={cn(
                    "flex flex-col items-center justify-center transition-colors",
                    isActive(link.path) ? "text-primary" : "text-gray-500 hover:text-gray-800"
                  )}>
                    <div className={cn(
                      "p-1.5 rounded-full",
                      isActive(link.path) ? "bg-primary/10" : ""
                    )}>
                      {link.icon}
                    </div>
                    <span className="text-[10px] mt-1 font-medium">{link.name}</span>
                    {isActive(link.path) && (
                      <div className="w-1 h-1 bg-primary rounded-full mt-1"></div>
                    )}
                  </a>
                </Link>
              ))}
            </div>
          </div>
        </nav>
      </div>

      {/* Menu de opções expandido (aba deslizante de baixo) */}
      <Sheet>
        <SheetTrigger asChild>
          <Button 
            variant="outline" 
            size="icon" 
            className="fixed bottom-[88px] right-4 rounded-full shadow-md h-10 w-10 bg-white border-primary/20 hover:bg-primary/5 transition-colors"
          >
            <MenuIcon className="h-5 w-5 text-primary" />
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="p-0 rounded-t-xl max-h-[80vh]">
          <div className="flex flex-col">
            {/* Indicador de arraste */}
            <div className="flex justify-center py-2">
              <div className="w-12 h-1.5 bg-gray-300 rounded-full"></div>
            </div>
            
            {/* Cabeçalho com informações do usuário */}
            <div className="flex items-center px-5 py-4 border-b">
              <Avatar className="h-12 w-12 border border-gray-200">
                <AvatarImage src={user?.photoUrl} />
                <AvatarFallback className="bg-primary/10 text-primary font-medium">
                  {user?.name?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="ml-3 flex-1">
                <p className="font-medium">{user?.name || 'Usuário'}</p>
                <p className="text-sm text-gray-500">{user?.email || 'usuário@email.com'}</p>
              </div>
              <SheetClose asChild>
                <Button variant="ghost" size="icon">
                  <X className="h-5 w-5" />
                </Button>
              </SheetClose>
            </div>
            
            {/* Grid de ações rápidas */}
            <div className="grid grid-cols-2 gap-3 p-4">
              {/* Link para Nova Vistoria em destaque */}
              <SheetClose asChild>
                <Link href="/nova-vistoria">
                  <a className="bg-primary/10 border border-primary/20 text-primary rounded-lg p-4 flex flex-col items-center gap-2">
                    <Plus className="h-6 w-6" />
                    <span className="text-sm font-medium">Nova Vistoria</span>
                  </a>
                </Link>
              </SheetClose>
              
              {/* Links principais */}
              {mainLinks.map(link => (
                <SheetClose asChild key={link.path}>
                  <Link href={link.path}>
                    <a className={cn(
                      "border rounded-lg p-4 flex flex-col items-center gap-2",
                      isActive(link.path) 
                        ? "bg-primary/10 border-primary/20 text-primary" 
                        : "bg-gray-50 border-gray-200 text-gray-700"
                    )}>
                      {link.icon}
                      <span className="text-sm font-medium">{link.name}</span>
                    </a>
                  </Link>
                </SheetClose>
              ))}
              
              {/* Links secundários */}
              {secondaryLinks.map(link => (
                <SheetClose asChild key={link.path}>
                  <Link href={link.path}>
                    <a className={cn(
                      "border rounded-lg p-4 flex flex-col items-center gap-2",
                      isActive(link.path) 
                        ? "bg-primary/10 border-primary/20 text-primary" 
                        : "bg-gray-50 border-gray-200 text-gray-700"
                    )}>
                      {link.icon}
                      <span className="text-sm font-medium">{link.name}</span>
                    </a>
                  </Link>
                </SheetClose>
              ))}
            </div>
            
            {/* Botão de logout */}
            <div className="px-4 pb-6 mt-2">
              <SheetClose asChild>
                <Button 
                  onClick={() => logout.mutate()}
                  variant="outline"
                  className="w-full justify-center text-red-500 hover:text-red-600 hover:bg-red-50 border-red-100"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  <span>Sair da Conta</span>
                </Button>
              </SheetClose>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default BottomNavigation;
