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
import { Bell, CheckCircle, AlertCircle, Calendar, Clock, FileText, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDate } from '@/lib/utils';

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
  // Estado das notificações
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
      date: new Date(Date.now() - 86400000).toISOString(), // Ontem
      link: '/relatorios'
    }
  ]);

  // Contagem de notificações não lidas
  const unreadCount = notifications.filter(n => !n.read).length;

  // Marcar uma notificação como lida
  const markAsRead = (id: string) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  // Marcar todas as notificações como lidas
  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, read: true })));
  };

  // Renderizar ícone baseado no tipo de notificação
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'info':
        return <Calendar className="h-4 w-4 text-blue-500" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-amber-500" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className={cn("relative", className)}>
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] text-white">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[350px]">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notificações</span>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs h-7 px-2" 
              onClick={markAllAsRead}
            >
              Marcar todas como lidas
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {notifications.length === 0 ? (
          <div className="py-4 text-center text-sm text-muted-foreground">
            Nenhuma notificação no momento
          </div>
        ) : (
          <div className="max-h-[300px] overflow-auto">
            {notifications.map((notification) => (
              <DropdownMenuItem 
                key={notification.id}
                className={cn(
                  "flex flex-col items-start py-2 px-4 cursor-pointer",
                  !notification.read && "bg-muted/50"
                )}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="flex items-start w-full">
                  <div className="mt-0.5 mr-3">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className={cn(
                        "text-sm font-medium",
                        !notification.read && "font-semibold"
                      )}>
                        {notification.title}
                      </p>
                      <span className="text-[10px] text-muted-foreground ml-2">
                        {formatDate(new Date(notification.date), 'dd/MM HH:mm')}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {notification.message}
                    </p>
                  </div>
                </div>
                {!notification.read && (
                  <div className="w-2 h-2 rounded-full bg-primary absolute right-2 top-2"></div>
                )}
              </DropdownMenuItem>
            ))}
          </div>
        )}
        
        <DropdownMenuSeparator />
        <DropdownMenuItem className="justify-center" asChild>
          <Button variant="ghost" size="sm" className="w-full" asChild>
            <a href="/configuracoes?tab=notifications">Ver todas as notificações</a>
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}