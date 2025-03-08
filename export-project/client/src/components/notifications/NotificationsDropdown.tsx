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
import { Bell, Check, ChevronRight, Info, Shield, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Link } from 'wouter';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  read: boolean;
  date: string;
  link?: string;
}

interface NotificationsDropdownProps {
  className?: string;
}

export function NotificationsDropdown({ className }: NotificationsDropdownProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  
  // Estado para as notificações (normalmente viria de um contexto ou API)
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Relatório pendente',
      message: 'Você tem um relatório de vistoria pendente para finalizar',
      type: 'warning',
      read: false,
      date: new Date().toISOString(),
      link: '/relatorio-vistoria'
    },
    {
      id: '2',
      title: 'Visita agendada hoje',
      message: 'Visita ao cliente Construtora ABC às 14:00',
      type: 'info',
      read: false,
      date: new Date().toISOString(),
      link: '/visitas'
    },
    {
      id: '3',
      title: 'Relatório aprovado',
      message: 'Seu relatório de vistoria foi aprovado pelo gerente',
      type: 'success',
      read: true,
      date: new Date(Date.now() - 86400000).toISOString(),
      link: '/relatorios'
    }
  ]);

  // Função para marcar notificação como lida
  const markAsRead = (id: string) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  // Função para marcar todas como lidas
  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({
      ...notification,
      read: true
    })));
    
    toast({
      title: "Notificações lidas",
      description: "Todas as notificações foram marcadas como lidas",
    });
  };

  // Função para remover notificação
  const removeNotification = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications(notifications.filter(notification => notification.id !== id));
  };

  // Contador de notificações não lidas
  const unreadCount = notifications.filter(n => !n.read).length;

  // Função para renderizar o ícone com base no tipo
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'info':
        return <Info className="h-4 w-4 text-blue-500" />;
      case 'warning':
        return <Bell className="h-4 w-4 text-amber-500" />;
      case 'success':
        return <Shield className="h-4 w-4 text-green-500" />;
      case 'error':
        return <X className="h-4 w-4 text-red-500" />;
      default:
        return <Info className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className={cn(
            "relative h-9 w-9",
            unreadCount > 0 && "after:absolute after:top-1 after:right-1 after:h-2 after:w-2 after:rounded-full after:bg-red-500",
            className
          )}
        >
          <Bell className="h-5 w-5" />
          <span className="sr-only">Notificações</span>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between p-4 border-b">
          <DropdownMenuLabel className="font-semibold cursor-default">
            Notificações
            {unreadCount > 0 && (
              <Badge variant="secondary" className="ml-2 px-1 py-0 text-xs">
                {unreadCount}
              </Badge>
            )}
          </DropdownMenuLabel>
          
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs h-7 px-2"
              onClick={markAllAsRead}
            >
              <Check className="h-3 w-3 mr-1" />
              Marcar todas como lidas
            </Button>
          )}
        </div>
        
        {notifications.length === 0 ? (
          <div className="text-center p-6 text-muted-foreground">
            <Bell className="h-8 w-8 mx-auto mb-2 opacity-20" />
            <p>Sem notificações no momento</p>
          </div>
        ) : (
          <div className="max-h-[60vh] overflow-y-auto py-1">
            {notifications.map(notification => (
              <Link key={notification.id} href={notification.link || '#'}>
                <DropdownMenuItem 
                  className={cn(
                    "flex flex-col items-start px-4 py-3 cursor-pointer gap-1",
                    !notification.read && "bg-muted/40"
                  )}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex w-full justify-between">
                    <div className="flex gap-2 items-center">
                      {getNotificationIcon(notification.type)}
                      <span className={cn(
                        "font-medium text-sm",
                        !notification.read && "font-semibold"
                      )}>
                        {notification.title}
                      </span>
                    </div>
                    <Button
                      variant="ghost" 
                      size="icon" 
                      className="h-5 w-5 -mt-1 -mr-1 opacity-50 hover:opacity-100"
                      onClick={(e) => removeNotification(notification.id, e)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                  
                  <p className="text-xs text-muted-foreground ml-6">
                    {notification.message}
                  </p>
                  
                  <div className="flex w-full justify-between items-center mt-1">
                    <span className="text-[10px] text-muted-foreground ml-6">
                      {format(new Date(notification.date), "dd MMM, HH:mm", { locale: ptBR })}
                    </span>
                    
                    {notification.link && (
                      <span className="flex items-center text-[10px] text-blue-500">
                        Ver detalhes 
                        <ChevronRight className="h-3 w-3 ml-1" />
                      </span>
                    )}
                  </div>
                </DropdownMenuItem>
              </Link>
            ))}
          </div>
        )}

        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          className="p-3 text-center cursor-pointer justify-center"
          onClick={() => window.location.href = '/configuracoes?tab=notificacoes'}
        >
          <span>Configurações de notificação</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}