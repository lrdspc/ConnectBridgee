import { Link, useLocation } from "wouter";
import { 
  Home, 
  Users,
  ClipboardCheck, 
  Menu as MenuIcon, 
  Settings,
  FileText,
  User,
  Bell,
  Search,
  X,
  LogOut,
  PlusCircle,
  HelpCircle
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
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface MobileMenuProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function MobileMenu({ open, setOpen }: MobileMenuProps) {
  const [location] = useLocation();
  const { user, logout } = useAuth();

  const isActive = (path: string) => {
    return location === path || (path !== '/' && location.startsWith(path));
  };

  // Principais itens de menu - baseado no desktop
  const menuItems = [
    { name: 'Dashboard', path: '/', icon: <Home className="h-5 w-5" />, badge: null },
    { name: 'Clientes', path: '/clientes', icon: <Users className="h-5 w-5" />, badge: null },
    { name: 'Visitas', path: '/visitas', icon: <ClipboardCheck className="h-5 w-5" />, badge: null },
    { name: 'Nova Vistoria', path: '/nova-vistoria', icon: <PlusCircle className="h-5 w-5" />, badge: "Novo", highlight: true },
    { name: 'Relatórios', path: '/relatorios', icon: <FileText className="h-5 w-5" />, badge: null },
    { name: 'Meu Perfil', path: '/perfil', icon: <User className="h-5 w-5" />, badge: null },
  ];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button 
          className="hidden"
          aria-label="Abrir menu"
        >
          <MenuIcon className="h-5 w-5 text-gray-600" />
        </button>
      </SheetTrigger>

      <SheetContent side="left" className="w-[85%] max-w-[300px] p-0 border-r shadow-lg">
        {/* Cabeçalho do menu - Equivalente ao header do desktop */}
        <div className="p-4 bg-white border-b flex items-center">
          <div className="flex items-center mr-auto">
            <div className="rounded-full bg-primary p-1 mr-2">
              <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDZDMTMuNjU2OSA2IDE1IDQuNjU2ODUgMTUgM0MxNSAxLjM0MzE1IDEzLjY1NjkgMCAxMiAwQzEwLjM0MzEgMCA5IDEuMzQzMTUgOSAzQzkgNC42NTY4NSAxMC4zNDMxIDYgMTIgNloiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik0xMiAyNEMxNS4zMTM3IDI0IDE4IDIxLjMxMzcgMTggMThDMTggMTQuNjg2MyAxNS4zMTM3IDEyIDEyIDEyQzguNjg2MjkgMTIgNiAxNC42ODYzIDYgMThDNiAyMS4zMTM3IDguNjg2MjkgMjQgMTIgMjRaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMjQgMTJDMjQgMTMuNjU2OSAyMi42NTY5IDE1IDIxIDE1QzE5LjM0MzEgMTUgMTggMTMuNjU2OSAxOCAxMkMxOCAxMC4zNDMxIDE5LjM0MzEgOSAyMSA5QzIyLjY1NjkgOSAyNCAxMC4zNDMxIDI0IDEyWiIgZmlsbD0id2hpdGUiLz4KPHBhdGggZD0iTTYgMTJDNiAxMy42NTY5IDQuNjU2ODUgMTUgMyAxNUMxLjM0MzE1IDE1IDAgMTMuNjU2OSAwIDEyQzAgMTAuMzQzMSAxLjM0MzE1IDkgMyA5QzQuNjU2ODUgOSA2IDEwLjM0MzEgNiAxMloiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik00LjkyNzI0IDE4LjEyODFDNS45OTU0NyAxNy4wNTk5IDUuOTk1NDcgMTUuMzc2OCA0LjkyNzI0IDE0LjMwODZDMy44NTkwMiAxMy4yNDAzIDIuMTc1OTQgMTMuMjQwMyAxLjEwNzcyIDE0LjMwODZDMC4wMzk0OTgzIDE1LjM3NjggMC4wMzk0OTg0IDE3LjA1OTkgMS4xMDc3MiAxOC4xMjgxQzIuMTc1OTQgMTkuMTk2MyAzLjg1OTAyIDE5LjE5NjMgNC45MjcyNCAxOC4xMjgxWiIgZmlsbD0id2hpdGUiLz4KPHBhdGggZD0iTTIyLjg5MjMgMTguMTI4MUMyMy45NjA1IDE3LjA1OTkgMjMuOTYwNSAxNS4zNzY4IDIyLjg5MjMgMTQuMzA4NkMyMS44MjQxIDEzLjI0MDMgMjAuMTQxIDE0LjMwODYgMTQuNTYzNCAxNS4zNzY4QzEzLjQ5NTIgMTYuNDQ1IDE3LjMxNDQgMTkuMTk2MyAyMi44OTIzIDE4LjEyODFaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNNC45MjcyNCA5LjY5MTM5QzUuOTk1NDcgMTAuNzU5NiA1Ljk5NTQ3IDEyLjQ0MjcgNC45MjcyNCAxMy41MTA5QzMuODU5MDIgMTQuNTc5MiAyLjE3NTk0IDE0LjU3OTIgMS4xMDc3MiAxMy41MTA5QzAuMDM5NDk4MyAxMi40NDI3IDAuMDM5NDk4MyAxMC43NTk2IDEuMTA3NzIgOS42OTEzOUMyLjE3NTk0IDguNjIzMTcgMy44NTkwMiA4LjYyMzE3IDQuOTI3MjQgOS42OTEzOVoiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik0xNC41MDYzIDQuOTI3MjRDMTMuNDM4MSAzLjg1OTAyIDExLjc1NSAzLjg1OTAyIDEwLjY4NjggNC45MjcyNEM5LjYxODU2IDUuOTk1NDcgOS42MTg1NiA3LjY3ODU0IDEwLjY4NjggOC43NDY3N0MxMS43NTUgOS44MTQ5OSAxMy40MzgxIDkuODE0OTkgMTQuNTA2MyA4Ljc0Njc3QzE1LjU3NDUgNy42Nzg1NCAxNS41NzQ1IDUuOTk1NDcgMTQuNTA2MyA0LjkyNzI0WiIgZmlsbD0id2hpdGUiLz4KPHBhdGggZD0iTTE0LjUwNjMgMjIuODkyM0MxMy40MzgxIDIzLjk2MDUgMTEuNzU1IDIzLjk2MDUgMTAuNjg2OCAyMi44OTIzQzkuNjE4NTYgMjEuODI0MSA5LjYxODU2IDIwLjE0MSAxMC42ODY4IDE5LjA3MjhDMTEuNzU1IDE4LjAwNDUgMTMuNDM4MSAxOC4wMDQ1IDE0LjUwNjMgMTkuMDcyOEMxNS41NzQ1IDIwLjE0MSAxNS41NzQ1IDIxLjgyNDEgMTQuNTA2MyAyMi44OTIzWiIgZmlsbD0id2hpdGUiLz4KPHBhdGggZD0iTTIyLjg5MjMgOS42OTEzOUMyMy45NjA1IDEwLjc1OTYgMjMuOTYwNSAxMi40NDI3IDIyLjg5MjMgMTMuNTEwOUMyMS44MjQxIDE0LjU3OTIgMjAuMTQxIDE0LjU3OTIgMTkuMDcyOCAxMy41MTA5QzE4LjAwNDUgMTIuNDQyNyAxOC4wMDQ1IDEwLjc1OTYgMTkuMDcyOCA5LjY5MTM5QzIwLjE0MSA4LjYyMzE3IDIxLjgyNDEgOC42MjMxNyAyMi44OTIzIDkuNjkxMzlaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K" alt="Brasilit" className="w-6 h-6" />
            </div>
            <h1 className="font-bold text-lg truncate">
              Brasilit Técnico
            </h1>
          </div>
          
          <SheetClose asChild>
            <Button variant="ghost" size="icon" className="ml-2">
              <X className="h-5 w-5" />
            </Button>
          </SheetClose>
        </div>
        
        {/* Perfil do usuário */}
        <div className="p-4 border-b flex items-center">
          <Avatar className="h-11 w-11">
            <AvatarImage src={user?.photoUrl} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {user?.name?.charAt(0) || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="ml-3">
            <p className="font-medium text-sm">{user?.name || 'Usuário'}</p>
            <p className="text-xs text-gray-500">{user?.email || 'usuário@email.com'}</p>
          </div>
        </div>
        
        {/* Barra de pesquisa - simplificada */}
        <div className="p-4">
          <div className="flex items-center h-10 rounded-md border border-input bg-white px-3 py-1 text-sm shadow-sm transition-colors">
            <Search className="h-4 w-4 mr-2 text-muted-foreground" />
            <input 
              type="search" 
              placeholder="Buscar..." 
              className="flex-1 bg-transparent outline-none"
            />
          </div>
        </div>
        
        {/* Menu de navegação principal - equivalente à sidebar */}
        <div className="p-2 overflow-y-auto">
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.path}>
                <SheetClose asChild>
                  <Link href={item.path}>
                    <a 
                      className={cn(
                        "flex items-center px-3 py-2.5 rounded-md transition-colors",
                        isActive(item.path) 
                          ? "bg-primary/10 text-primary font-medium" 
                          : "text-gray-700 hover:bg-gray-100",
                        (item as any).highlight && !isActive(item.path)
                          ? "border border-primary/30 bg-primary/5" 
                          : ""
                      )}
                    >
                      <div className="relative">
                        {item.icon}
                      </div>
                      <span className="ml-3">{item.name}</span>
                      {item.badge && (
                        <Badge 
                          variant="outline" 
                          className="ml-auto bg-primary/10 text-primary border-primary/20"
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </a>
                  </Link>
                </SheetClose>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Seção de ferramentas - equivalente à parte inferior da sidebar */}
        <div className="mt-auto p-2 border-t">
          <div className="flex flex-col space-y-1">
            <SheetClose asChild>
              <Link href="/configuracoes">
                <a className="flex items-center px-3 py-2.5 rounded-md transition-colors text-gray-700 hover:bg-gray-100">
                  <Settings className="h-5 w-5 text-gray-600" />
                  <span className="ml-3">Configurações</span>
                </a>
              </Link>
            </SheetClose>
            
            <SheetClose asChild>
              <Link href="/ajuda">
                <a className="flex items-center px-3 py-2.5 rounded-md transition-colors text-gray-700 hover:bg-gray-100">
                  <HelpCircle className="h-5 w-5 text-gray-600" />
                  <span className="ml-3">Ajuda e Suporte</span>
                </a>
              </Link>
            </SheetClose>
            
            <Separator className="my-2" />
            
            <Button
              variant="ghost"
              className="justify-start px-3 text-red-600 hover:bg-red-50 hover:text-red-700"
              onClick={() => logout?.mutate?.()}
            >
              <LogOut className="h-5 w-5 mr-3" />
              Sair
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}