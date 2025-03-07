import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  User, 
  Settings, 
  LogOut, 
  HelpCircle, 
  FileText, 
  Bell, 
  Moon, 
  Sun,
  Laptop
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useLocation } from 'wouter';

interface UserProfileDropdownProps {
  className?: string;
}

export function UserProfileDropdown({ className }: UserProfileDropdownProps) {
  const { user, logout } = useAuth();
  const [location, setLocation] = useLocation();
  
  const handleLogout = async () => {
    try {
      await logout.mutateAsync();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  // Toggle de tema entre claro/escuro/sistema
  const toggleTheme = (theme: 'light' | 'dark' | 'system') => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme-preference', theme);
      
      if (theme === 'system') {
        const systemPreference = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        document.documentElement.classList.toggle('dark', systemPreference === 'dark');
      } else {
        document.documentElement.classList.toggle('dark', theme === 'dark');
      }
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className={className}>
        <div className="flex items-center gap-3 cursor-pointer">
          <div className="text-right mr-2 hidden sm:block">
            <p className="text-sm font-medium">{user?.name || 'Usuário'}</p>
            <p className="text-xs text-muted-foreground">{user?.role || 'Técnico'}</p>
          </div>
          <Avatar>
            <AvatarImage src={user?.photoUrl} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {user?.name?.charAt(0) || 'U'}
            </AvatarFallback>
          </Avatar>
        </div>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-56">
        <div className="flex items-center justify-start p-2">
          <div className="flex flex-col space-y-1">
            <p className="font-medium">{user?.name || 'Usuário'}</p>
            <p className="text-xs text-muted-foreground">{user?.email || 'usuario@exemplo.com'}</p>
          </div>
        </div>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={() => setLocation('/perfil')}>
          <User className="mr-2 h-4 w-4" />
          <span>Meu Perfil</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => setLocation('/relatorios')}>
          <FileText className="mr-2 h-4 w-4" />
          <span>Meus Relatórios</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => setLocation('/configuracoes?tab=notifications')}>
          <Bell className="mr-2 h-4 w-4" />
          <span>Notificações</span>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuLabel>Tema</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => toggleTheme('light')}>
          <Sun className="mr-2 h-4 w-4" />
          <span>Claro</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => toggleTheme('dark')}>
          <Moon className="mr-2 h-4 w-4" />
          <span>Escuro</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => toggleTheme('system')}>
          <Laptop className="mr-2 h-4 w-4" />
          <span>Sistema</span>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={() => setLocation('/configuracoes')}>
          <Settings className="mr-2 h-4 w-4" />
          <span>Configurações</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => window.open('/ajuda', '_blank')}>
          <HelpCircle className="mr-2 h-4 w-4" />
          <span>Ajuda e Suporte</span>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={handleLogout} className="text-red-600">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sair</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}