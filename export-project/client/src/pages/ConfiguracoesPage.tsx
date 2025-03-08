import React, { useState, useEffect } from 'react';
import { DashboardLayoutNew } from '../layouts/DashboardLayoutNew';
import { PageTransition } from '@/components/ui/loading-animation';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import {
  User,
  Lock,
  Settings,
  BellRing,
  Smartphone,
  MapPin,
  Sun,
  Moon,
  Database,
  RefreshCw,
  Trash2,
  Upload,
  Save,
  Laptop,
  Languages,
  Eye,
  ShieldCheck,
  Globe,
  X,
  FileText,
  Shield,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/useAuth';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Notification } from '@/components/notifications/NotificationsDropdown';
import { avatarFallback, cn } from '@/lib/utils';

export default function ConfiguracoesPage() {
  const { toast } = useToast();
  const [location, setLocation] = useLocation();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('conta');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Estado das configurações
  const [settings, setSettings] = useState({
    account: {
      name: user?.name || '',
      email: user?.email || '',
      phone: '(11) 97123-4567',
      photoUrl: user?.photoUrl || '',
      receiveEmails: true,
      twoFactorEnabled: false,
    },
    appearance: {
      theme: 'light' as 'light' | 'dark' | 'system',
      fontSize: 'medium' as 'small' | 'medium' | 'large',
      compactMode: false,
      language: 'pt-BR',
      reduceAnimations: false,
    },
    map: {
      defaultZoom: 14,
      mapProvider: 'osm',
      highAccuracyGPS: true,
      showTraffic: true,
      autoRouting: true,
    },
    sync: {
      syncInterval: 15,
      syncOnlyWifi: false,
      syncPhotosWhenIdle: true,
      compressPhotos: true,
      offlineMode: false,
    },
    notifications: {
      enablePush: true,
      notifyVisitReminders: true,
      notifyReportUpdates: true,
      notifySystemUpdates: true,
      soundEnabled: true,
      vibrationEnabled: true,
      doNotDisturb: false,
      doNotDisturbStart: '22:00',
      doNotDisturbEnd: '08:00',
    },
    privacy: {
      shareLocationWithTeam: true,
      shareAnalytics: true,
      saveSearchHistory: true,
    }
  });

  // Lista de notificações para exibição
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
    },
    {
      id: '4',
      title: 'Atualização do sistema',
      message: 'Nova versão do aplicativo disponível (v1.2.3)',
      type: 'info',
      read: true,
      date: new Date(Date.now() - 172800000).toISOString(),
      link: '#'
    }
  ]);

  // Verificar URL para definir a tab ativa
  useEffect(() => {
    const url = new URL(window.location.href);
    const tabParam = url.searchParams.get('tab');
    if (tabParam && ['conta', 'aparencia', 'mapa', 'sincronizacao', 'notificacoes', 'privacidade'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [location]);

  // Simular salvamento de configurações
  const handleSave = () => {
    setIsSaving(true);
    
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      
      toast({
        title: "Configurações salvas",
        description: "Suas preferências foram atualizadas com sucesso.",
      });
      
      // Resetar mensagem de sucesso após 3 segundos
      setTimeout(() => setSaveSuccess(false), 3000);
      
      // Salvar no localStorage
      localStorage.setItem('user_settings', JSON.stringify(settings));
    }, 1500);
  };

  // Função para marcar notificação como lida
  const markNotificationAsRead = (id: string) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  // Função para marcar todas notificações como lidas
  const markAllNotificationsAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, read: true })));
  };

  // Função para remover notificação
  const removeNotification = (id: string) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  };

  // Renderizar ícone baseado no tipo de notificação
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'info':
        return <Globe className="h-5 w-5 text-blue-500" />;
      case 'warning':
        return <BellRing className="h-5 w-5 text-amber-500" />;
      case 'success':
        return <ShieldCheck className="h-5 w-5 text-green-500" />;
      case 'error':
        return <Trash2 className="h-5 w-5 text-red-500" />;
      default:
        return <BellRing className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <PageTransition>
      <DashboardLayoutNew>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold tracking-tight">Configurações</h1>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : saveSuccess ? (
                <>
                  <ShieldCheck className="mr-2 h-4 w-4" />
                  Salvo!
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Salvar alterações
                </>
              )}
            </Button>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid grid-cols-3 lg:grid-cols-6">
              <TabsTrigger value="conta" onClick={() => setActiveTab('conta')}>
                <User className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Conta</span>
              </TabsTrigger>
              <TabsTrigger value="aparencia" onClick={() => setActiveTab('aparencia')}>
                <Eye className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Aparência</span>
              </TabsTrigger>
              <TabsTrigger value="mapa" onClick={() => setActiveTab('mapa')}>
                <MapPin className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Mapa e GPS</span>
              </TabsTrigger>
              <TabsTrigger value="sincronizacao" onClick={() => setActiveTab('sincronizacao')}>
                <Database className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Sincronização</span>
              </TabsTrigger>
              <TabsTrigger value="notificacoes" onClick={() => setActiveTab('notificacoes')}>
                <BellRing className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Notificações</span>
              </TabsTrigger>
              <TabsTrigger value="privacidade" onClick={() => setActiveTab('privacidade')}>
                <Lock className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Privacidade</span>
              </TabsTrigger>
            </TabsList>
            
            {/* Tab Conta */}
            <TabsContent value="conta">
              <Card>
                <CardHeader>
                  <CardTitle>Configurações de Conta</CardTitle>
                  <CardDescription>
                    Gerencie suas informações pessoais e preferências de conta
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row gap-4 items-center mb-4">
                      <div className="relative">
                        <div className="h-24 w-24 rounded-full bg-neutral-200 flex items-center justify-center overflow-hidden border-4 border-white shadow-sm">
                          {settings.account.photoUrl ? (
                            <img 
                              src={settings.account.photoUrl} 
                              alt={settings.account.name} 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <User className="h-12 w-12 text-neutral-400" />
                          )}
                        </div>
                        <Button variant="secondary" size="icon" className="absolute bottom-0 right-0 h-8 w-8 rounded-full">
                          <Upload className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="space-y-2 flex-1">
                        <h3 className="font-medium">Foto de perfil</h3>
                        <p className="text-sm text-muted-foreground">
                          Esta foto será exibida em seu perfil e em suas atividades
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <Button variant="outline" size="sm">Alterar foto</Button>
                          <Button variant="ghost" size="sm">Remover</Button>
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nome completo</Label>
                        <Input 
                          id="name" 
                          value={settings.account.name}
                          onChange={(e) => setSettings({
                            ...settings,
                            account: { ...settings.account, name: e.target.value }
                          })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input 
                          id="email" 
                          type="email" 
                          value={settings.account.email}
                          onChange={(e) => setSettings({
                            ...settings,
                            account: { ...settings.account, email: e.target.value }
                          })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Telefone</Label>
                        <Input 
                          id="phone" 
                          value={settings.account.phone}
                          onChange={(e) => setSettings({
                            ...settings,
                            account: { ...settings.account, phone: e.target.value }
                          })}
                        />
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-4">
                      <h3 className="text-sm font-medium">Segurança</h3>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Autenticação de dois fatores</Label>
                          <p className="text-sm text-muted-foreground">
                            Adiciona uma camada extra de segurança à sua conta
                          </p>
                        </div>
                        <Switch 
                          checked={settings.account.twoFactorEnabled}
                          onCheckedChange={(checked) => setSettings({
                            ...settings,
                            account: { ...settings.account, twoFactorEnabled: checked }
                          })}
                        />
                      </div>
                      
                      <Button variant="outline">Alterar senha</Button>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Receber emails importantes</Label>
                          <p className="text-sm text-muted-foreground">
                            Relatórios, alertas de segurança e alterações de conta
                          </p>
                        </div>
                        <Switch 
                          checked={settings.account.receiveEmails}
                          onCheckedChange={(checked) => setSettings({
                            ...settings,
                            account: { ...settings.account, receiveEmails: checked }
                          })}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Tab Aparência */}
            <TabsContent value="aparencia">
              <Card>
                <CardHeader>
                  <CardTitle>Aparência e Tema</CardTitle>
                  <CardDescription>
                    Personalize a aparência do aplicativo conforme sua preferência
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Tema</Label>
                      <div className="grid grid-cols-3 gap-2">
                        <Button 
                          variant={settings.appearance.theme === 'light' ? "default" : "outline"}
                          className="flex flex-col items-center justify-center h-20"
                          onClick={() => setSettings({
                            ...settings,
                            appearance: { ...settings.appearance, theme: 'light' }
                          })}
                        >
                          <Sun className="h-8 w-8 mb-1" />
                          <span>Claro</span>
                        </Button>
                        <Button 
                          variant={settings.appearance.theme === 'dark' ? "default" : "outline"}
                          className="flex flex-col items-center justify-center h-20"
                          onClick={() => setSettings({
                            ...settings,
                            appearance: { ...settings.appearance, theme: 'dark' }
                          })}
                        >
                          <Moon className="h-8 w-8 mb-1" />
                          <span>Escuro</span>
                        </Button>
                        <Button 
                          variant={settings.appearance.theme === 'system' ? "default" : "outline"}
                          className="flex flex-col items-center justify-center h-20"
                          onClick={() => setSettings({
                            ...settings,
                            appearance: { ...settings.appearance, theme: 'system' }
                          })}
                        >
                          <Laptop className="h-8 w-8 mb-1" />
                          <span>Sistema</span>
                        </Button>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-2">
                      <Label>Tamanho da fonte</Label>
                      <Select 
                        value={settings.appearance.fontSize}
                        onValueChange={(value) => setSettings({
                          ...settings,
                          appearance: { ...settings.appearance, fontSize: value as any }
                        })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tamanho da fonte" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="small">Pequeno</SelectItem>
                          <SelectItem value="medium">Médio (Padrão)</SelectItem>
                          <SelectItem value="large">Grande</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Idioma</Label>
                      <Select 
                        value={settings.appearance.language}
                        onValueChange={(value) => setSettings({
                          ...settings,
                          appearance: { ...settings.appearance, language: value }
                        })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o idioma" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                          <SelectItem value="en-US">English (US)</SelectItem>
                          <SelectItem value="es">Español</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Modo compacto</Label>
                        <p className="text-sm text-muted-foreground">
                          Reduz o espaçamento entre elementos para mostrar mais conteúdo
                        </p>
                      </div>
                      <Switch 
                        checked={settings.appearance.compactMode}
                        onCheckedChange={(checked) => setSettings({
                          ...settings,
                          appearance: { ...settings.appearance, compactMode: checked }
                        })}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Reduzir animações</Label>
                        <p className="text-sm text-muted-foreground">
                          Minimiza efeitos animados para melhorar o desempenho
                        </p>
                      </div>
                      <Switch 
                        checked={settings.appearance.reduceAnimations}
                        onCheckedChange={(checked) => setSettings({
                          ...settings,
                          appearance: { ...settings.appearance, reduceAnimations: checked }
                        })}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Tab Mapa e GPS */}
            <TabsContent value="mapa">
              <Card>
                <CardHeader>
                  <CardTitle>Configurações de Mapa e GPS</CardTitle>
                  <CardDescription>
                    Configure o comportamento dos mapas e da geolocalização
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Provedor de mapas</Label>
                      <Select 
                        value={settings.map.mapProvider}
                        onValueChange={(value) => setSettings({
                          ...settings,
                          map: { ...settings.map, mapProvider: value }
                        })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o provedor de mapas" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="osm">OpenStreetMap</SelectItem>
                          <SelectItem value="google">Google Maps</SelectItem>
                          <SelectItem value="here">Here Maps</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Zoom padrão ({settings.map.defaultZoom})</Label>
                      </div>
                      <Slider 
                        min={5} 
                        max={18} 
                        step={1} 
                        value={[settings.map.defaultZoom]}
                        onValueChange={(value) => setSettings({
                          ...settings,
                          map: { ...settings.map, defaultZoom: value[0] }
                        })}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Cidade</span>
                        <span>Bairro</span>
                        <span>Rua</span>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>GPS de alta precisão</Label>
                        <p className="text-sm text-muted-foreground">
                          Utiliza GPS, WiFi e redes móveis para maior precisão (aumenta consumo de bateria)
                        </p>
                      </div>
                      <Switch 
                        checked={settings.map.highAccuracyGPS}
                        onCheckedChange={(checked) => setSettings({
                          ...settings,
                          map: { ...settings.map, highAccuracyGPS: checked }
                        })}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Exibir informações de trânsito</Label>
                        <p className="text-sm text-muted-foreground">
                          Mostra condições de tráfego em tempo real no mapa
                        </p>
                      </div>
                      <Switch 
                        checked={settings.map.showTraffic}
                        onCheckedChange={(checked) => setSettings({
                          ...settings,
                          map: { ...settings.map, showTraffic: checked }
                        })}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Roteamento automático</Label>
                        <p className="text-sm text-muted-foreground">
                          Calcular rotas automaticamente entre visitas agendadas
                        </p>
                      </div>
                      <Switch 
                        checked={settings.map.autoRouting}
                        onCheckedChange={(checked) => setSettings({
                          ...settings,
                          map: { ...settings.map, autoRouting: checked }
                        })}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Tab Sincronização */}
            <TabsContent value="sincronizacao">
              <Card>
                <CardHeader>
                  <CardTitle>Sincronização e Dados</CardTitle>
                  <CardDescription>
                    Configure como seus dados são sincronizados entre dispositivos e com o servidor
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Intervalo de sincronização ({settings.sync.syncInterval} minutos)</Label>
                      </div>
                      <Slider 
                        min={5} 
                        max={60} 
                        step={5} 
                        value={[settings.sync.syncInterval]}
                        onValueChange={(value) => setSettings({
                          ...settings,
                          sync: { ...settings.sync, syncInterval: value[0] }
                        })}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Frequente</span>
                        <span>Equilibrado</span>
                        <span>Econômico</span>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Sincronizar apenas via Wi-Fi</Label>
                        <p className="text-sm text-muted-foreground">
                          Evita uso de dados móveis para sincronização
                        </p>
                      </div>
                      <Switch 
                        checked={settings.sync.syncOnlyWifi}
                        onCheckedChange={(checked) => setSettings({
                          ...settings,
                          sync: { ...settings.sync, syncOnlyWifi: checked }
                        })}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Sincronizar fotos em segundo plano</Label>
                        <p className="text-sm text-muted-foreground">
                          Envia fotos quando o dispositivo estiver ocioso ou carregando
                        </p>
                      </div>
                      <Switch 
                        checked={settings.sync.syncPhotosWhenIdle}
                        onCheckedChange={(checked) => setSettings({
                          ...settings,
                          sync: { ...settings.sync, syncPhotosWhenIdle: checked }
                        })}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Comprimir fotos antes de enviar</Label>
                        <p className="text-sm text-muted-foreground">
                          Reduz o uso de banda e acelera o envio (menor qualidade)
                        </p>
                      </div>
                      <Switch 
                        checked={settings.sync.compressPhotos}
                        onCheckedChange={(checked) => setSettings({
                          ...settings,
                          sync: { ...settings.sync, compressPhotos: checked }
                        })}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Modo offline</Label>
                        <p className="text-sm text-muted-foreground">
                          Desativa todas as sincronizações com o servidor
                        </p>
                      </div>
                      <Switch 
                        checked={settings.sync.offlineMode}
                        onCheckedChange={(checked) => setSettings({
                          ...settings,
                          sync: { ...settings.sync, offlineMode: checked }
                        })}
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex gap-2 flex-wrap">
                      <Button variant="outline" onClick={() => {
                        toast({
                          title: "Sincronização iniciada",
                          description: "Seus dados estão sendo sincronizados com o servidor.",
                        });
                      }}>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Sincronizar agora
                      </Button>
                      
                      <Button variant="outline" className="text-destructive" onClick={() => {
                        if (confirm("Esta ação apagará todos os dados locais. Os dados salvos no servidor não serão afetados. Deseja continuar?")) {
                          toast({
                            title: "Dados locais apagados",
                            description: "Todos os dados foram removidos deste dispositivo.",
                          });
                        }
                      }}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Limpar dados locais
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Tab Notificações */}
            <TabsContent value="notificacoes">
              <Card>
                <CardHeader>
                  <CardTitle>Notificações</CardTitle>
                  <CardDescription>
                    Configure como e quando deseja receber notificações
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="push-notifications">Notificações push</Label>
                      <p className="text-sm text-muted-foreground">
                        Habilitar notificações no dispositivo
                      </p>
                    </div>
                    <Switch 
                      id="push-notifications"
                      checked={settings.notifications.enablePush}
                      onCheckedChange={(checked) => setSettings({
                        ...settings,
                        notifications: { ...settings.notifications, enablePush: checked }
                      })}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Tipos de notificações</h3>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Lembretes de visitas</Label>
                        <p className="text-sm text-muted-foreground">
                          Visitas agendadas para hoje e amanhã
                        </p>
                      </div>
                      <Switch 
                        checked={settings.notifications.notifyVisitReminders}
                        onCheckedChange={(checked) => setSettings({
                          ...settings,
                          notifications: { ...settings.notifications, notifyVisitReminders: checked }
                        })}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Atualizações de relatórios</Label>
                        <p className="text-sm text-muted-foreground">
                          Quando um relatório for aprovado ou precisar de revisão
                        </p>
                      </div>
                      <Switch 
                        checked={settings.notifications.notifyReportUpdates}
                        onCheckedChange={(checked) => setSettings({
                          ...settings,
                          notifications: { ...settings.notifications, notifyReportUpdates: checked }
                        })}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Atualizações do sistema</Label>
                        <p className="text-sm text-muted-foreground">
                          Novas versões e funcionalidades do aplicativo
                        </p>
                      </div>
                      <Switch 
                        checked={settings.notifications.notifySystemUpdates}
                        onCheckedChange={(checked) => setSettings({
                          ...settings,
                          notifications: { ...settings.notifications, notifySystemUpdates: checked }
                        })}
                      />
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Preferências de alerta</h3>
                    
                    <div className="flex items-center justify-between">
                      <Label>Som de notificação</Label>
                      <Switch 
                        checked={settings.notifications.soundEnabled}
                        onCheckedChange={(checked) => setSettings({
                          ...settings,
                          notifications: { ...settings.notifications, soundEnabled: checked }
                        })}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label>Vibração</Label>
                      <Switch 
                        checked={settings.notifications.vibrationEnabled}
                        onCheckedChange={(checked) => setSettings({
                          ...settings,
                          notifications: { ...settings.notifications, vibrationEnabled: checked }
                        })}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Não perturbe</Label>
                        <p className="text-sm text-muted-foreground">
                          Silenciar notificações em horários específicos
                        </p>
                      </div>
                      <Switch 
                        checked={settings.notifications.doNotDisturb}
                        onCheckedChange={(checked) => setSettings({
                          ...settings,
                          notifications: { ...settings.notifications, doNotDisturb: checked }
                        })}
                      />
                    </div>
                    
                    {settings.notifications.doNotDisturb && (
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Início</Label>
                          <Input 
                            type="time" 
                            value={settings.notifications.doNotDisturbStart}
                            onChange={(e) => setSettings({
                              ...settings,
                              notifications: { ...settings.notifications, doNotDisturbStart: e.target.value }
                            })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Fim</Label>
                          <Input 
                            type="time" 
                            value={settings.notifications.doNotDisturbEnd}
                            onChange={(e) => setSettings({
                              ...settings,
                              notifications: { ...settings.notifications, doNotDisturbEnd: e.target.value }
                            })}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium">Notificações recentes</h3>
                      
                      {notifications.some(n => !n.read) && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={markAllNotificationsAsRead}
                          className="h-8"
                        >
                          Marcar todas como lidas
                        </Button>
                      )}
                    </div>
                    
                    {notifications.length === 0 ? (
                      <div className="text-center py-6 text-muted-foreground">
                        <p>Nenhuma notificação no momento</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {notifications.map((notification) => (
                          <div 
                            key={notification.id} 
                            className={cn(
                              "flex items-start p-3 rounded-lg border",
                              notification.read ? "bg-card" : "bg-muted/30 border-primary/20"
                            )}
                          >
                            <div className="mr-3 mt-0.5">
                              {getNotificationIcon(notification.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between">
                                <p className={cn(
                                  "text-sm font-medium",
                                  !notification.read && "font-semibold"
                                )}>
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
                              <p className="text-sm text-muted-foreground mt-1">
                                {notification.message}
                              </p>
                              <div className="flex items-center justify-between mt-2">
                                <span className="text-xs text-muted-foreground">
                                  {format(new Date(notification.date), "dd 'de' MMMM, HH:mm", { locale: ptBR })}
                                </span>
                                {!notification.read && (
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="h-7 text-xs"
                                    onClick={() => markNotificationAsRead(notification.id)}
                                  >
                                    Marcar como lida
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Tab Privacidade */}
            <TabsContent value="privacidade">
              <Card>
                <CardHeader>
                  <CardTitle>Privacidade e Segurança</CardTitle>
                  <CardDescription>
                    Gerencie suas configurações de privacidade e segurança de dados
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Compartilhar localização com equipe</Label>
                        <p className="text-sm text-muted-foreground">
                          Permite que gerentes vejam sua localização durante o horário de trabalho
                        </p>
                      </div>
                      <Switch 
                        checked={settings.privacy.shareLocationWithTeam}
                        onCheckedChange={(checked) => setSettings({
                          ...settings,
                          privacy: { ...settings.privacy, shareLocationWithTeam: checked }
                        })}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Compartilhar dados de uso anônimos</Label>
                        <p className="text-sm text-muted-foreground">
                          Ajuda a melhorar o aplicativo enviando dados anônimos de uso
                        </p>
                      </div>
                      <Switch 
                        checked={settings.privacy.shareAnalytics}
                        onCheckedChange={(checked) => setSettings({
                          ...settings,
                          privacy: { ...settings.privacy, shareAnalytics: checked }
                        })}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Salvar histórico de pesquisa</Label>
                        <p className="text-sm text-muted-foreground">
                          Melhora sugestões salvando suas pesquisas recentes
                        </p>
                      </div>
                      <Switch 
                        checked={settings.privacy.saveSearchHistory}
                        onCheckedChange={(checked) => setSettings({
                          ...settings,
                          privacy: { ...settings.privacy, saveSearchHistory: checked }
                        })}
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-2">
                      <Button variant="outline" className="w-full justify-start" asChild>
                        <a href="/politica-privacidade" target="_blank">
                          <Shield className="mr-2 h-4 w-4" />
                          Política de Privacidade
                        </a>
                      </Button>
                      
                      <Button variant="outline" className="w-full justify-start" asChild>
                        <a href="/termos-de-uso" target="_blank">
                          <FileText className="mr-2 h-4 w-4" />
                          Termos de Uso
                        </a>
                      </Button>
                      
                      <Button variant="outline" className="w-full justify-start text-red-600" onClick={() => {
                        if (confirm("Tem certeza que deseja excluir todos os seus dados? Esta ação não pode ser desfeita.")) {
                          toast({
                            title: "Solicitação enviada",
                            description: "Sua solicitação de exclusão de dados foi recebida e está sendo processada.",
                          });
                        }
                      }}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Solicitar exclusão dos meus dados
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </DashboardLayoutNew>
    </PageTransition>
  );
}