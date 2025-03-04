import React, { useState, ReactNode, useEffect, useRef } from 'react';
import { useLocation, Link } from 'wouter';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { 
  Home, 
  MapPin, 
  ClipboardCheck,
  BarChart2, 
  User, 
  Users,
  Settings, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  Bell,
  Search,
  HelpCircle,
  ClipboardList,
  FileText,
  Menu as MenuIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useIsMobile } from '@/hooks/use-mobile';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import MobileMenu from '@/components/layout/MobileMenu';
import BottomNavigation from '@/components/layout/BottomNavigation';

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayoutNew({ children }: DashboardLayoutProps) {
  const [location] = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(true);
  const { user, logout } = useAuth();
  const isMobile = useIsMobile();
  const lastScrollY = useRef(0);
  const mainRef = useRef<HTMLDivElement>(null);

  // Função para detectar a direção da rolagem na página
  useEffect(() => {
    // Só aplica em dispositivos móveis
    if (!isMobile) return;

    const handleScroll = () => {
      const mainElement = mainRef.current;
      if (!mainElement) return;

      const currentScrollY = mainElement.scrollTop;

      // Sempre mostra o cabeçalho no topo da página
      if (currentScrollY <= 10) {
        setHeaderVisible(true);
        lastScrollY.current = currentScrollY;
        return;
      }

      // Determina a direção da rolagem com um limiar menor para mais responsividade
      if (currentScrollY > lastScrollY.current + 5) {
        // Rolando para baixo - esconde o cabeçalho
        setHeaderVisible(false);
      } else if (currentScrollY < lastScrollY.current - 5) {
        // Rolando para cima - mostra o cabeçalho
        setHeaderVisible(true);
      }

      // Atualiza a última posição de rolagem
      lastScrollY.current = currentScrollY;
    };

    // Garantir que o cabeçalho esteja visível inicialmente
    setHeaderVisible(true);

    // Definir evento de rolagem no elemento main
    const mainElement = mainRef.current;
    if (mainElement) {
      mainElement.addEventListener('scroll', handleScroll, { passive: true });

      return () => {
        mainElement.removeEventListener('scroll', handleScroll);
      };
    }
  }, [isMobile, mainRef.current]);

  const menuItems = [
    { name: 'Dashboard', path: '/', icon: <Home className="w-5 h-5" />, badge: null },
    { name: 'Clientes', path: '/clientes', icon: <Users className="w-5 h-5" />, badge: null },
    { name: 'Visitas', path: '/visitas', icon: <MapPin className="w-5 h-5" />, badge: null },
    { name: 'Nova Vistoria', path: '/nova-vistoria', icon: <ClipboardCheck className="w-5 h-5" />, badge: null },
    { name: 'Relatórios', path: '/relatorios', icon: <FileText className="w-5 h-5" />, badge: null },
    { name: 'Meu Perfil', path: '/perfil', icon: <User className="w-5 h-5" />, badge: null },
  ];

  // Toggle sidebar collapsed state (only on desktop)
  const toggleSidebar = () => {
    if (!isMobile) {
      setSidebarCollapsed(!sidebarCollapsed);
    }
  };

  const [open, setOpen] = useState(false); // Added state for mobile menu

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Top Header - ocultável na rolagem em dispositivos móveis */}
      <header 
        className={cn(
          "bg-white border-b flex items-center justify-between px-4 shadow-sm transform transition-all duration-300",
          isMobile ? "fixed top-0 left-0 right-0 z-40 h-16" : "h-16", 
          isMobile && !headerVisible && "-translate-y-full opacity-0"
        )}
      >
        <div className="flex items-center">
          {/* Logo para ambos os modos (mobile e desktop) */}
          <div className={cn(
            "flex items-center",
            isMobile ? "flex-1 min-w-0" : "mr-6"
          )}>
            <div className="rounded-full bg-primary p-1 mr-2 flex-shrink-0">
              <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDZDMTMuNjU2OSA2IDE1IDQuNjU2ODUgMTUgM0MxNSAxLjM0MzE1IDEzLjY1NjkgMCAxMiAwQzEwLjM0MzEgMCA5IDEuMzQzMTUgOSAzQzkgNC42NTY4NSAxMC4zNDMxIDYgMTIgNloiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik0xMiAyNEMxNS4zMTM3IDI0IDE4IDIxLjMxMzcgMTggMThDMTggMTQuNjg2MyAxNS4zMTM3IDEyIDEyIDEyQzguNjg2MjkgMTIgNiAxNC42ODYzIDYgMThDNiAyMS4zMTM3IDguNjg2MjkgMjQgMTIgMjRaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMjQgMTJDMjQgMTMuNjU2OSAyMi42NTY5IDE1IDIxIDE1QzE5LjM0MzEgMTUgMTggMTMuNjU2OSAxOCAxMkMxOCAxMC4zNDMxIDE5LjM0MzEgOSAyMSA5QzIyLjY1NjkgOSAyNCAxMC4zNDMxIDI0IDEyWiIgZmlsbD0id2hpdGUiLz4KPHBhdGggZD0iTTYgMTJDNiAxMy42NTY5IDQuNjU2ODUgMTUgMyAxNUMxLjM0MzE1IDE1IDAgMTMuNjU2OSAwIDEyQzAgMTAuMzQzMSAxLjM0MzE1IDkgMyA5QzQuNjU2ODUgOSA2IDEwLjM0MzEgNiAxMloiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik00LjkyNzI0IDE4LjEyODFDNS45OTU0NyAxNy4wNTk5IDUuOTk1NDcgMTUuMzc2OCA0LjkyNzI0IDE0LjMwODZDMy44NTkwMiAxMy4yNDAzIDIuMTc1OTQgMTMuMjQwMyAxLjEwNzcyIDE0LjMwODZDMC4wMzk0OTgzIDE1LjM3NjggMC4wMzk0OTg0IDE3LjA1OTkgMS4xMDc3MiAxOC4xMjgxQzIuMTc1OTQgMTkuMTk2MyAzLjg1OTAyIDE5LjE5NjMgNC45MjcyNCAxOC4xMjgxWiIgZmlsbD0id2hpdGUiLz4KPHBhdGggZD0iTTIyLjg5MjMgMTguMTI4MUMyMy45NjA1IDE3LjA1OTkgMjMuOTYwNSAxNS4zNzY4IDIyLjg5MjMgMTQuMzA4NkMyMS44MjQxIDEzLjI0MDMgMjAuMTQxIDE0LjMwODYgMTQuNTYzNCAxNS4zNzY4QzEzLjQ5NTIgMTYuNDQ1IDE3LjMxNDQgMTkuMTk2MyAyMi44OTIzIDE4LjEyODFaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNNC45MjcyNCA5LjY5MTM5QzUuOTk1NDcgMTAuNzU5NiA1Ljk5NTQ3IDEyLjQ0MjcgNC45MjcyNCAxMy41MTA5QzMuODU5MDIgMTQuNTc5MiAyLjE3NTk0IDE0LjU3OTIgMS4xMDc3MiAxMy41MTA5QzAuMDM5NDk4MyAxMi40NDI3IDAuMDM5NDk4MyAxMC43NTk2IDEuMTA3NzIgOS42OTEzOUMyLjE3NTk0IDguNjIzMTcgMy44NTkwMiA4LjYyMzE3IDQuOTI3MjQgOS42OTEzOVoiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik0xNC41MDYzIDQuOTI3MjRDMTMuNDM4MSAzLjg1OTAyIDExLjc1NSAzLjg1OTAyIDEwLjY4NjggNC45MjcyNEM5LjYxODU2IDUuOTk1NDcgOS42MTg1NiA3LjY3ODU0IDEwLjY4NjggOC43NDY3N0MxMS43NTUgOS44MTQ5OSAxMy40MzgxIDkuODE0OTkgMTQuNTA2MyA4Ljc0Njc3QzE1LjU3NDUgNy42Nzg1NCAxNS41NzQ1IDUuOTk1NDcgMTQuNTA2MyA0LjkyNzI0WiIgZmlsbD0id2hpdGUiLz4KPHBhdGggZD0iTTE0LjUwNjMgMjIuODkyM0MxMy40MzgxIDIzLjk2MDUgMTEuNzU1IDIzLjk2MDUgMTAuNjg2OCAyMi44OTIzQzkuNjE4NTYgMjEuODI0MSA5LjYxODU2IDIwLjE0MSAxMC42ODY4IDE5LjA3MjhDMTEuNzU1IDE4LjAwNDUgMTMuNDM4MSAxOC4wMDQ1IDE0LjUwNjMgMTkuMDcyOEMxNS41NzQ1IDIwLjE0MSAxNS41NzQ1IDIxLjgyNDEgMTQuNTA2MyAyMi44OTIzWiIgZmlsbD0id2hpdGUiLz4KPHBhdGggZD0iTTIyLjg5MjMgOS42OTEzOUMyMy45NjA1IDEwLjc1OTYgMjMuOTYwNSAxMi40NDI3IDIyLjg5MjMgMTMuNTEwOUMyMS44MjQxIDE0LjU3OTIgMjAuMTQxIDE0LjU3OTIgMTkuMDcyOCAxMy41MTA5QzE4LjAwNDUgMTIuNDQyNyAxOC4wMDQ1IDEwLjc1OTYgMTkuMDcyOCA5LjY5MTM5QzIwLjE0MSA4LjYyMzE3IDIxLjgyNDEgOC42MjMxNyAyMi44OTIzIDkuNjkxMzlaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K" alt="Brasilit" className="w-6 h-6" />
            </div>
            {(!sidebarCollapsed || isMobile) && (
              <h1 className={cn(
                "font-bold text-lg truncate",
                isMobile && "flex-1 mr-2"
              )}>
                Brasilit Técnico
              </h1>
            )}
          </div>

          {/* Barra de pesquisa - só aparece em telas maiores */}
          <div className="hidden md:flex items-center h-9 w-64 rounded-md border border-input bg-white px-3 py-1 text-sm shadow-sm transition-colors">
            <Search className="h-4 w-4 mr-2 text-muted-foreground" />
            <input 
              type="search" 
              placeholder="Procurar..." 
              className="flex-1 bg-transparent outline-none"
            />
          </div>
        </div>

        {/* Ações e perfil do usuário - versão simplificada para mobile */}
        <div className="flex items-center gap-2">
          {/* Em mobile mostramos o menu hambúrguer, perfil e notificações */}
          {isMobile ? (
            <>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] text-white">
                  2
                </span>
              </Button>
              <Avatar>
                <AvatarImage src={user?.photoUrl} />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {user?.name?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <Button 
                variant="ghost" 
                size="icon" 
                className="ml-1" 
                onClick={() => setOpen(true)}
              >
                <MenuIcon className="h-6 w-6" />
              </Button>
            </>
          ) : (
            <>
              <TooltipProvider>
                {/* Botão de notificações */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative">
                      <Bell className="h-5 w-5" />
                      <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] text-white">
                        2
                      </span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Notificações</TooltipContent>
                </Tooltip>

                {/* Botão de ajuda */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <HelpCircle className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Ajuda</TooltipContent>
                </Tooltip>

                {/* Botão de configurações */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Settings className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Configurações</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <Separator orientation="vertical" className="h-8 mx-2" />

              {/* Perfil do usuário */}
              <div className="flex items-center gap-3">
                <div className="text-right mr-2 hidden sm:block">
                  <p className="text-sm font-medium">{user?.name || 'Usuário'}</p>
                  <p className="text-xs text-muted-foreground">{user?.email || 'usuário@email.com'}</p>
                </div>
                <Avatar>
                  <AvatarImage src={user?.photoUrl} />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {user?.name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
              </div>
            </>
          )}
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - apenas visível em desktop */}
        {!isMobile && (
          <aside 
            className={cn(
              "bg-white border-r flex-shrink-0 flex flex-col z-50 transition-all duration-300 ease-in-out shadow-lg",
              sidebarCollapsed ? "w-16" : "w-64"
            )}
          >
            {/* Botão para recolher/expandir a sidebar (só no desktop) */}
            <div className="px-3 py-2 flex justify-end">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-7 w-7" 
                onClick={toggleSidebar}
              >
                {sidebarCollapsed ? (
                  <ChevronRight className="h-4 w-4" />
                ) : (
                  <ChevronLeft className="h-4 w-4" />
                )}
              </Button>
            </div>

            {/* Menu de navegação */}
            <nav className="flex-1 overflow-y-auto py-4">
              <ul className="space-y-1 px-2">
                {menuItems.map((item) => (
                  <li key={item.path}>
                    <Link href={item.path}>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <a 
                              className={cn(
                                "flex items-center px-3 py-2 rounded-md transition-colors",
                                location === item.path 
                                  ? "bg-primary/10 text-primary font-medium" 
                                  : "text-gray-700 hover:bg-gray-100",
                                sidebarCollapsed && "justify-center"
                              )}
                            >
                              <div className="relative">
                                {item.icon}
                                {item.badge && sidebarCollapsed && (
                                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-white">
                                    {item.badge}
                                  </span>
                                )}
                              </div>
                              {!sidebarCollapsed && (
                                <span className="ml-3">{item.name}</span>
                              )}
                              {!sidebarCollapsed && item.badge && (
                                <Badge 
                                  variant="outline" 
                                  className="ml-auto bg-primary/10 text-primary border-primary/20"
                                >
                                  {item.badge}
                                </Badge>
                              )}
                            </a>
                          </TooltipTrigger>
                          {sidebarCollapsed && (
                            <TooltipContent side="right">
                              {item.name}
                            </TooltipContent>
                          )}
                        </Tooltip>
                      </TooltipProvider>
                    </Link>
                  </li>
                ))}
              </ul>

              {/* Seção de ferramentas no final da sidebar */}
              <div className="mt-6 px-2">
                <Separator className="my-2" />

                {/* Configurações */}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link href="/configuracoes">
                        <a 
                          className={cn(
                            "w-full flex items-center px-3 py-2 rounded-md transition-colors text-gray-700 hover:bg-gray-100 mt-2",
                            sidebarCollapsed && "justify-center"
                          )}
                        >
                          <Settings className="h-5 w-5 text-gray-600" />
                          {!sidebarCollapsed && (
                            <span className="ml-3">Configurações</span>
                          )}
                        </a>
                      </Link>
                    </TooltipTrigger>
                    {sidebarCollapsed && (
                      <TooltipContent side="right">
                        Configurações
                      </TooltipContent>
                    )}
                  </Tooltip>
                </TooltipProvider>

                {/* Botão de logout */}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button 
                        onClick={() => logout.mutate()}
                        className={cn(
                          "w-full flex items-center px-3 py-2 rounded-md transition-colors text-gray-700 hover:bg-gray-100 mt-2",
                          sidebarCollapsed && "justify-center"
                        )}
                      >
                        <LogOut className="h-5 w-5 text-red-500" />
                        {!sidebarCollapsed && (
                          <span className="ml-3 text-red-500">Sair</span>
                        )}
                      </button>
                    </TooltipTrigger>
                    {sidebarCollapsed && (
                      <TooltipContent side="right">
                        Sair
                      </TooltipContent>
                    )}
                  </Tooltip>
                </TooltipProvider>
              </div>
            </nav>
          </aside>
        )}

        {/* Conteúdo principal */}
        <main 
          ref={mainRef}
          className="flex-1 overflow-auto bg-gray-50 pb-16"
        >
          {/* Espaçador para compensar o cabeçalho fixo em mobile */}
          {isMobile && <div className="h-16" />}

          <div className="container mx-auto p-6">
            {children}
          </div>
        </main>
      </div>

      {/* Menu deslizante para mobile */}
      {isMobile && <MobileMenu open={open} setOpen={setOpen}/>} {/* Pass open and setOpen to MobileMenu */}
      
      {/* Navegação de rodapé no canto inferior direito */}
      {isMobile && <BottomNavigation />}
    </div>
  );
}