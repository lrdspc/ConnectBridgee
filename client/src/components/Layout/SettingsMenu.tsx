import React from 'react';
import {
  Tabs,
  TabsList,
  TabsTrigger
} from '@/components/ui/tabs';
import {
  User,
  Lock,
  BellRing,
  MapPin,
  Database,
  Eye,
  Languages,
  Shield,
  Smartphone,
  Cloud,
  Settings as SettingsIcon,
} from 'lucide-react';

interface SettingsMenuProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

export function SettingsMenu({
  activeTab,
  onTabChange,
  orientation = 'horizontal',
  className
}: SettingsMenuProps) {
  // Lista de itens do menu de configurações
  const menuItems = [
    { id: 'conta', label: 'Conta', icon: <User className="h-4 w-4 mr-2" /> },
    { id: 'aparencia', label: 'Aparência', icon: <Eye className="h-4 w-4 mr-2" /> },
    { id: 'mapa', label: 'Mapa e GPS', icon: <MapPin className="h-4 w-4 mr-2" /> },
    { id: 'sincronizacao', label: 'Sincronização', icon: <Database className="h-4 w-4 mr-2" /> },
    { id: 'notificacoes', label: 'Notificações', icon: <BellRing className="h-4 w-4 mr-2" /> },
    { id: 'privacidade', label: 'Privacidade', icon: <Lock className="h-4 w-4 mr-2" /> }
  ];

  return (
    <Tabs
      value={activeTab}
      onValueChange={onTabChange}
      orientation={orientation}
      className={className}
    >
      <TabsList 
        className={orientation === 'vertical' 
          ? "flex flex-col h-full space-y-1" 
          : "grid grid-cols-3 lg:grid-cols-6"
        }
      >
        {menuItems.map(item => (
          <TabsTrigger 
            key={item.id} 
            value={item.id}
            className={orientation === 'vertical' ? "justify-start" : undefined}
          >
            {item.icon}
            <span className={orientation === 'horizontal' ? "hidden sm:inline" : undefined}>
              {item.label}
            </span>
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}