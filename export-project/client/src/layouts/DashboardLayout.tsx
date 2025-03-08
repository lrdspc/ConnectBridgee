import React, { useState, useEffect, ReactNode } from 'react';
import { useLocation, Link } from 'wouter';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Home, 
  MapPin, 
  ClipboardList, 
  User, 
  Settings, 
  Menu, 
  X, 
  FileText, 
  BarChart2, 
  LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useIsMobile } from '@/hooks/use-mobile';

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [location] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const isMobile = useIsMobile();

  const menuItems = [
    { name: 'Dashboard', path: '/', icon: <Home className="w-5 h-5" /> },
    { name: 'Rotas', path: '/rotas', icon: <MapPin className="w-5 h-5" /> },
    { name: 'Visitas', path: '/visitas', icon: <ClipboardList className="w-5 h-5" /> },
    { name: 'Inspeções', path: '/inspecoes', icon: <FileText className="w-5 h-5" /> },
    { name: 'Relatórios', path: '/relatorios', icon: <BarChart2 className="w-5 h-5" /> },
    { name: 'Perfil', path: '/perfil', icon: <User className="w-5 h-5" /> },
    { name: 'Configurações', path: '/configuracoes', icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <div className="h-screen flex flex-col md:flex-row bg-gray-50">
      {/* Sidebar móvel - só aparece quando aberta */}
      {isMobile && sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setSidebarOpen(false)}></div>
      )}
      
      {/* Sidebar */}
      <div 
        className={cn(
          "w-full md:w-64 bg-primary text-white flex-shrink-0 flex flex-col transition-all duration-300 ease-in-out",
          isMobile && "fixed inset-y-0 left-0 z-50 transform",
          isMobile && sidebarOpen ? "translate-x-0" : isMobile && "-translate-x-full"
        )}
      >
        {/* Logo e cabeçalho da sidebar */}
        <div className="p-4 border-b border-primary-foreground/10 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="rounded-full bg-white p-1">
              <img src="/images/logo-icon.svg" alt="Brasilit" className="w-7 h-7" />
            </div>
            <h1 className="font-bold text-xl">Brasilit Técnico</h1>
          </div>
          {isMobile && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-white hover:bg-primary-foreground/10" 
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-5 h-5" />
            </Button>
          )}
        </div>
        
        {/* Menu de navegação */}
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link href={item.path}>
                  <a 
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                      location === item.path 
                        ? "bg-white/10 text-white font-medium" 
                        : "text-white/70 hover:text-white hover:bg-white/10"
                    )}
                    onClick={() => isMobile && setSidebarOpen(false)}
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </a>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        {/* Usuário logado */}
        <div className="p-4 border-t border-primary-foreground/10">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={user?.photoUrl} />
              <AvatarFallback className="bg-primary-foreground/20 text-white">
                {user?.name?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{user?.name || 'Usuário'}</p>
              <p className="text-white/70 text-xs truncate">{user?.email || 'usuário@email.com'}</p>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-white hover:bg-primary-foreground/10"
              onClick={() => logout.mutate()}
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Container Principal */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {/* Header superior */}
        <header className="h-16 bg-white border-b flex items-center px-4 justify-between">
          {isMobile && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </Button>
          )}
          
          <div className="flex-1 flex justify-end items-center gap-4">
            {/* Espaço para notificações ou informações importantes */}
          </div>
        </header>
        
        {/* Conteúdo principal */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}