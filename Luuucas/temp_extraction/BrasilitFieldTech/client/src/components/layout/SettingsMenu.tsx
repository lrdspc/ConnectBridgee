import React, { useState, useEffect, useCallback } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Settings, UserCircle, Database, MapPin, Monitor, LogOut } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from 'wouter';
import { db, initializeDevDatabase } from '../../lib/db';

type UserSettings = {
  mapType: string;
  useHighAccuracyGPS: boolean;
  theme: 'light' | 'dark' | 'system';
  mapZoomLevel: number;
  offlineMode: boolean;
  username: string;
};

interface SettingsMenuProps {
  className?: string;
}

export function SettingsMenu({ className }: SettingsMenuProps) {
  const [showDialog, setShowDialog] = useState(false);
  const [settingsTab, setSettingsTab] = useState<'account' | 'map' | 'appearance'>('account');
  
  // Estado para armazenar as configurações
  const [settings, setSettings] = useState<UserSettings>({
    mapType: 'openstreetmap',
    useHighAccuracyGPS: true,
    theme: 'light',
    mapZoomLevel: 13,
    offlineMode: false,
    username: 'Técnico',
  });
  
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  
  // Carregar configurações do localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (e) {
        console.error('Erro ao carregar configurações:', e);
      }
    }
  }, []);
  
  // Salvar configurações quando alteradas
  const saveSettings = (newSettings: UserSettings) => {
    setSettings(newSettings);
    localStorage.setItem('userSettings', JSON.stringify(newSettings));
    
    // Aplicar configurações
    if (newSettings.theme !== 'system') {
      document.documentElement.classList.toggle('dark', newSettings.theme === 'dark');
    } else {
      const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.classList.toggle('dark', isDarkMode);
    }
  };
  
  const handleLogout = () => {
    // Simular logout
    toast({
      title: 'Logout realizado',
      description: 'Você foi desconectado com sucesso.',
    });
    
    // Redirecionar para a tela de login
    setLocation('/');
  };
  
  const resetDemoData = async () => {
    try {
      await initializeDevDatabase();
      toast({
        title: 'Dados demo reiniciados',
        description: 'Os dados de demonstração foram restaurados com sucesso.',
      });
      window.location.reload(); // Recarregar para refletir as mudanças
    } catch (error) {
      console.error('Erro ao resetar dados demo:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível reiniciar os dados de demonstração.',
        variant: 'destructive'
      });
    }
  };
  
  const clearAllData = async () => {
    try {
      await db.delete();
      toast({
        title: 'Dados apagados',
        description: 'Todos os dados do aplicativo foram apagados.',
      });
      
      // Após apagar tudo, recarregar para iniciar do zero
      window.location.reload();
    } catch (error) {
      console.error('Erro ao limpar dados:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível limpar os dados.',
        variant: 'destructive'
      });
    }
  };
  
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className={className}>
            <Settings className="h-[1.2rem] w-[1.2rem]" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => {
            setSettingsTab('account');
            setShowDialog(true);
          }}>
            <UserCircle className="mr-2 h-4 w-4" />
            Perfil
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Configurações</DropdownMenuLabel>
          
          <DropdownMenuItem onClick={() => {
            setSettingsTab('map');
            setShowDialog(true);
          }}>
            <MapPin className="mr-2 h-4 w-4" />
            Mapa e GPS
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={() => {
            setSettingsTab('appearance');
            setShowDialog(true);
          }}>
            <Monitor className="mr-2 h-4 w-4" />
            Aparência
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={resetDemoData}>
            <Database className="mr-2 h-4 w-4" />
            Reiniciar dados demo
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={handleLogout} className="text-red-600">
            <LogOut className="mr-2 h-4 w-4" />
            Sair
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {settingsTab === 'account' && 'Perfil de Usuário'}
              {settingsTab === 'map' && 'Configurações de Mapa e GPS'}
              {settingsTab === 'appearance' && 'Aparência'}
            </DialogTitle>
            <DialogDescription>
              {settingsTab === 'account' && 'Gerencie suas informações de perfil.'}
              {settingsTab === 'map' && 'Ajuste configurações do mapa e GPS.'}
              {settingsTab === 'appearance' && 'Personalize a aparência do aplicativo.'}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            {/* Configurações de Perfil */}
            {settingsTab === 'account' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Nome do Técnico</Label>
                  <Input
                    id="username"
                    value={settings.username}
                    onChange={(e) => saveSettings({...settings, username: e.target.value})}
                    placeholder="Seu nome"
                  />
                </div>
                
                <div className="space-y-2 pt-4">
                  <h4 className="font-medium text-sm">Dados do Aplicativo</h4>
                  <div className="flex flex-col space-y-2">
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        const confirm = window.confirm(
                          'Esta ação irá apagar TODOS os dados do aplicativo. Continuar?'
                        );
                        if (confirm) clearAllData();
                      }}
                    >
                      Limpar todos os dados
                    </Button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Configurações de Mapa */}
            {settingsTab === 'map' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="high-accuracy">GPS de alta precisão</Label>
                    <p className="text-xs text-muted-foreground">
                      Usar GPS mais preciso (consome mais bateria)
                    </p>
                  </div>
                  <Switch
                    id="high-accuracy"
                    checked={settings.useHighAccuracyGPS}
                    onCheckedChange={(checked) => 
                      saveSettings({...settings, useHighAccuracyGPS: checked})
                    }
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="zoom-level">Nível de zoom padrão</Label>
                  <div className="flex items-center space-x-4">
                    <Slider
                      id="zoom-level"
                      value={[settings.mapZoomLevel]}
                      min={1}
                      max={19}
                      step={1}
                      onValueChange={(value) => 
                        saveSettings({...settings, mapZoomLevel: value[0]})
                      }
                    />
                    <span className="w-12 text-center">{settings.mapZoomLevel}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="offline-mode">Modo offline</Label>
                    <p className="text-xs text-muted-foreground">
                      Armazenar mapas para uso sem internet
                    </p>
                  </div>
                  <Switch
                    id="offline-mode"
                    checked={settings.offlineMode}
                    onCheckedChange={(checked) => 
                      saveSettings({...settings, offlineMode: checked})
                    }
                  />
                </div>
              </div>
            )}
            
            {/* Configurações de Aparência */}
            {settingsTab === 'appearance' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Tema da Interface</Label>
                  <div className="flex flex-col space-y-1">
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="light-theme"
                        name="theme"
                        value="light"
                        checked={settings.theme === 'light'}
                        onChange={() => saveSettings({...settings, theme: 'light'})}
                      />
                      <Label htmlFor="light-theme">Claro</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="dark-theme"
                        name="theme"
                        value="dark"
                        checked={settings.theme === 'dark'}
                        onChange={() => saveSettings({...settings, theme: 'dark'})}
                      />
                      <Label htmlFor="dark-theme">Escuro</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="system-theme"
                        name="theme"
                        value="system"
                        checked={settings.theme === 'system'}
                        onChange={() => saveSettings({...settings, theme: 'system'})}
                      />
                      <Label htmlFor="system-theme">Usar configuração do sistema</Label>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button onClick={() => setShowDialog(false)}>Fechar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}