import React, { useState, useEffect } from 'react';
import { DashboardLayoutNew } from '../layouts/DashboardLayoutNew';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { db } from '../lib/db';
import { useVisits } from '../hooks/useVisits';
import { PageTransition } from '@/components/ui/loading-animation';
import { Chart } from '@/components/ui/chart';
import { Calendar, Clock, User, MapPin, CheckCircle, AlertCircle, Clock3, CloudSun, FileText } from 'lucide-react';
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

  return (
    <PageTransition>
      <DashboardLayoutNew>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
            <div className="flex items-center">
              <span className="text-sm text-gray-500">
                {formatDate(today, 'dd/MM/yyyy')}
              </span>
            </div>
          </div>

          {/* Cards de estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader className="py-4">
                <CardTitle className="text-blue-800 text-lg flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Visitas Agendadas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-700">{stats.scheduled}</div>
              </CardContent>
            </Card>
            
            <Card className="bg-amber-50 border-amber-200">
              <CardHeader className="py-4">
                <CardTitle className="text-amber-800 text-lg flex items-center gap-2">
                  <Clock3 className="h-5 w-5" />
                  Em Andamento
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-amber-700">{stats.inProgress}</div>
              </CardContent>
            </Card>
            
            <Card className="bg-purple-50 border-purple-200">
              <CardHeader className="py-4">
                <CardTitle className="text-purple-800 text-lg flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  Pendentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-700">{stats.pending}</div>
              </CardContent>
            </Card>
            
            <Card className="bg-green-50 border-green-200">
              <CardHeader className="py-4">
                <CardTitle className="text-green-800 text-lg flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Concluídas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-700">{stats.completed}</div>
              </CardContent>
            </Card>
          </div>

          {/* Conteúdo principal */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Gráfico semanal e próximas visitas */}
            <div className="lg:col-span-2 space-y-6">
              {/* Gráfico semanal */}
              <Card>
                <CardHeader>
                  <CardTitle>Visitas Semanais</CardTitle>
                  <CardDescription>
                    Visitas por dia nos últimos 7 dias
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Chart
                    type="bar"
                    height={300}
                    data={weeklyVisits}
                    xAxis={{
                      dataKey: "day",
                    }}
                    series={[
                      {
                        dataKey: "count",
                        name: "Visitas",
                        color: "#2563eb",
                      },
                    ]}
                    showTooltip={true}
                    showLegend={false}
                    valueFormatter={(value) => `${value} visitas`}
                  />
                </CardContent>
              </Card>

              {/* Visitas marcadas para hoje */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div>
                    <CardTitle>Visitas para Hoje</CardTitle>
                    <CardDescription>
                      {formatDate(today, 'dd/MM/yyyy')}
                    </CardDescription>
                  </div>
                  <Link href="/visitas">
                    <Button variant="outline" size="sm">
                      Ver Todas
                    </Button>
                  </Link>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex items-center justify-center h-40">
                      <p>Carregando visitas...</p>
                    </div>
                  ) : visits.filter(v => {
                      const visitDate = v.date.split('T')[0];
                      const todayStr = formatDate(today, 'yyyy-MM-dd');
                      return visitDate === todayStr;
                    }).length === 0 ? (
                    <div className="bg-gray-50 border border-gray-100 rounded-md p-4 text-center">
                      <p className="text-gray-500">Nenhuma visita agendada para hoje</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {visits
                        .filter(v => {
                          const visitDate = v.date.split('T')[0];
                          const todayStr = formatDate(today, 'yyyy-MM-dd');
                          return visitDate === todayStr;
                        })
                        .sort((a, b) => {
                          const timeA = a.time || '23:59';
                          const timeB = b.time || '23:59';
                          return timeA.localeCompare(timeB);
                        })
                        .slice(0, 3)
                        .map((visit) => (
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
            </div>

            {/* Cards laterais */}
            <div className="space-y-6">
              {/* Card de Relatório Técnico */}
              <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-white">
                    <FileText className="mr-2 h-5 w-5" />
                    Relatórios Técnicos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-blue-100">
                      Crie relatórios técnicos de vistoria para telhas e fibrocimento Brasilit.
                    </p>
                    <Link href="/vistoria-far">
                      <Button className="w-full bg-white text-blue-700 hover:bg-blue-50">
                        <FileText className="mr-2 h-4 w-4" /> Nova Inspeção
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
              
              {/* Próxima visita */}
              <Card className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
                <CardHeader>
                  <CardTitle className="flex items-center text-white">
                    <Calendar className="mr-2 h-5 w-5" />
                    Próxima Visita
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {nextVisit ? (
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
                  ) : (
                    <div className="h-24 flex items-center justify-center">
                      <p>Nenhuma visita agendada</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Informações climáticas */}
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
                  </div>
                </CardContent>
              </Card>
              
              {/* Rota do dia */}
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
                      <p>Visitas agendadas para hoje: <span className="font-medium">{stats.scheduled + stats.inProgress}</span></p>
                      <p className="mt-1">Distância estimada: <span className="font-medium">27 km</span></p>
                    </div>
                  </div>
                  <Link href="/rotas">
                    <Button className="w-full">
                      <MapPin className="mr-2 h-4 w-4" /> Ver Rota Otimizada
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </DashboardLayoutNew>
    </PageTransition>
  );
}