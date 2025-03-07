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
  CloudSun, FileText, Settings, PlusCircle, BarChart2
} from 'lucide-react';
import { Users, ClipboardList, Droplets, ChevronRight, RefreshCw } from "lucide-react";
import { formatDate } from '@/lib/utils';
import { Link } from 'wouter';

export default function DashboardPage() {
  const { visits, isLoading } = useVisits();
  const [stats, setStats] = useState({
    completed: 0,
    scheduled: 0,
    pending: 0,
    inProgress: 0
  });
  const [weeklyVisits, setWeeklyVisits] = useState<{day: string, count: number}[]>([]);
  const [today] = useState(new Date());
  const [activeTab, setActiveTab] = useState("visitas");
  const [dashboardConfig, setDashboardConfig] = useState({
    showVisitasHoje: true,
    showProximaVisita: true,
    showAcoesRapidas: true,
    showVisitasAgendadas: true,
    showEmAndamento: true,
    showPendentes: true,
    showConcluidas: true,
    showVisitasSemanais: true,
    showRotaDia: true,
    showClimaHoje: true,
  });

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

  // Função para alternar configuração do dashboard
  const toggleDashboardItem = (item: keyof typeof dashboardConfig) => {
    setDashboardConfig(prev => ({
      ...prev,
      [item]: !prev[item]
    }));
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

  return (
    <PageTransition>
      <DashboardLayoutNew>
        <div className="space-y-6">
          <div className="flex items-center justify-end">
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500">
                {formatDate(today, 'dd/MM/yyyy')}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  // Abre um diálogo de personalização (simples por enquanto)
                  if (typeof window !== 'undefined') {
                    alert('Função de personalização estará disponível em breve!');
                  }
                }}
              >
                <Settings className="h-4 w-4 mr-2" />
                Personalizar
              </Button>
            </div>
          </div>

          {/* Seção principal - Visitas de Hoje */}
          {dashboardConfig.showVisitasHoje && (
            <Card className="border-blue-200">
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
          )}

          {/* Próxima Visita */}
          {dashboardConfig.showProximaVisita && nextVisit && (
            <Card className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
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
          )}

          {/* Ações Rápidas */}
          {dashboardConfig.showAcoesRapidas && (
            <Card>
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
          )}
          
          {/* Cards de estatísticas */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {dashboardConfig.showVisitasAgendadas && (
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
            )}
            
            {dashboardConfig.showEmAndamento && (
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
            )}
            
            {dashboardConfig.showPendentes && (
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
            )}
            
            {dashboardConfig.showConcluidas && (
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
            )}
          </div>

          {/* Conteúdo principal */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Coluna principal */}
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
              {dashboardConfig.showRotaDia && (
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
              {dashboardConfig.showClimaHoje && (
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
                          <span>Vento: 12 km/h</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {/* Resumo de desempenho */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center">
                    <BarChart2 className="h-5 w-5 mr-2" />
                    Seu Desempenho
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Esta semana</span>
                      <span className="text-sm font-medium">{weeklyVisits.reduce((acc, day) => acc + day.count, 0)} visitas</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ width: "85%" }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Meta: 21 visitas mensais</span>
                      <span>85% concluído</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 mt-4">
                      <div className="border rounded p-2 text-center">
                        <p className="text-xs text-gray-500">Tempo médio</p>
                        <p className="font-medium">45 min</p>
                      </div>
                      <div className="border rounded p-2 text-center">
                        <p className="text-xs text-gray-500">Satisfação</p>
                        <p className="font-medium">4.8 / 5</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </DashboardLayoutNew>
    </PageTransition>
  );
}