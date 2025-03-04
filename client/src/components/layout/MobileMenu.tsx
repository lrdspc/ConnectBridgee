import { useState } from "react";
import { Link, useLocation } from "wouter";
import { 
  Home, 
  Users,
  ClipboardCheck, 
  Menu as MenuIcon, 
  Settings,
  FileText,
  User,
  X,
  LogOut,
  PlusCircle,
  ChevronUp
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export default function MobileMenu() {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();

  const isActive = (path: string) => {
    return location === path || (path !== '/' && location.startsWith(path));
  };

  const menuItems = [
    { name: 'Início', path: '/', icon: <Home className="h-5 w-5" /> },
    { name: 'Clientes', path: '/clientes', icon: <Users className="h-5 w-5" /> },
    { name: 'Visitas', path: '/visitas', icon: <ClipboardCheck className="h-5 w-5" /> },
    { name: 'Nova Vistoria', path: '/nova-vistoria', icon: <PlusCircle className="h-5 w-5" />, highlight: true },
    { name: 'Relatórios', path: '/relatorios', icon: <FileText className="h-5 w-5" /> },
    { name: 'Perfil', path: '/perfil', icon: <User className="h-5 w-5" /> },
    { name: 'Configurações', path: '/configuracoes', icon: <Settings className="h-5 w-5" /> },
  ];

  return (
    <>
      {/* Indicador de arraste no estilo flecha para cima */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <div
            className="fixed bottom-16 left-0 right-0 flex justify-center z-40"
          >
            <div className="w-24 h-3 bg-white border-t border-l border-r border-gray-200 rounded-t-md flex items-start justify-center shadow-sm">
              <ChevronUp className="h-2.5 w-2.5 text-gray-400 mt-0.5" />
            </div>
          </div>
        </SheetTrigger>

        {/* Menu deslizante que abre de baixo para cima em tamanho compacto */}
        <SheetContent side="bottom" className="p-3 h-auto max-h-[80vh] rounded-t-xl">
          <div className="flex flex-col">
            {/* Indicador de arraste */}
            <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-4"></div>
            
            {/* Seção de perfil na parte superior */}
            <div className="flex items-center mb-4 px-2">
              <Avatar className="h-10 w-10 border border-gray-200">
                <AvatarImage src={user?.photoUrl} />
                <AvatarFallback className="bg-primary-foreground text-primary">
                  {user?.name?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="ml-3">
                <p className="font-medium text-sm">{user?.name || 'Usuário'}</p>
                <p className="text-xs text-gray-500">{user?.role || 'Técnico'}</p>
              </div>
              <Button 
                onClick={() => setOpen(false)}
                variant="ghost" 
                size="icon" 
                className="ml-auto"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Grade de ícones para navegação compacta */}
            <div className="grid grid-cols-4 gap-3 p-2 overflow-y-auto">
              {menuItems.map((item) => (
                <SheetClose asChild key={item.path}>
                  <Link href={item.path}>
                    <a className={cn(
                      "flex flex-col items-center p-3 rounded-lg hover:bg-gray-50 transition-colors",
                      isActive(item.path) 
                        ? "bg-primary/10 text-primary" 
                        : item.highlight 
                        ? "bg-blue-50 text-blue-600" 
                        : "text-gray-700"
                    )}>
                      <div>
                        {item.icon}
                      </div>
                      <span className="text-xs mt-1">{item.name}</span>
                      
                      {/* Indicador de item ativo */}
                      {isActive(item.path) && (
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1"></div>
                      )}
                    </a>
                  </Link>
                </SheetClose>
              ))}
            </div>

            {/* Botão de logout separado */}
            <div className="px-2 pt-2 mt-2 border-t">
              <Button 
                onClick={() => {
                  logout.mutate();
                  setOpen(false);
                }}
                variant="outline"
                size="sm"
                className="w-full justify-center text-red-500 hover:text-red-600 hover:bg-red-50 border-red-100"
              >
                <LogOut className="h-4 w-4 mr-2" />
                <span className="text-xs">Sair da Conta</span>
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}