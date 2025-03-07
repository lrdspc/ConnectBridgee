import React, { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import { Link, useLocation } from 'wouter';
import { 
  User, Settings, LogOut, FileCog, 
  UserCog, Bell, HelpCircle, FileText 
} from 'lucide-react';
import { avatarFallback, cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface UserProfileDropdownProps {
  className?: string;
}

export function UserProfileDropdown({ className }: UserProfileDropdownProps) {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [, navigate] = useLocation();
  const { toast } = useToast();
  
  // Se não houver usuário, não renderiza nada
  if (!user) return null;
  
  // Função simplificada para o exemplo, já que não temos a implementação real do logout
  const handleLogout = () => {
    // Implementação simplificada para fins de demonstração
    localStorage.removeItem('authToken');
    navigate('/login');
    toast({
      title: 'Desconectado',
      description: 'Você foi desconectado do sistema.'
    });
  };
  
  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className={cn("relative h-9 w-9 rounded-full", className)}
        >
          <Avatar className="h-9 w-9">
            <AvatarImage 
              src={user.photoUrl} 
              alt={user.name} 
            />
            <AvatarFallback>{avatarFallback(user.name)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuItem asChild>
          <Link href="/perfil">
            <User className="mr-2 h-4 w-4" />
            <span>Meu Perfil</span>
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuItem asChild>
          <Link href="/configuracoes">
            <UserCog className="mr-2 h-4 w-4" />
            <span>Minha Conta</span>
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuItem asChild>
          <Link href="/configuracoes?tab=notificacoes">
            <Bell className="mr-2 h-4 w-4" />
            <span>Notificações</span>
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem asChild>
          <Link href="/configuracoes?tab=aparencia">
            <Settings className="mr-2 h-4 w-4" />
            <span>Configurações</span>
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuItem asChild>
          <Link href="/ajuda">
            <HelpCircle className="mr-2 h-4 w-4" />
            <span>Ajuda e Suporte</span>
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuItem asChild>
          <Link href="/termos-de-uso">
            <FileText className="mr-2 h-4 w-4" />
            <span>Termos de Uso</span>
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          className="text-red-600"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}