import React, { useState, useEffect } from 'react';
import { DashboardLayoutNew } from '../layouts/DashboardLayoutNew';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { db } from '../lib/db';
import { useVisits } from '../hooks/useVisits';
import { PageTransition, LoadingAnimation } from '@/components/ui/loading-animation';
import { Chart } from '@/components/ui/chart';
import { 
  Calendar, Clock, User, MapPin, CheckCircle, AlertCircle, Clock3,
  CloudSun, FileText, Settings, PlusCircle, BarChart2, Layers,
  Grid, List
} from 'lucide-react';
import { Users, ClipboardList, Droplets, ChevronRight, RefreshCw } from "lucide-react";
import { formatDate, cn } from '@/lib/utils';
import { Link } from 'wouter';
import { DashboardCustomizationModal, DashboardConfig } from '@/components/dashboard/DashboardCustomizationModal';
import { useToast } from '@/hooks/use-toast';

export default function DashboardPage() {
  const { visits, isLoading } = useVisits();
  const { toast } = useToast();
  const [stats, setStats] = useState({
    completed: 0,
    scheduled: 0,
    pending: 0,
    inProgress: 0
  });
  const [weeklyVisits, setWeeklyVisits] = useState<{day: string, count: number}[]>([]);
  const [today] = useState(new Date());
  const [activeTab, setActiveTab] = useState("visitas");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Definição da configuração padrão de widgets
  const defaultConfig: DashboardConfig = {
    visibleWidgets: {
      'resumo': true,
      'proxima_visita': true,
      'acoes_rapidas': true,
      'visitas_agendadas': true,
      'grafico_semanal': true,
      'rota_dia': true,
      'clima': true,
      'motivationWidget': true,
      'performanceChart': true,
    },
    widgetOrder: [
      'resumo',
      'proxima_visita',
      'acoes_rapidas',
      'visitas_agendadas',
      'grafico_semanal',
      'rota_dia',
      'clima',
      'motivationWidget',
      'performanceChart'
    ],
    layout: 'comfort' as 'compact' | 'comfort' | 'spacious',
    columns: 2
  };
  
  // Função para inicializar e verificar a configuração
  const initializeConfig = (): DashboardConfig => {
    console.log('Inicializando configuração do dashboard');
    
    try {
      // Tentar carregar do localStorage
      const savedConfig = localStorage.getItem('dashboard_config');
      
      if (savedConfig) {
        console.log('Configuração salva encontrada');
        
        try {
          const parsedConfig = JSON.parse(savedConfig);
          
          // Verificar se a estrutura básica existe
          if (!parsedConfig.visibleWidgets || !parsedConfig.widgetOrder) {
            console.warn('Configuração incompleta, usando padrão');
            return defaultConfig;
          }
          
          // Verificar se todos os widgets estão representados na ordem
          const allWidgets = Object.keys(defaultConfig.visibleWidgets);
          const missingWidgets = allWidgets.filter(
            widgetId => !parsedConfig.widgetOrder.includes(widgetId)
          );
          
          // Se faltam widgets na ordem, restaurar para o padrão
          if (missingWidgets.length > 0) {
            console.warn(`Widgets faltando na ordem: ${missingWidgets.join(', ')}`);
            
            // Adicionar widgets faltantes no final da lista de ordem
            const updatedConfig = {
              ...parsedConfig,
              widgetOrder: [...parsedConfig.widgetOrder, ...missingWidgets]
            };
            
            // Atualizar localStorage com a configuração corrigida
            localStorage.setItem('dashboard_config', JSON.stringify(updatedConfig));
            console.log('Configuração corrigida e salva');
            
            return updatedConfig;
          }
          
          console.log('Configuração carregada com sucesso:', parsedConfig);
          return parsedConfig;
        } catch (error) {
          console.error('Erro ao analisar configuração salva:', error);
          return defaultConfig;
        }
      }
      
      console.log('Nenhuma configuração encontrada, usando padrão');
      return defaultConfig;
    } catch (error) {
      console.error('Erro ao inicializar configuração:', error);
      return defaultConfig;
    }
  };
  
  // Configuração inicial dos widgets do dashboard
  const [dashboardConfig, setDashboardConfig] = useState<DashboardConfig>(initializeConfig());
  
  // Effect para logging da ordem dos widgets
  useEffect(() => {
    console.log('Ordem de widgets atual:', dashboardConfig.widgetOrder);
  }, [dashboardConfig.widgetOrder]);

  // Processar estatísticas quando os dados de visitas mudarem
  useEffect(() => {
    if (!isLoading && visits) {
      const statusCounts = {
        completed: visits.filter(v => v.status === 'completed').length,
        scheduled: visits.filter(v => v.status === 'scheduled').length,
        pending: visits.filter(v => v.status === 'pending').length,
        inProgress: visits.filter(v => v.status === 'in-progress').length
      };
      setStats(statusCounts);

      // Criar dados para o gráfico semanal
      const daysOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
      const currentDay = today.getDay();
      
      // Preparar dados dos últimos 7 dias
      const weekData = [];
      for (let i = 6; i >= 0; i--) {
        const dayIndex = (currentDay - i + 7) % 7;
        const dayName = daysOfWeek[dayIndex];
        
        // Data para comparação (últimos 7 dias)
        const compareDate = new Date(today);
        compareDate.setDate(today.getDate() - i);
        const compareString = formatDate(compareDate, 'yyyy-MM-dd');
        
        // Contar visitas deste dia
        const dayVisits = visits.filter(v => {
          const visitDate = v.date.split('T')[0];
          return visitDate === compareString;
        }).length;
        
        weekData.push({ day: dayName, count: dayVisits });
      }
      setWeeklyVisits(weekData);
    }
  }, [visits, isLoading, today]);

  // Obter as visitas de hoje
  const getVisitasHoje = () => {
    if (!visits || visits.length === 0) return [];
    
    const todayStr = formatDate(today, 'yyyy-MM-dd');
    return visits
      .filter(v => {
        const visitDate = v.date.split('T')[0];
        return visitDate === todayStr;
      })
      .sort((a, b) => {
        const timeA = a.time || '23:59';
        const timeB = b.time || '23:59';
        return timeA.localeCompare(timeB);
      });
  };

  // Obter a próxima visita agendada
  const getNextVisit = () => {
    if (!visits || visits.length === 0) return null;
    
    const scheduledVisits = visits.filter(v => 
      v.status === 'scheduled' || v.status === 'in-progress'
    );
    
    if (scheduledVisits.length === 0) return null;
    
    // Ordenar por data
    return scheduledVisits.sort((a, b) => {
      const dateA = new Date(a.date + (a.time ? ` ${a.time}` : '')).getTime();
      const dateB = new Date(b.date + (b.time ? ` ${b.time}` : '')).getTime();
      return dateA - dateB;
    })[0];
  };

  const nextVisit = getNextVisit();
  const visitasHoje = getVisitasHoje();

  // Função para salvar configurações
  const handleConfigChange = (newConfig: DashboardConfig) => {
    console.log('Recebendo configurações no Dashboard:', newConfig);
    
    // Validar se o objeto contém a estrutura correta
    if (!newConfig.visibleWidgets || Object.keys(newConfig.visibleWidgets).length === 0) {
      console.warn('Configurações recebidas não possuem visibleWidgets válido!');
      return;
    }
    
    // Verificar se widgetOrder existe
    if (!newConfig.widgetOrder || newConfig.widgetOrder.length === 0) {
      console.warn('Ordem de widgets não definida, usando ordem padrão');
      
      // Definir ordem padrão se não existir
      newConfig.widgetOrder = [
        'resumo',
        'proxima_visita',
        'acoes_rapidas',
        'visitas_agendadas',
        'grafico_semanal',
        'rota_dia',
        'clima',
        'motivationWidget',
        'performanceChart'
      ];
    }
    
    // Manter o viewMode independente do layout para não conflitar tipos
    // Podemos usar o layout para ajustar espaçamento, mas não alterar visualização grid/list
    
    console.log('Configuração final a ser aplicada:', newConfig);
    
    // Atualizar o estado com as novas configurações
    setDashboardConfig(prev => ({
      ...prev,
      ...newConfig,
      // Garantir que essas propriedades existam
      visibleWidgets: {
        ...prev.visibleWidgets,
        ...newConfig.visibleWidgets
      },
      widgetOrder: [...newConfig.widgetOrder]
    }));
    
    // Salvar no localStorage com um try/catch para segurança
    try {
      localStorage.setItem('dashboard_config', JSON.stringify(newConfig));
      console.log('Configurações salvas com sucesso no localStorage');
      
      toast({
        title: "Dashboard personalizado",
        description: "Suas preferências foram salvas com sucesso",
      });
    } catch (error) {
      console.error('Erro ao salvar configurações no localStorage:', error);
      
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar suas preferências. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  // Verifica se um widget está habilitado
  const isWidgetEnabled = (widgetId: string): boolean => {
    // Verificação segura com fallback para evitar erros
    return !!(dashboardConfig?.visibleWidgets && dashboardConfig.visibleWidgets[widgetId]);
  };

  if (isLoading) {
    return (
      <DashboardLayoutNew>
        <div className="flex h-[80vh] items-center justify-center">
          <LoadingAnimation text="Carregando seu dashboard..." />
        </div>
      </DashboardLayoutNew>
    );
  }

  // Função para renderizar um widget específico com base no ID
  const renderWidget = (widgetId: string) => {
    switch (widgetId) {
      case 'resumo':
        return isWidgetEnabled('resumo') && (
          <Card key="resumo" className="border-blue-200">
            <CardHeader className="bg-blue-50 pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center text-blue-800 whitespace-nowrap">
                  <Calendar className="h-5 w-5 mr-2 flex-shrink-0" />
                  Visitas de Hoje
                </CardTitle>
                <Link href="/visitas">
                  <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800">
                    Ver Todas <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </Link>
              </div>
              <CardDescription>
                {formatDate(today, 'dd/MM/yyyy')}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              {visitasHoje.length === 0 ? (
                <div className="bg-gray-50 border border-gray-100 rounded-md p-4 text-center">
                  <p className="text-gray-500">Nenhuma visita agendada para hoje</p>
                  <Link href="/nova-visita">
                    <Button variant="outline" size="sm" className="mt-2">
                      <PlusCircle className="h-4 w-4 mr-2" /> Agendar Visita
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {visitasHoje.map((visit) => (
                    <Link key={visit.id} href={`/visitas/${visit.id}`}>
                      <div className="border rounded-md p-3 cursor-pointer hover:bg-gray-50 transition">
                        <div className="flex justify-between">
                          <h3 className="font-medium">{visit.clientName}</h3>
                          <span className={`text-xs px-2 py-1 rounded ${
                            visit.status === 'completed' ? 'bg-green-100 text-green-800' :
                            visit.status === 'in-progress' ? 'bg-amber-100 text-amber-800' :
                            visit.status === 'pending' ? 'bg-purple-100 text-purple-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {visit.status === 'completed' ? 'Concluída' :
                             visit.status === 'in-progress' ? 'Em Andamento' :
                             visit.status === 'pending' ? 'Pendente' :
                             'Agendada'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                          <Clock className="h-3 w-3" />
                          <span>{visit.time || 'Horário não definido'}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                          <MapPin className="h-3 w-3" />
                          <span className="truncate">{visit.address}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        );
        
      case 'proxima_visita':
        return isWidgetEnabled('proxima_visita') && nextVisit && (
          <Card key="proxima_visita" className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <Calendar className="mr-2 h-5 w-5" />
                Próxima Visita
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold">{nextVisit.clientName}</h3>
                  <p className="text-blue-100 mt-1 flex items-center">
                    <MapPin className="h-3 w-3 mr-1" />
                    {nextVisit.address}
                  </p>
                </div>
                <div className="bg-white/10 p-3 rounded-md">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>{formatDate(new Date(nextVisit.date), 'dd/MM/yyyy')}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>{nextVisit.time || 'Não definido'}</span>
                    </div>
                  </div>
                </div>
                <Link href={`/visitas/${nextVisit.id}`}>
                  <Button className="w-full bg-white text-blue-700 hover:bg-blue-50">
                    Ver Detalhes
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        );
        
      case 'acoes_rapidas':
        return isWidgetEnabled('acoes_rapidas') && (
          <Card key="acoes_rapidas">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <FileText className="mr-2 h-5 w-5" />
                Ações Rápidas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <Link href="/relatorio-vistoria">
                  <Button className="w-full bg-primary hover:bg-primary/90 h-auto py-3">
                    <FileText className="mr-2 h-4 w-4" /> 
                    <div className="flex flex-col items-start">
                      <span>Nova Vistoria</span>
                    </div>
                  </Button>
                </Link>
                <Link href="/rotas">
                  <Button className="w-full bg-green-600 hover:bg-green-700 h-auto py-3">
                    <MapPin className="mr-2 h-4 w-4" /> 
                    <div className="flex flex-col items-start">
                      <span>Ver Rota</span>
                    </div>
                  </Button>
                </Link>
                <Link href="/clientes">
                  <Button className="w-full" variant="outline">
                    <Users className="mr-2 h-4 w-4" /> Clientes
                  </Button>
                </Link>
                <Link href="/relatorios">
                  <Button className="w-full" variant="outline">
                    <ClipboardList className="mr-2 h-4 w-4" /> Relatórios
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        );
        
      case 'visitas_agendadas':
        return isWidgetEnabled('visitas_agendadas') && (
          <div key="visitas_agendadas" className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-blue-50 border-blue-200 h-[130px]">
              <CardHeader className="py-3">
                <CardTitle className="text-blue-800 text-sm flex items-center gap-2">
                  <Clock className="h-5 w-5 flex-shrink-0" />
                  <span className="whitespace-nowrap">Agendadas</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-700">{stats.scheduled}</div>
              </CardContent>
            </Card>
            
            <Card className="bg-amber-50 border-amber-200 h-[130px]">
              <CardHeader className="py-3">
                <CardTitle className="text-amber-800 text-sm flex items-center gap-2">
                  <Clock3 className="h-5 w-5 flex-shrink-0" />
                  <span className="text-sm whitespace-nowrap">Em Andamento</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-amber-700">{stats.inProgress}</div>
              </CardContent>
            </Card>
            
            <Card className="bg-purple-50 border-purple-200 h-[130px]">
              <CardHeader className="py-3">
                <CardTitle className="text-purple-800 text-sm flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 flex-shrink-0" />
                  <span className="whitespace-nowrap">Pendentes</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-700">{stats.pending}</div>
              </CardContent>
            </Card>
            
            <Card className="bg-green-50 border-green-200 h-[130px]">
              <CardHeader className="py-3">
                <CardTitle className="text-green-800 text-sm flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 flex-shrink-0" />
                  <span className="whitespace-nowrap">Concluídas</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-700">{stats.completed}</div>
              </CardContent>
            </Card>
          </div>
        );
        
      case 'grafico_semanal':
        return isWidgetEnabled('grafico_semanal') && (
          <Card key="grafico_semanal">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart2 className="h-5 w-5 mr-2" />
                Visitas por dia da semana
              </CardTitle>
              <CardDescription>
                Últimos 7 dias
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Chart
                type="bar"
                height={200}
                data={weeklyVisits}
                xAxis={{
                  dataKey: "day",
                }}
                series={[
                  {
                    dataKey: "count",
                    name: "Visitas",
                    color: "#3b82f6",
                  },
                ]}
              />
            </CardContent>
          </Card>
        );
        
      // Adicionar casos para outros widgets conforme necessário
      default:
        return null;
    }
  };

  return (
    <PageTransition>
      <DashboardLayoutNew>
        <div className={cn(
          "space-y-6",
          dashboardConfig?.layout === 'compact' && "space-y-3"
        )}>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold tracking-tight hidden sm:block">Dashboard</h1>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500">
                {formatDate(today, 'dd/MM/yyyy')}
              </span>
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                  className="h-8 w-8"
                >
                  {viewMode === 'grid' ? (
                    <List className="h-4 w-4" />
                  ) : (
                    <Grid className="h-4 w-4" />
                  )}
                </Button>
                <DashboardCustomizationModal
                  config={dashboardConfig}
                  onConfigChange={handleConfigChange}
                >
                  <Button
                    variant="outline"
                    size="sm"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Personalizar
                  </Button>
                </DashboardCustomizationModal>
              </div>
            </div>
          </div>

          {/* Renderizar widgets na ordem definida pelo usuário */}
          {dashboardConfig.widgetOrder && dashboardConfig.widgetOrder.length > 0 ? (
            <>
              {dashboardConfig.widgetOrder
                .filter(widgetId => isWidgetEnabled(widgetId))
                .map((widgetId, index) => {
                  // Widget component
                  const widget = renderWidget(widgetId);
                  // Só renderizar se retornar um componente válido
                  return widget ? React.cloneElement(widget as React.ReactElement, { key: `widget-${widgetId}-${index}` }) : null;
                })}
            </>
          ) : (
            <div className="p-4 border border-red-300 bg-red-50 rounded-md">
              <p className="text-red-700">Erro na configuração do dashboard. Por favor, reinicie as configurações.</p>
            </div>
          )}
          
          {/* Conteúdo principal */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Coluna principal - os widgets acima já foram renderizados na ordem definida */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Tabs para diferentes visões */}
              <Tabs defaultValue="agendado" className="w-full">
                <TabsList className="grid grid-cols-4 mb-4">
                  <TabsTrigger value="agendado" className="px-1 text-xs sm:text-sm whitespace-nowrap">Agendado</TabsTrigger>
                  <TabsTrigger value="andamento" className="px-1 text-xs sm:text-sm whitespace-nowrap">Em Andamento</TabsTrigger>
                  <TabsTrigger value="pendente" className="px-1 text-xs sm:text-sm whitespace-nowrap">Pendente</TabsTrigger>
                  <TabsTrigger value="concluido" className="px-1 text-xs sm:text-sm whitespace-nowrap">Concluído</TabsTrigger>
                </TabsList>
                
                <TabsContent value="agendado">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm text-blue-600">Próximas visitas agendadas</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {visits.filter(v => v.status === 'scheduled').length === 0 ? (
                        <div className="text-center py-4 text-gray-500">
                          Nenhuma visita agendada
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {visits.filter(v => v.status === 'scheduled')
                            .sort((a, b) => {
                              const dateA = new Date(a.date).getTime();
                              const dateB = new Date(b.date).getTime();
                              return dateA - dateB;
                            })
                            .slice(0, 3)
                            .map(visit => (
                              <Link key={visit.id} href={`/visitas/${visit.id}`}>
                                <div className="border rounded p-2 hover:bg-gray-50">
                                  <div className="flex justify-between">
                                    <span className="font-medium">{visit.clientName}</span>
                                    <span className="text-xs">{formatDate(new Date(visit.date), 'dd/MM')}</span>
                                  </div>
                                  <div className="text-xs text-gray-500 mt-1">{visit.address}</div>
                                </div>
                              </Link>
                            ))
                          }
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="andamento">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm text-amber-600">Visitas em andamento</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {visits.filter(v => v.status === 'in-progress').length === 0 ? (
                        <div className="text-center py-4 text-gray-500">
                          Nenhuma visita em andamento
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {visits.filter(v => v.status === 'in-progress')
                            .slice(0, 3)
                            .map(visit => (
                              <Link key={visit.id} href={`/visitas/${visit.id}`}>
                                <div className="border rounded p-2 hover:bg-gray-50">
                                  <div className="flex justify-between">
                                    <span className="font-medium">{visit.clientName}</span>
                                    <span className="text-xs">{formatDate(new Date(visit.date), 'dd/MM')}</span>
                                  </div>
                                  <div className="text-xs text-gray-500 mt-1">{visit.address}</div>
                                </div>
                              </Link>
                            ))
                          }
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="pendente">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm text-purple-600">Visitas pendentes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {visits.filter(v => v.status === 'pending').length === 0 ? (
                        <div className="text-center py-4 text-gray-500">
                          Nenhuma visita pendente
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {visits.filter(v => v.status === 'pending')
                            .slice(0, 3)
                            .map(visit => (
                              <Link key={visit.id} href={`/visitas/${visit.id}`}>
                                <div className="border rounded p-2 hover:bg-gray-50">
                                  <div className="flex justify-between">
                                    <span className="font-medium">{visit.clientName}</span>
                                    <span className="text-xs">{formatDate(new Date(visit.date), 'dd/MM')}</span>
                                  </div>
                                  <div className="text-xs text-gray-500 mt-1">{visit.address}</div>
                                </div>
                              </Link>
                            ))
                          }
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="concluido">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm text-green-600">Visitas concluídas</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {visits.filter(v => v.status === 'completed').length === 0 ? (
                        <div className="text-center py-4 text-gray-500">
                          Nenhuma visita concluída
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {visits.filter(v => v.status === 'completed')
                            .sort((a, b) => {
                              const dateA = new Date(a.completedAt || a.updatedAt).getTime();
                              const dateB = new Date(b.completedAt || b.updatedAt).getTime();
                              return dateB - dateA; // Ordenação decrescente
                            })
                            .slice(0, 3)
                            .map(visit => (
                              <Link key={visit.id} href={`/visitas/${visit.id}`}>
                                <div className="border rounded p-2 hover:bg-gray-50">
                                  <div className="flex justify-between">
                                    <span className="font-medium">{visit.clientName}</span>
                                    <span className="text-xs">{formatDate(new Date(visit.date), 'dd/MM')}</span>
                                  </div>
                                  <div className="text-xs text-gray-500 mt-1">{visit.address}</div>
                                </div>
                              </Link>
                            ))
                          }
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Coluna lateral */}
            <div className="space-y-6">
              {/* Rota do dia */}
              {isWidgetEnabled('rota_dia') && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center">
                      <MapPin className="h-5 w-5 mr-2" />
                      Rota do Dia
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pb-4">
                    <div className="bg-gray-50 rounded-md p-3 mb-3 border">
                      <div className="text-sm text-gray-600">
                        <p>Visitas agendadas: <span className="font-medium">{visitasHoje.length}</span></p>
                        <p className="mt-1">Distância estimada: <span className="font-medium">27 km</span></p>
                        <p className="mt-1">Tempo estimado: <span className="font-medium">1h 35min</span></p>
                      </div>
                    </div>
                    <Link href="/rotas">
                      <Button className="w-full">
                        <MapPin className="mr-2 h-4 w-4" /> Ver Rota Otimizada
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              )}

              {/* Informações climáticas */}
              {isWidgetEnabled('clima') && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center">
                      <CloudSun className="h-5 w-5 mr-2" />
                      Clima Hoje
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col items-center justify-center p-4">
                      <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-blue-700">
                        <CloudSun className="h-10 w-10" />
                      </div>
                      <h3 className="mt-2 font-bold">27°C</h3>
                      <p className="text-sm text-gray-500">São Leopoldo, RS</p>
                      
                      <div className="w-full mt-4 grid grid-cols-2 gap-2 text-center">
                        <div className="bg-blue-50 border border-blue-100 p-2 rounded">
                          <p className="text-sm font-medium">Manhã</p>
                          <p className="text-xs text-gray-500">Ensolarado, 25°C</p>
                        </div>
                        <div className="bg-blue-50 border border-blue-100 p-2 rounded">
                          <p className="text-sm font-medium">Tarde</p>
                          <p className="text-xs text-gray-500">Parcial, 29°C</p>
                        </div>
                      </div>
                      
                      <div className="mt-3 w-full flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center">
                          <Droplets className="h-3 w-3 mr-1 text-blue-500" />
                          <span>Umidade: 70%</span>
                        </div>
                        <div className="flex items-center">
                          <RefreshCw className="h-3 w-3 mr-1 text-green-500" />
                          <span>Vento: 10 km/h</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </DashboardLayoutNew>
    </PageTransition>
  );
}