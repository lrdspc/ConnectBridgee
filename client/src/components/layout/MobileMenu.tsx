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
  PlusCircle
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
      {/* Trigger button com ícone de hambúrguer - agora no lado esquerdo */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <button
            className="fixed left-4 bottom-4 w-12 h-12 rounded-full bg-primary flex items-center justify-center shadow-lg z-40"
          >
            <MenuIcon className="h-6 w-6 text-white" />
          </button>
        </SheetTrigger>

        {/* Menu deslizante lateral - agora abre da esquerda */}
        <SheetContent side="left" className="p-0 w-[260px] sm:w-[300px]">
          <div className="flex flex-col h-full">
            {/* Cabeçalho do menu com perfil do usuário */}
            <div className="bg-primary text-white p-4">
              <div className="flex items-center">
                <Avatar className="h-10 w-10 border-2 border-white">
                  <AvatarImage src={user?.photoUrl} />
                  <AvatarFallback className="bg-primary-foreground text-primary">
                    {user?.name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="ml-3">
                  <p className="font-medium">{user?.name || 'Usuário'}</p>
                  <p className="text-xs opacity-90">{user?.role || 'Técnico'}</p>
                </div>
              </div>
            </div>

            {/* Lista de itens do menu */}
            <div className="flex-1 overflow-auto p-1">
              <div className="space-y-1 mt-2">
                {menuItems.map((item) => (
                  <SheetClose asChild key={item.path}>
                    <Link href={item.path}>
                      <a 
                        className={cn(
                          "flex items-center rounded-md h-10 px-3 py-6 text-base transition-colors",
                          isActive(item.path)
                            ? "bg-primary/10 text-primary font-medium"
                            : item.highlight
                            ? "bg-blue-50 text-blue-600"
                            : "text-gray-800 hover:bg-gray-100"
                        )}
                      >
                        <div className={cn(
                          "mr-3",
                          isActive(item.path) 
                            ? "text-primary"
                            : item.highlight
                            ? "text-blue-600"
                            : "text-gray-600"
                        )}>
                          {item.icon}
                        </div>
                        <span>{item.name}</span>
                        
                        {/* Destaque especial para Nova Vistoria */}
                        {item.highlight && (
                          <span className="ml-auto bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full">
                            Novo
                          </span>
                        )}
                      </a>
                    </Link>
                  </SheetClose>
                ))}
              </div>
            </div>

            {/* Rodapé do menu com botão de logout */}
            <div className="p-4 border-t">
              <Button 
                onClick={() => {
                  logout.mutate();
                  setOpen(false);
                }}
                variant="outline"
                className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 border-red-100"
              >
                <LogOut className="h-5 w-5 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}