import React, { useState, useEffect } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from '@/components/ui/dropdown-menu';
import { 
  Bell, 
  X, 
  Info, 
  AlertTriangle, 
  CheckCircle, 
  ShieldAlert, 
  Clock, 
  Globe,
  ShieldCheck
} from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { useToast } from '@/hooks/use-toast';

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
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  
  // Carregar notificações (mock para demonstração)
  useEffect(() => {
    // Em um caso real, isso seria carregado de uma API ou localStorage
    const mockNotifications: Notification[] = [
      {
        id: '1',
        title: 'Relatório pendente',
        message: 'Você tem um relatório de vistoria pendente para finalizar.',
        type: 'warning',
        read: false,
        date: new Date().toISOString(),
        link: '/relatorio-vistoria'
      },
      {
        id: '2',
        title: 'Visita agendada hoje',
        message: 'Você tem uma visita agendada com Construtora ABC às 14:30',
        type: 'info',
        read: false,
        date: new Date().toISOString(),
        link: '/visitas'
      },
      {
        id: '3',
        title: 'Relatório aprovado',
        message: 'Seu relatório técnico foi aprovado pelo gerente.',
        type: 'success',
        read: true,
        date: new Date(Date.now() - 86400000).toISOString(),
        link: '/relatorios'
      },
      {
        id: '4',
        title: 'Atualização do sistema',
        message: 'Nova versão disponível com melhorias no editor de relatórios.',
        type: 'info',
        read: true,
        date: new Date(Date.now() - 172800000).toISOString()
      }
    ];
    
    setNotifications(mockNotifications);
    
    // Carregar do localStorage se existir
    const savedNotifications = localStorage.getItem('notifications');
    if (savedNotifications) {
      try {
        setNotifications(JSON.parse(savedNotifications));
      } catch (error) {
        console.error('Erro ao carregar notificações:', error);
      }
    }
  }, []);
  
  // Salvar notificações no localStorage quando mudar
  useEffect(() => {
    if (notifications.length > 0) {
      localStorage.setItem('notifications', JSON.stringify(notifications));
    }
  }, [notifications]);
  
  // Marcar uma notificação como lida
  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };
  
  // Marcar todas as notificações como lidas
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
    
    toast({
      title: "Notificações lidas",
      description: "Todas as notificações foram marcadas como lidas",
    });
  };
  
  // Remover uma notificação
  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };
  
  // Remover todas as notificações
  const removeAllNotifications = () => {
    setNotifications([]);
    
    toast({
      title: "Notificações removidas",
      description: "Todas as notificações foram removidas",
    });
  };
  
  // Obter o ícone com base no tipo da notificação
  const getIcon = (type: string) => {
    switch (type) {
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <ShieldAlert className="h-5 w-5 text-red-500" />;
      default:
        return <Globe className="h-5 w-5 text-gray-500" />;
    }
  };
  
  // Contar notificações não lidas
  const unreadCount = notifications.filter(n => !n.read).length;
  
  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild className={className}>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between p-4">
          <DropdownMenuLabel className="font-semibold text-lg">
            Notificações
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unreadCount}
              </Badge>
            )}
          </DropdownMenuLabel>
          
          <div className="flex gap-2">
            {notifications.some(n => !n.read) && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={markAllAsRead}
                className="h-8 text-xs"
              >
                Marcar todas como lidas
              </Button>
            )}
            
            {notifications.length > 0 && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={removeAllNotifications}
                className="h-8 w-8 text-gray-500 hover:text-gray-900"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
        
        <DropdownMenuSeparator />
        
        <div className="max-h-[400px] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="py-8 text-center text-gray-500">
              <Bell className="mx-auto h-10 w-10 text-gray-300 mb-2" />
              <p>Nenhuma notificação no momento</p>
            </div>
          ) : (
            notifications.map(notification => (
              <div 
                key={notification.id} 
                className={`p-3 border-b last:border-b-0 ${notification.read ? 'bg-white' : 'bg-blue-50'}`}
              >
                <div className="flex">
                  <div className="mr-3 mt-0.5">
                    {getIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <p className={`text-sm font-medium ${!notification.read && 'font-semibold'}`}>
                        {notification.title}
                      </p>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 -mt-1 -mr-1"
                        onClick={() => removeNotification(notification.id)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center text-xs text-gray-500">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>
                          {format(new Date(notification.date), "dd 'de' MMMM, HH:mm", { locale: ptBR })}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        {!notification.read && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-7 text-xs text-blue-600"
                            onClick={() => markAsRead(notification.id)}
                          >
                            Marcar como lida
                          </Button>
                        )}
                        
                        {notification.link && (
                          <DropdownMenuItem asChild className="p-0" onSelect={() => {
                            if (!notification.read) {
                              markAsRead(notification.id);
                            }
                            setOpen(false);
                          }}>
                            <Link href={notification.link}>
                              <Button variant="ghost" size="sm" className="h-7 text-xs">
                                Ver
                              </Button>
                            </Link>
                          </DropdownMenuItem>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        
        {notifications.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <div className="p-2 text-center">
              <Link href="/configuracoes?tab=notificacoes" onClick={() => setOpen(false)}>
                <Button variant="ghost" size="sm" className="w-full text-xs">
                  Gerenciar notificações
                </Button>
              </Link>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}