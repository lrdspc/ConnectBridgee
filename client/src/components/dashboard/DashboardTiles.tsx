import React, { useState, useEffect } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Clock, FileText, BarChart, Users, MapPin, AlertCircle, ChevronDown, ChevronUp, Maximize2, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Visit } from '@/lib/db';
import { Chart } from '@/components/ui/chart';
import { Link } from 'wouter';

// Configurando o ResponsiveGridLayout com o WidthProvider para detectar automaticamente a largura
const ResponsiveGridLayout = WidthProvider(Responsive);

// Tipos específicos para os blocos
type TileType = 'stats' | 'visits' | 'reports' | 'chart' | 'weather' | 'route';

// Interface para os dados de cada bloco
interface TileData {
  id: string;
  type: TileType;
  title: string;
  content?: any;
  color?: string;
  icon?: React.ReactNode;
}

// Props do componente
interface DashboardTilesProps {
  stats: {
    completed: number;
    scheduled: number;
    pending: number;
    inProgress: number;
  };
  visits: Visit[];
  weeklyVisits: { day: string; count: number }[];
  className?: string;
}

const DashboardTiles: React.FC<DashboardTilesProps> = ({
  stats,
  visits,
  weeklyVisits,
  className
}) => {
  // Estado para controlar as configurações de layout para diferentes tamanhos de tela
  const [layouts, setLayouts] = useState({
    lg: [
      { i: 'stats', x: 0, y: 0, w: 12, h: 1, minW: 6, maxW: 12 },
      { i: 'chart', x: 0, y: 1, w: 8, h: 2, minW: 4 },
      { i: 'visits', x: 8, y: 1, w: 4, h: 2, minW: 3 },
      { i: 'reports', x: 0, y: 3, w: 4, h: 2, minW: 3 },
      { i: 'weather', x: 4, y: 3, w: 4, h: 2, minW: 3 },
      { i: 'route', x: 8, y: 3, w: 4, h: 2, minW: 3 },
    ],
    md: [
      { i: 'stats', x: 0, y: 0, w: 10, h: 1, minW: 5, maxW: 10 },
      { i: 'chart', x: 0, y: 1, w: 6, h: 2, minW: 4 },
      { i: 'visits', x: 6, y: 1, w: 4, h: 2, minW: 3 },
      { i: 'reports', x: 0, y: 3, w: 4, h: 2, minW: 3 },
      { i: 'weather', x: 4, y: 3, w: 3, h: 2, minW: 3 },
      { i: 'route', x: 7, y: 3, w: 3, h: 2, minW: 3 },
    ],
    sm: [
      { i: 'stats', x: 0, y: 0, w: 6, h: 1, minW: 3, maxW: 6 },
      { i: 'chart', x: 0, y: 1, w: 6, h: 2, minW: 3 },
      { i: 'visits', x: 0, y: 3, w: 6, h: 2, minW: 3 },
      { i: 'reports', x: 0, y: 5, w: 6, h: 2, minW: 3 },
      { i: 'weather', x: 0, y: 7, w: 3, h: 2, minW: 3 },
      { i: 'route', x: 3, y: 7, w: 3, h: 2, minW: 3 },
    ],
    xs: [
      { i: 'stats', x: 0, y: 0, w: 4, h: 1, minW: 2, maxW: 4 },
      { i: 'chart', x: 0, y: 1, w: 4, h: 2, minW: 2 },
      { i: 'visits', x: 0, y: 3, w: 4, h: 2, minW: 2 },
      { i: 'reports', x: 0, y: 5, w: 4, h: 2, minW: 2 },
      { i: 'weather', x: 0, y: 7, w: 4, h: 2, minW: 2 },
      { i: 'route', x: 0, y: 9, w: 4, h: 2, minW: 2 },
    ],
  });

  // Estado para controlar quais tiles estão expandidos/colapsados
  const [expandedTiles, setExpandedTiles] = useState<Record<string, boolean>>({
    stats: false,
    chart: false,
    visits: false,
    reports: false,
    weather: false,
    route: false,
  });

  // Função para alternar o estado expandido/colapsado de um tile
  const toggleExpand = (id: string) => {
    setExpandedTiles(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Atualizar layouts quando os tiles expandidos mudarem
  useEffect(() => {
    // Poderia adicionar aqui lógica para ajustar layouts baseado em quais tiles estão expandidos
  }, [expandedTiles]);

  // Salvar o layout quando ele for alterado
  const handleLayoutChange = (currentLayout: any, allLayouts: any) => {
    localStorage.setItem('dashboardLayouts', JSON.stringify(allLayouts));
  };

  // Carregar layouts salvos, se existirem
  useEffect(() => {
    const savedLayouts = localStorage.getItem('dashboardLayouts');
    if (savedLayouts) {
      try {
        setLayouts(JSON.parse(savedLayouts));
      } catch (e) {
        console.error("Erro ao carregar layouts salvos:", e);
      }
    }
  }, []);

  // Dados dos tiles
  const tiles: TileData[] = [
    {
      id: 'stats',
      type: 'stats',
      title: 'Estatísticas',
      content: stats,
    },
    {
      id: 'chart',
      type: 'chart',
      title: 'Visitas Semanais',
      content: weeklyVisits,
      icon: <BarChart className="h-5 w-5" />,
    },
    {
      id: 'visits',
      type: 'visits',
      title: 'Próximas Visitas',
      content: visits.filter(v => v.status === 'scheduled' || v.status === 'in-progress').slice(0, 3),
      icon: <Clock className="h-5 w-5" />,
    },
    {
      id: 'reports',
      type: 'reports',
      title: 'Relatórios',
      content: { count: 5, pending: 2 },
      icon: <FileText className="h-5 w-5" />,
      color: 'bg-blue-500',
    },
    {
      id: 'weather',
      type: 'weather',
      title: 'Previsão do Tempo',
      content: { temp: 27, condition: 'Ensolarado', location: 'São Leopoldo, RS' },
      icon: <AlertCircle className="h-5 w-5" />,
      color: 'bg-yellow-500',
    },
    {
      id: 'route',
      type: 'route',
      title: 'Rotas do Dia',
      content: { distance: '15.2km', visits: 3 },
      icon: <MapPin className="h-5 w-5" />,
      color: 'bg-green-500',
    },
  ];

  // Renderiza um tile específico baseado no tipo
  const renderTileContent = (tile: TileData) => {
    const isExpanded = expandedTiles[tile.id];

    switch (tile.type) {
      case 'stats':
        return (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-3 shadow-sm border border-blue-200">
              <div className="flex items-center justify-between">
                <div className="bg-blue-500/10 p-2 rounded-lg">
                  <Clock className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <div className="mt-2 text-3xl font-bold text-blue-600">{stats.scheduled}</div>
              <div className="text-blue-800 text-sm font-medium mt-1">Agendadas</div>
            </div>
            
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-3 shadow-sm border border-yellow-200">
              <div className="flex items-center justify-between">
                <div className="bg-yellow-500/10 p-2 rounded-lg">
                  <Clock className="h-5 w-5 text-yellow-600" />
                </div>
              </div>
              <div className="mt-2 text-3xl font-bold text-yellow-600">{stats.inProgress}</div>
              <div className="text-yellow-800 text-sm font-medium mt-1">Em Progresso</div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-3 shadow-sm border border-purple-200">
              <div className="flex items-center justify-between">
                <div className="bg-purple-500/10 p-2 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-purple-600" />
                </div>
              </div>
              <div className="mt-2 text-3xl font-bold text-purple-600">{stats.pending}</div>
              <div className="text-purple-800 text-sm font-medium mt-1">Pendentes</div>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-3 shadow-sm border border-green-200">
              <div className="flex items-center justify-between">
                <div className="bg-green-500/10 p-2 rounded-lg">
                  <Check className="h-5 w-5 text-green-600" />
                </div>
              </div>
              <div className="mt-2 text-3xl font-bold text-green-600">{stats.completed}</div>
              <div className="text-green-800 text-sm font-medium mt-1">Concluídas</div>
            </div>
          </div>
        );
        
      case 'chart':
        return (
          <div className="h-full">
            <Chart
              type="bar"
              height={isExpanded ? 300 : 180}
              data={weeklyVisits}
              xAxis={{
                dataKey: "day",
              }}
              series={[
                {
                  dataKey: "count",
                  name: "Visitas",
                  color: "#7C3AED",
                },
              ]}
              showTooltip={true}
              showLegend={false}
              valueFormatter={(value) => `${value} visitas`}
            />
          </div>
        );
        
      case 'visits':
        return (
          <div className="space-y-3">
            {visits.filter(v => v.status === 'scheduled' || v.status === 'in-progress')
              .slice(0, isExpanded ? 5 : 3)
              .map((visit) => (
                <Link key={visit.id} href={`/visitas/${visit.id}`}>
                  <div className="border border-slate-200 rounded-xl p-3 cursor-pointer hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 shadow-sm">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold text-sm text-slate-700">{visit.clientName}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        visit.status === 'in-progress' 
                          ? 'bg-yellow-100 text-yellow-800 ring-1 ring-yellow-400/30' 
                          : 'bg-blue-100 text-blue-800 ring-1 ring-blue-400/30'
                      }`}>
                        {visit.status === 'in-progress' ? 'Em Andamento' : 'Agendada'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 mt-2 text-xs text-slate-500">
                      <MapPin className="h-3 w-3" />
                      <span className="truncate">{visit.address}</span>
                    </div>
                    <div className="mt-2 flex justify-between items-center text-xs">
                      <span className="text-slate-500">
                        {new Date(visit.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                        {visit.time ? ` · ${visit.time.substring(0, 5)}` : ''}
                      </span>
                      <span className="text-primary font-medium">Ver detalhes →</span>
                    </div>
                  </div>
                </Link>
              ))}
            <Link href="/visitas">
              <Button variant="outline" size="sm" className="w-full mt-2 rounded-xl border-slate-300 hover:border-primary/50 hover:bg-primary/5">
                Ver Todas
              </Button>
            </Link>
          </div>
        );
        
      case 'reports':
        return (
          <div className="h-full flex flex-col">
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <div className="bg-primary/10 text-primary p-3 rounded-xl mb-3 shadow-sm">
                <FileText className="h-6 w-6" />
              </div>
              <div className="text-3xl font-bold text-slate-800">{tile.content.count}</div>
              <div className="text-sm text-slate-500 mt-1">Relatórios Recentes</div>
              <div className="mt-3 text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full ring-1 ring-amber-200">
                {tile.content.pending} pendentes
              </div>
            </div>
            <Link href="/relatorio-vistoria">
              <Button className="w-full mt-3 bg-primary hover:bg-primary/90 rounded-xl">
                Novo Relatório
              </Button>
            </Link>
          </div>
        );
        
      case 'weather':
        return (
          <div className="h-full flex flex-col items-center justify-center text-center p-2">
            <div className="bg-gradient-to-br from-amber-50 to-amber-100 text-amber-600 p-3 rounded-xl mb-3 shadow-sm border border-amber-200">
              <AlertCircle className="h-6 w-6" />
            </div>
            <div className="text-3xl font-bold text-slate-800">{tile.content.temp}°C</div>
            <div className="text-sm text-slate-600">{tile.content.condition}</div>
            <div className="mt-1 text-xs text-slate-500">{tile.content.location}</div>
            <div className="mt-4 grid grid-cols-2 gap-3 w-full">
              <div className="bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 p-2 rounded-xl shadow-sm">
                <p className="text-xs font-medium text-amber-800">Manhã</p>
                <p className="text-xs text-amber-600 font-bold">25°C</p>
              </div>
              <div className="bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 p-2 rounded-xl shadow-sm">
                <p className="text-xs font-medium text-amber-800">Tarde</p>
                <p className="text-xs text-amber-600 font-bold">29°C</p>
              </div>
            </div>
          </div>
        );
        
      case 'route':
        return (
          <div className="h-full flex flex-col items-center justify-center text-center p-2">
            <div className="bg-gradient-to-br from-green-50 to-green-100 text-green-600 p-3 rounded-xl mb-3 shadow-sm border border-green-200">
              <MapPin className="h-6 w-6" />
            </div>
            <div className="text-3xl font-bold text-slate-800">{tile.content.distance}</div>
            <div className="text-sm text-slate-600">Distância Total</div>
            <div className="mt-1 text-xs text-slate-500">{tile.content.visits} visitas</div>
            <Link href="/rotas">
              <Button variant="outline" size="sm" className="mt-4 w-full rounded-xl border-slate-300 hover:border-green-300 hover:bg-green-50">
                Ver Rota
              </Button>
            </Link>
          </div>
        );
        
      default:
        return <div>Conteúdo não encontrado</div>;
    }
  };

  return (
    <div className={cn("pb-10", className)}>
      <ResponsiveGridLayout
        className="layout"
        layouts={layouts}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480 }}
        cols={{ lg: 12, md: 10, sm: 6, xs: 4 }}
        rowHeight={150}
        onLayoutChange={handleLayoutChange}
        isDraggable={true}
        isResizable={true}
        margin={[16, 16]}
      >
        {tiles.map((tile) => (
          <div key={tile.id} className="tile-container">
            <Card className="h-full overflow-hidden border border-slate-200 shadow-sm rounded-xl">
              <CardHeader className="p-3 flex-row items-center justify-between space-y-0 bg-gradient-to-r from-slate-50 to-white border-b border-slate-100">
                <CardTitle className="text-base flex items-center font-medium text-slate-700">
                  {tile.icon && <span className="mr-2 text-primary">{tile.icon}</span>}
                  {tile.title}
                </CardTitle>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 rounded-lg hover:bg-slate-100"
                    onClick={() => toggleExpand(tile.id)}
                  >
                    {expandedTiles[tile.id] ? (
                      <Minimize2 className="h-4 w-4 text-slate-500" />
                    ) : (
                      <Maximize2 className="h-4 w-4 text-slate-500" />
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-4 overflow-auto bg-white">
                {renderTileContent(tile)}
              </CardContent>
            </Card>
          </div>
        ))}
      </ResponsiveGridLayout>
    </div>
  );
};

export default DashboardTiles;